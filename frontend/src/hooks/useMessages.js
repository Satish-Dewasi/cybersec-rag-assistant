import { useEffect, useRef, useState } from "react";
import { getMessages, sendMessage } from "../api/chatService";

export const useMessages = (chatId, navigate, refreshChats) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const intervalRef = useRef(null);

  // Load messages when chat changes
  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const data = await getMessages(chatId);
        setMessages(data.messages || []);
      } catch (err) {
        console.error("Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [chatId]);

  // Cleanup typing interval
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const send = async (question) => {
    if (!question.trim() || sending) return;

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

    setMessages((prev) => [...prev, userMessage, loadingMessage]);

    try {
      // 🔥 EXTRACT CITATIONS HERE
      const { chat_id, answer, confidence_score, citations } =
        await sendMessage(question, chatId);

      await refreshChats();

      if (!chatId) {
        await refreshChats();
        navigate(`/app/${chat_id}`);
        return;
      }

      // Replace loading message with assistant placeholder
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessage.id
            ? {
                ...msg,
                content: "",
                loading: false,
                confidence: confidence_score,
                citations: citations || [], // ✅ STORE CITATIONS
                typing: true,
              }
            : msg,
        ),
      );

      // Typing effect
      let index = 0;
      const typingSpeed = Math.random() * 10 + 10;

      intervalRef.current = setInterval(() => {
        index++;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === loadingMessage.id
              ? { ...msg, content: answer.slice(0, index) }
              : msg,
          ),
        );

        if (index >= answer.length) {
          clearInterval(intervalRef.current);

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === loadingMessage.id ? { ...msg, typing: false } : msg,
            ),
          );
        }
      }, typingSpeed);
    } catch (err) {
      console.error("SEND ERROR:", err.response?.status, err.response?.data);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessage.id
            ? {
                ...msg,
                content: "⚠️ Failed to get response. Please retry.",
                loading: false,
              }
            : msg,
        ),
      );
    } finally {
      setSending(false);
    }
  };

  return {
    messages,
    loading,
    sending,
    send,
    setMessages,
  };
};
