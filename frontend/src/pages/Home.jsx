import { useAuth } from "../context/AuthContext"
import { useEffect, useRef, useState } from "react"
import axios from "axios"
import { SendHorizontal, SquarePen } from "lucide-react";
import "../App.css"
import { useParams, useNavigate } from "react-router-dom";


export default function Home() {
  const { user, logout } = useAuth()
  

const { chatId } = useParams();
const navigate = useNavigate()

  const [chats, setChats] = useState([])
  const [loadingChats, setLoadingChats] = useState(true)

  const [messages, setMessages] = useState([])
  const [loadingMessages, setLoadingMessages] = useState(false)

  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)

  const token = localStorage.getItem("access_token")
  // const bottomRef = useRef(null);

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  // Load Chats
  const fetchChats = async () => {
    try {
      const res = await axios.get("http://localhost:8000/chats", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setChats(res.data)
    } catch (err) {
      console.error("Failed to load chats")
    } finally {
      setLoadingChats(false)
    }
  }

  useEffect(() => {
    fetchChats()
  }, [])

  // Load Messages When Chat Changes
  useEffect(() => {
  if (!chatId) {
    setMessages([]);
    return;
  }

  const fetchMessages = async () => {
    try {
      setLoadingMessages(true)

      const res = await axios.get(
        `http://localhost:8000/chats/${chatId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      // Only update if messages are empty
      setMessages(res.data.messages || []);

    } catch (err) {
      console.error("Failed to load messages")
    } finally {
      setLoadingMessages(false)
    }
  }

  fetchMessages()
}, [chatId])

  // 🔹 SEND MESSAGE
  
 const handleSend = async () => {
  if (!input.trim() || sending) return;

  const question = input;
  setInput("");
  setSending(true);

  const userMessage = {
    id: Date.now(),
    role: "user",
    content: question,
  };

  const loadingMessage = {
    id: "loading-" + Date.now(),
    role: "assistant",
    content: "",
    loading: true,
  };

  // Add user + loading bubble
  setMessages((prev) => [...prev, userMessage, loadingMessage]);

  try {
    const res = await axios.post(
      "http://localhost:8000/ask",
      {
        query: question,
        chat_id: chatId,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const { chat_id, answer, confidence_score } = res.data;

    if (!chatId) {
      navigate(`/app/${chat_id}`);
      await fetchChats();
    }

    // Replace loading message with real assistant message
    // Replace loading with empty assistant message first
setMessages((prev) =>
  prev.map((msg) =>
    msg.id === loadingMessage.id
      ? {
          id: loadingMessage.id,
          role: "assistant",
          content: "",
          confidence: confidence_score,
          typing: true,
        }
      : msg
  )
);

// Start typewriter effect
let index = 0;
const typingSpeed = Math.random() * 10 + 10;// lower = faster

const interval = setInterval(() => {
  index++;

  setMessages((prev) =>
    prev.map((msg) =>
      msg.id === loadingMessage.id
        ? { ...msg, content: answer.slice(0, index) }
        : msg
    )
  );

  if (index >= answer.length) {
    clearInterval(interval);

    // Remove typing flag when done
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === loadingMessage.id
          ? { ...msg, typing: false }
          : msg
      )
    );
  }
}, typingSpeed);

  } catch (err) {
    console.error("Failed to send message");

    // Replace loading with error message
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === loadingMessage.id
          ? {
              ...msg,
              content: "⚠️ Failed to get response. Please retry.",
              loading: false,
              error: true,
            }
          : msg
      )
    );

  } finally {
    setSending(false);
  }
};

const chatContainerRef = useRef(null);

useEffect(() => {
  const el = chatContainerRef.current;
  if (!el) return;

  el.scrollTop = el.scrollHeight;
}, [messages]);
  

  return (
    <div className="h-screen flex bg-[#212121] text-white">
      
      {/* Sidebar */}
      <div className="w-72 bg-[#181818] border-r border-[#2A2A2A] flex flex-col">
        
        <div className="h-[3.4rem] flex items-center px-4 border-b border-[#2A2A2A] bg-[#171717]">
  <img
    src="/images/aarvak_2.png"
    alt="Logo"
    className="h-8 w-auto object-contain"
  />
</div>

        <div className="p-3 mt-5">  
  <button
    onClick={() => {
    navigate("/app");  // no id
    setMessages([]);
  }}
    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg 
               text-sm text-gray-200 
               hover:bg-[#2a2a2a] 
               transition-colors duration-200
               text-[1rem]"
  >
    <SquarePen className="w-4 h-4" />
    <span>New chat</span>
  </button>
</div>

<div className="flex-1 overflow-y-auto px-3 py-4">
  
  {/* Heading */}
  <p className="text-xs text-gray-400 mb-3 px-2 font-medium">
    Your chats
  </p>

  {loadingChats ? (
    <p className="text-sm text-gray-500 px-2">Loading chats...</p>
  ) : chats.length === 0 ? (
    <p className="text-sm text-gray-500 px-2">No chats yet</p>
  ) : (
    <div className="space-y-1">
      {chats.map((chat) => (
        <div
          key={chat.id}
          onClick={() => navigate(`/app/${chat.id}`)}
          className={`px-3 py-2 rounded-lg cursor-pointer text-sm truncate transition-colors duration-200
            ${
              chatId === chat.id
                ? "bg-[#2a2a2a] text-white"
                : "text-gray-300 hover:bg-[#2a2a2a]"
            }`}
        >
          {chat.title || "Untitled Chat"}
        </div>
      ))}
    </div>
  )}
</div>

        <div className="p-3 border-t border-gray-800">
  <div
    onClick={handleLogout}
    className="flex items-center gap-3 px-3 py-2 rounded-lg 
               cursor-pointer hover:bg-[#2a2a2a] 
               transition-colors duration-200"
  >
    {/* Avatar */}
    <div className="w-5 h-5 flex items-center justify-center 
                    rounded-full bg-green-600 text-white text-sm font-medium">
      {user?.username?.charAt(0).toUpperCase()}
    </div>

    {/* Username */}
    <div className="flex-1 min-w-0">
      <p className="text-[16px] font-[400] capitalize text-white truncate">
        {user?.username}
      </p>
    </div>
  </div>
</div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        
        <div className=" h-[3.4rem] border-b border-[#2A2A2A]">
        </div>

  <div
    ref={chatContainerRef}
 className="flex-1 overflow-y-auto px-6 py-8 bg-[#212121]">
  {!chatId && messages.length === 0 ? (
    <div className="text-gray-500 text-center mt-20 text-sm">
      Start a new intelligence query.
    </div>
  ) : (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="max-w-3xl mx-auto space-y-8">
  {messages.map((msg) => (
    <div
      key={msg.id}
      className={`flex ${
        msg.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      {msg.role === "assistant" && (
        <div className="max-w-[85%] text-gray-200 leading-7 text-[15px]">
          
          {msg.loading ? (
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></div>
            </div>
          ) : (
            msg.content
          )}

          {msg.confidence != null && !msg.loading && (
            <div className="text-xs text-gray-500 mt-2">
              Confidence: {msg.confidence.toFixed(1)}%
            </div>
          )}
        </div>
      )}

      {msg.role === "user" && (
        <div className="bg-[#2f2f2f] px-4 py-2 rounded-2xl max-w-[75%]">
          {msg.content}
        </div>
      )}
    </div>
  ))}
</div>
    </div>
  )}
</div>

        <div className="w-full h-20 border-t border-gray-800 flex items-center justify-center bg-[#212121]">
  <div className="w-full max-w-3xl h-14 bg-[#303030] rounded-full flex items-center px-4">
    
    {/* Input */}
    <input
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && handleSend()}
      placeholder="Ask about a CVE, MITRE technique..."
      className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
    />

    {/* Send Button */}
    <button
      onClick={handleSend}
      disabled={sending}
      className="ml-2 h-10 w-10 flex cursor-pointer items-center justify-center rounded-full bg-white disabled:opacity-50"
    >
      <SendHorizontal className="w-5 h-5 text-[#303030]" />
    </button>

  </div>
</div>
      </div>
    </div>
  )
}