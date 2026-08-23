import { FaWhatsapp } from "react-icons/fa";

export default function WhatsApp() {
  return (
    <a
      href="https://wa.me/260967622382"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact Different.Tech on WhatsApp"
      className="
        fixed
        bottom-6
        right-6
        bg-green-500
        hover:bg-green-600
        text-white
        p-4
        rounded-full
        shadow-lg
        z-50
        transition
        duration-300
        hover:scale-110
      "
    >

      <FaWhatsapp size={30} />

    </a>
  );
}