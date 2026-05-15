import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import MessageItem from "./MessageItem";

export default function ChatWindow({ messages, chatId, forceScroll }) {
  const chatContainerRef = useRef(null);
  const isSwitchingChatRef = useRef(false);

  // Smart + forced scroll
  useEffect(() => {
    const el = chatContainerRef.current;
    if (!el) return;

    // If chat switching, skip smart logic
    if (isSwitchingChatRef.current) return;

    if (forceScroll) {
      el.scrollTop = el.scrollHeight;
      return;
    }

    const threshold = 100;
    const isNearBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < threshold;

    if (isNearBottom) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, forceScroll]);

  // Scroll to bottom on initial load
  useEffect(() => {
    const el = chatContainerRef.current;
    if (!el) return;

    // Only scroll if we have messages
    if (messages.length === 0) return;

    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [chatId, messages.length]);

  return (
    //className="flex-1  overflow-y-auto px-6 py-8 bg-[#212121]"
    <div
      ref={chatContainerRef}
      className="h-full overflow-y-auto px-6 py-8 bg-[#212121]"
    >
      {!chatId && messages.length === 0 ? (
        <div className="text-gray-500 text-center mt-20 text-sm">
          Start a new intelligence query.
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-8">
          {messages.map((msg) => (
            <MessageItem key={msg.id} msg={msg} />
          ))}
        </div>
      )}
    </div>
  );
}
