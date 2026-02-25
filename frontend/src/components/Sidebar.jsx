import { SquarePen } from "lucide-react";

export default function Sidebar({
  chats,
  loadingChats,
  chatId,
  navigate,
  user,
  onLogout,
}) {
  return (
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
          onClick={() => navigate("/app")}
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
                    Number(chatId) === chat.id
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
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg 
                     cursor-pointer hover:bg-[#2a2a2a] 
                     transition-colors duration-200"
        >
          <div
            className="w-5 h-5 flex items-center justify-center 
                          rounded-full bg-green-600 text-white text-sm font-medium"
          >
            {user?.username?.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[16px] font-[400] capitalize text-white truncate">
              {user?.username}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
