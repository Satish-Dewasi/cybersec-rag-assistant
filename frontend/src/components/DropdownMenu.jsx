import { useEffect, useRef } from "react";

export default function DropdownMenu({
  position,
  items,
  onClose,
  width = 176, // default w-44
}) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={dropdownRef}
      className="fixed bg-[#202020] border border-[#2A2A2A] rounded-xl shadow-lg py-2 z-[9999]"
      style={{
        top: position.top,
        left: position.left,
        width,
      }}
    >
      {items.map((item, index) =>
        item.type === "divider" ? (
          <div key={index} className="my-2 border-t border-[#2A2A2A]" />
        ) : (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              item.onClick?.();
              onClose();
            }}
            className={`flex items-center gap-3 w-full px-4 py-2 text-sm transition hover:bg-[#2a2a2a]
              ${item.variant === "danger" ? "text-red-400" : "text-gray-300"}`}
          >
            {item.icon && <item.icon className="w-4 h-4" />}
            {item.label}
          </button>
        ),
      )}
    </div>
  );
}
