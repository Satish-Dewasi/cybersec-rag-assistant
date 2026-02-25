import { useAuth } from "../context/AuthContext";
import { useEffect, useRef, useState } from "react";
import { SendHorizontal, SquarePen } from "lucide-react";
import "../App.css";
import { useParams, useNavigate } from "react-router-dom";
import { useChats } from "../hooks/useChats";
import { useMessages } from "../hooks/useMessages";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";

export default function Home() {
  const { user, logout } = useAuth();

  const { chatId } = useParams();
  const navigate = useNavigate();

  const { chats, loading: loadingChats, fetchChats } = useChats();

  const [input, setInput] = useState("");
  const [forceScroll, setForceScroll] = useState(false);

  const token = localStorage.getItem("access_token");

  const {
    messages,
    loading: loadingMessages,
    sending,
    send,
  } = useMessages(chatId, navigate, fetchChats);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // 🔹 SEND MESSAGE
  const handleSend = () => {
    if (!input.trim()) return;

    const message = input;
    setInput("");
    setForceScroll(true);
    send(message);
  };

  useEffect(() => {
    if (forceScroll) {
      setForceScroll(false);
    }
  }, [messages]);

  return (
    <div className="h-screen flex overflow-hidden bg-[#212121] text-white">
      <Sidebar
        chats={chats}
        loadingChats={loadingChats}
        chatId={chatId}
        navigate={navigate}
        user={user}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-[3.4rem] border-b border-[#2A2A2A]" />

        <ChatWindow
          messages={messages}
          chatId={chatId}
          forceScroll={forceScroll}
        />

        <ChatInput
          input={input}
          setInput={setInput}
          onSend={handleSend}
          sending={sending}
        />
      </div>
    </div>
  );
}
