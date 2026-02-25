import { useState, useEffect, useRef } from "react";
import {
  SquarePen,
  Share2,
  Pencil,
  Pin,
  Trash2,
  Ellipsis,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import DropdownMenu from "./DropdownMenu";

export default function Sidebar({
  chats,
  loadingChats,
  chatId,
  navigate,
  user,
  onLogout,
}) {
  const [menuOpen, setMenuOpen] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const dropdownRef = useRef(null);
  const [profileMenu, setProfileMenu] = useState(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleProfileMenu = (e) => {
    e.stopPropagation();

    // If already open → close it
    if (profileMenu) {
      setProfileMenu(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const dropdownHeight = 160;
    const dropdownWidth = 176;

    const spaceBelow = window.innerHeight - rect.bottom;

    let top;

    if (spaceBelow < dropdownHeight) {
      top = rect.top - dropdownHeight - 8;
    } else {
      top = rect.bottom + 8;
    }

    const left = rect.right - dropdownWidth;

    setProfileMenu({
      top,
      left,
    });
  };

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
                className={`relative group px-3 py-2 capitalize rounded-lg cursor-pointer text-[0.95rem] leading-3 truncate transition-colors duration-200
                  ${
                    Number(chatId) === chat.id
                      ? "bg-[#2a2a2a] text-white"
                      : "text-gray-300 hover:bg-[#2a2a2a]"
                  }`}
              >
                {chat.title || "Untitled Chat"}

                {/* 3 Dots Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();

                    // If same chat menu is already open → close it
                    if (menuOpen?.id === chat.id) {
                      setMenuOpen(null);
                      return;
                    }

                    const rect = e.currentTarget.getBoundingClientRect();

                    setMenuOpen({
                      id: chat.id,
                      top: rect.bottom + 4,
                      left: rect.right - 180,
                    });
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <Ellipsis className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FIXED DROPDOWN (ESCAPES OVERFLOW) */}
      {menuOpen && (
        <DropdownMenu
          position={menuOpen}
          onClose={() => setMenuOpen(null)}
          items={[
            {
              label: "Share",
              icon: Share2,
            },
            {
              label: "Rename",
              icon: Pencil,
            },
            {
              label: "Pin chat",
              icon: Pin,
            },
            { type: "divider" },
            {
              label: "Delete",
              icon: Trash2,
              variant: "danger",
              onClick: () => {
                setDeleteTargetId(menuOpen.id);
              },
            },
          ]}
        />
      )}

      <div className="p-3 border-t border-[#2A2A2A]">
        <div
          onClick={handleProfileMenu}
          className="flex items-center gap-3 px-3 py-2 rounded-lg 
                     cursor-pointer hover:bg-[#2a2a2a] 
                     transition-colors duration-200"
        >
          <div
            className="w-8 h-8 flex items-center justify-center 
             rounded-full 
             bg-[#222222] 
             border border-[#2A2A2A] 
             text-gray-300 
             text-sm font-medium"
          >
            {user?.username?.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[16px] font-[400] capitalize text-white truncate">
              {user?.username}
            </p>
          </div>
        </div>

        {/* PROFILE MENU */}
        {profileMenu && (
          <DropdownMenu
            position={profileMenu}
            onClose={() => setProfileMenu(null)}
            items={[
              {
                label: "Profile",
                icon: User,
              },
              {
                label: "Settings",
                icon: Settings,
              },
              { type: "divider" },
              {
                label: "Logout",
                icon: LogOut,
                variant: "danger",
                onClick: onLogout,
              },
            ]}
          />
        )}
      </div>

      {/* DELETE MODAL */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-md transition-all duration-200">
          <div className="bg-[#1f1f1f]/90 backdrop-blur-lg border border-[#2A2A2A] p-6 rounded-2xl w-80 shadow-2xl">
            <h2 className="text-white text-lg mb-3 font-medium">
              Delete this chat?
            </h2>

            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="px-4 py-2 rounded-lg text-gray-300 hover:bg-[#2a2a2a] transition"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  console.log("Delete chat:", deleteTargetId);
                  setDeleteTargetId(null);
                }}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
