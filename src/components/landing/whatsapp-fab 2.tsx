import { memo } from "react";

const WHATSAPP_NUMBER = "919310665960";
const MESSAGE = "Hi BechnaSeekho team! I'd like to learn more about your platform.";

export const WhatsAppFab = memo(function WhatsAppFab() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGE)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with our team on WhatsApp"
      className="group fixed bottom-5 right-5 z-[9999] flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white shadow-md transition-transform duration-200 hover:scale-105 active:scale-95"
    >
      <img
        src="https://static.vecteezy.com/system/resources/previews/016/716/468/non_2x/whatsapp-icon-free-png.png"
        alt=""
        aria-hidden="true"
        className="h-7 w-7 object-contain"
        draggable={false}
      />
      <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
        Chat on WhatsApp
      </span>
    </a>
  );
});
