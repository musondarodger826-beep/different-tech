import { FaArrowRight, FaCode, FaRocket } from "react-icons/fa";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen bg-black text-white flex items-center overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600')",
        }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/80"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 grid md:grid-cols-2 gap-16 items-center">

        {/* Left Side */}
        <div>

          {/* Small Badge */}
          <div className="inline-flex items-center gap-2 border border-yellow-500 px-4 py-2 rounded-full text-yellow-400 mb-6">
            <FaRocket />
            Innovation • Technology • Future
          </div>


          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
            Building the{" "}
            <span className="text-yellow-400">
              Future
            </span>{" "}
            with Technology
          </h1>


          <p className="mt-8 text-xl text-gray-300 leading-8">
            Different.Tech creates powerful digital solutions including
            websites, mobile applications, enterprise software, AI solutions,
            cloud platforms, and smart business systems.
          </p>


          {/* Buttons */}
          <div className="mt-10 flex gap-5 flex-wrap">

            <button className="bg-yellow-400 text-black px-8 py-4 rounded-xl font-bold hover:bg-yellow-300 transition flex items-center gap-3">
              Start Your Project
              <FaCode />
            </button>


            <a
              href="#projects"
              className="border-2 border-yellow-400 text-yellow-400 px-8 py-4 rounded-xl flex items-center gap-3 hover:bg-yellow-400 hover:text-black transition"
            >
              View Portfolio
              <FaArrowRight />
            </a>

          </div>


          {/* Statistics */}
          <div className="grid grid-cols-3 gap-8 mt-20">

            <div>
              <h2 className="text-4xl font-bold text-yellow-400">
                50+
              </h2>
              <p className="text-gray-400">
                Projects
              </p>
            </div>


            <div>
              <h2 className="text-4xl font-bold text-yellow-400">
                25+
              </h2>
              <p className="text-gray-400">
                Clients
              </p>
            </div>


            <div>
              <h2 className="text-4xl font-bold text-yellow-400">
                5+
              </h2>
              <p className="text-gray-400">
                Years
              </p>
            </div>

          </div>

        </div>


        {/* Right Side */}
        <div className="hidden md:flex justify-center">

          <div className="relative">

            <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-20 rounded-full"></div>

            <img
              src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=700"
              alt="Technology"
              className="relative rounded-2xl shadow-2xl border border-yellow-500 w-[500px]"
            />

          </div>

        </div>


      </div>

    </section>
  );
}