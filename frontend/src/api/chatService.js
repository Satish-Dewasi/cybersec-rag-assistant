import api from "./axios";

export const getChats = async () => {
  const res = await api.get("/chats");
  return res.data;
};

export const getMessages = async (chatId) => {
  const res = await api.get(`/chats/${chatId}`);
  return res.data;
};

export const sendMessage = async (query, chatId) => {
  const res = await api.post("/ask", {
    query,
    chat_id: chatId,
  });
  return res.data;
};
