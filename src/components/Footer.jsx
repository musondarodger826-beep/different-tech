import {
  FaFacebookF,
  FaLinkedinIn,
  FaGithub,
  FaWhatsapp,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-yellow-500 text-white">

      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-10">


        {/* Company */}
        <div>

          <h2 className="text-3xl font-bold">
            <span className="text-white">
              Different
            </span>
            <span className="text-yellow-400">
              .Tech
            </span>
          </h2>


          <p className="mt-4 text-gray-400 leading-7">
            Building the Future with Technology through innovative
            software development, websites, cloud solutions, AI,
            cybersecurity, and digital transformation.
          </p>


          <p className="mt-5 text-yellow-400 font-semibold">
            Since 2017 Across Africa
          </p>

        </div>



        {/* Quick Links */}
        <div>

          <h3 className="text-xl font-bold text-yellow-400 mb-4">
            Quick Links
          </h3>


          <ul className="space-y-2 text-gray-400">

            <li>
              <a href="#home" className="hover:text-yellow-400 transition">
                Home
              </a>
            </li>

            <li>
              <a href="#about" className="hover:text-yellow-400 transition">
                About
              </a>
            </li>

            <li>
              <a href="#services" className="hover:text-yellow-400 transition">
                Services
              </a>
            </li>

            <li>
              <a href="#portfolio" className="hover:text-yellow-400 transition">
                Portfolio
              </a>
            </li>

            <li>
              <a href="#team" className="hover:text-yellow-400 transition">
                Team
              </a>
            </li>

            <li>
              <a href="#contact" className="hover:text-yellow-400 transition">
                Contact
              </a>
            </li>

          </ul>

        </div>




        {/* Contact */}
        <div>

          <h3 className="text-xl font-bold text-yellow-400 mb-4">
            Contact
          </h3>


          <div className="space-y-4 text-gray-400">


            <a
              href="tel:+260967622382"
              className="flex items-center gap-3 hover:text-yellow-400"
            >
              <FaPhoneAlt className="text-yellow-400"/>
              +260 967 622 382
            </a>



            <a
              href="mailto:info@different.tech"
              className="flex items-center gap-3 hover:text-yellow-400"
            >
              <FaEnvelope className="text-yellow-400"/>
              info@different.tech
            </a>



            <p className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-yellow-400"/>
              Zambia | South Africa
            </p>


          </div>



          {/* Social Media */}
          <div className="flex gap-5 mt-6 text-xl">


            <a
              href="#"
              className="hover:text-yellow-400 transition"
            >
              <FaFacebookF/>
            </a>


            <a
              href="#"
              className="hover:text-yellow-400 transition"
            >
              <FaLinkedinIn/>
            </a>


            <a
              href="#"
              className="hover:text-yellow-400 transition"
            >
              <FaGithub/>
            </a>


            <a
              href="https://wa.me/260967622382"
              target="_blank"
              className="hover:text-yellow-400 transition"
            >
              <FaWhatsapp/>
            </a>


          </div>


        </div>


      </div>



      {/* Bottom */}
      <div className="border-t border-gray-800 py-6 text-center text-gray-500">

        © {new Date().getFullYear()} Different.Tech |
        Building The Future With Technology.
        All Rights Reserved.

      </div>


    </footer>
  );
}