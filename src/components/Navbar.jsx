import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    "Home",
    "Services",
    "About",
    "Projects",
    "Contact",
  ];

  return (
    <nav className="bg-gray-950 text-white fixed w-full top-0 z-50 border-b border-yellow-500">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
<div className="flex items-center gap-3">

  <div className="relative w-12 h-12">
    <div className="absolute inset-0 rounded-full border-2 border-yellow-500 animate-pulse"></div>

    <div className="absolute inset-2 rounded-full bg-yellow-500 flex items-center justify-center">
      <span className="text-gray-950 font-black text-xl">
        D
      </span>
    </div>
  </div>

  <div>
    <h1 className="text-2xl font-extrabold">
      <span className="text-yellow-500">
        Different
      </span>
      <span className="text-white">
        .Tech
      </span>
    </h1>

    <p className="text-xs text-gray-400 tracking-widest">
      BUILDING THE FUTURE
    </p>
  </div>

</div>
        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8">
          {links.map((link) => (
            <li key={link}>
              <a
                href={`#${link.toLowerCase()}`}
                className="hover:text-yellow-500 transition duration-300"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile Button */}
        <button
          className="md:hidden text-yellow-500 text-2xl"
          onClick={() => setOpen(!open)}
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <ul className="md:hidden bg-gray-900 px-6 py-4 space-y-4">
          {links.map((link) => (
            <li key={link}>
              <a
                href={`#${link.toLowerCase()}`}
                onClick={() => setOpen(false)}
                className="block hover:text-yellow-500"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}