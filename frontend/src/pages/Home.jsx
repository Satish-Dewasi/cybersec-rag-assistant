import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"

export default function Home() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [chats, setChats] = useState([])
  const [loadingChats, setLoadingChats] = useState(true)

  const [activeChatId, setActiveChatId] = useState(null)
  const [messages, setMessages] = useState([])
  const [loadingMessages, setLoadingMessages] = useState(false)

  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)

  const token = localStorage.getItem("access_token")

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
    if (!activeChatId) return

    const fetchMessages = async () => {
      try {
        setLoadingMessages(true)

        const res = await axios.get(
          `http://localhost:8000/chats/${activeChatId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )

        setMessages(res.data.messages || [])
      } catch (err) {
        console.error("Failed to load messages")
      } finally {
        setLoadingMessages(false)
      }
    }

    fetchMessages()
  }, [activeChatId])

  // 🔹 SEND MESSAGE
  const handleSend = async () => {
    if (!input.trim() || sending) return

    const question = input
    setInput("")
    setSending(true)

    // Optimistic UI: add user message immediately
    const tempUserMessage = {
      id: Date.now(),
      role: "user",
      content: question,
    }

    setMessages((prev) => [...prev, tempUserMessage])

    try {
      const res = await axios.post(
        "http://localhost:8000/ask",
        {
          query: question,   // 🔥 FIXED
          chat_id: activeChatId,// null if new chat
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      const { chat_id, response, confidence } = res.data

      // If new chat was created
      if (!activeChatId) {
        setActiveChatId(chat_id)
        await fetchChats()
      }

      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: response,
        confidence: confidence,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      console.error("Failed to send message")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="h-screen flex bg-gray-950 text-white">
      
      {/* Sidebar */}
      <div className="w-72 bg-gray-900 border-r border-gray-800 flex flex-col">
        
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-lg font-semibold">Threat Intelligence</h1>
        </div>

        <div className="p-4 border-b border-gray-800">
          <button
            onClick={() => {
              setActiveChatId(null)
              setMessages([])
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded"
          >
            + New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loadingChats ? (
            <p className="text-sm text-gray-500">Loading chats...</p>
          ) : chats.length === 0 ? (
            <p className="text-sm text-gray-500">No chats yet</p>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`p-2 rounded cursor-pointer text-sm truncate ${
                  activeChatId === chat.id
                    ? "bg-gray-700"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
              >
                {chat.title || "Untitled Chat"}
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-800">
          <div className="mb-3">
            <p className="text-xs text-gray-400">Logged in as</p>
            <p className="font-medium truncate">{user?.name}</p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 p-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold">
            Cyber Threat Intelligence Assistant
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {!activeChatId && messages.length === 0 ? (
            <div className="text-gray-400 text-center mt-10">
              Start a new intelligence query.
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-2xl ${
                  msg.role === "user"
                    ? "ml-auto text-right"
                    : "mr-auto text-left"
                }`}
              >
                <div
                  className={`p-3 rounded-lg ${
                    msg.role === "user"
                      ? "bg-blue-600"
                      : "bg-gray-800"
                  }`}
                >
                  {msg.content}
                </div>

                {msg.role === "assistant" && msg.confidence !== null && (
                  <div className="text-xs text-gray-400 mt-1">
                    Confidence: {(msg.confidence * 100).toFixed(1)}%
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-800">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about a CVE, MITRE technique..."
              className="flex-1 p-2 bg-gray-800 rounded"
            />
            <button
              onClick={handleSend}
              disabled={sending}
              className="bg-blue-600 hover:bg-blue-700 px-4 rounded disabled:opacity-50"
            >
              {sending ? "..." : "Send"}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}