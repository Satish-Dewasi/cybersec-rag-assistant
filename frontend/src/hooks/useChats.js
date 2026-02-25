import { useEffect, useState } from "react";
import { getChats } from "../api/chatService";

export const useChats = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchChats = async () => {
    try {
      const data = await getChats();
      setChats(data);
    } catch (err) {
      console.error("Failed to load chats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return {
    chats,
    loading,
    fetchChats,
  };
};
