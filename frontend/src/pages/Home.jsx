import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
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

  const { messages, sending, send } = useMessages(chatId, navigate, fetchChats);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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

  const hasMessages = messages.length > 0;

  return (
    <div className="h-screen flex overflow-hidden bg-[#212121] text-white">
      {/* Sidebar */}
      <Sidebar
        chats={chats}
        loadingChats={loadingChats}
        chatId={chatId}
        navigate={navigate}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-[3.4rem] border-b border-[#2A2A2A]" />

        {!hasMessages ? (
          // ================= CENTER MODE =================
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <h1 className="text-[1.8rem] md:text-[2.1rem]  text-gray-200 mb-8 text-center">
              Threat Intelligence Assistant
            </h1>

            <div className="w-full max-w-3xl">
              <ChatInput
                input={input}
                setInput={setInput}
                onSend={handleSend}
                sending={sending}
              />
            </div>
          </div>
        ) : (
          // ================= CHAT MODE =================
          <>
            <div className="flex-1 overflow-hidden">
              <ChatWindow
                messages={messages}
                chatId={chatId}
                forceScroll={forceScroll}
              />
            </div>

            <div className="w-full max-w-3xl mx-auto px-4 pb-4">
              <ChatInput
                input={input}
                setInput={setInput}
                onSend={handleSend}
                sending={sending}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
