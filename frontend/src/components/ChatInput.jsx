import { SendHorizontal } from "lucide-react";

export default function ChatInput({ input, setInput, onSend, sending }) {
  return (
    <div className="w-full h-20   flex items-center justify-center bg-[#212121]">
      <div className="w-full max-w-3xl h-14 bg-[#303030] rounded-full flex items-center px-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          placeholder="Ask about a CVE, MITRE technique..."
          className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
        />

        <button
          onClick={onSend}
          disabled={sending}
          className="ml-2 h-10 w-10 flex cursor-pointer items-center justify-center rounded-full bg-white disabled:opacity-50"
        >
          <SendHorizontal className="w-5 h-5 text-[#303030]" />
        </button>
      </div>
    </div>
  );
}
