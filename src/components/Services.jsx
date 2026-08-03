import {
  FaGlobe,
  FaMobileAlt,
  FaCloud,
  FaShieldAlt,
  FaRobot,
  FaCode,
  FaMapMarkedAlt,
} from "react-icons/fa";

const services = [
  {
    icon: <FaGlobe />,
    title: "Website Development",
    description:
      "Professional, responsive websites that help businesses build a strong online presence.",
  },
  {
    icon: <FaMobileAlt />,
    title: "Mobile Application Development",
    description:
      "Modern Android and iOS applications designed to improve customer and business operations.",
  },
  {
    icon: <FaCloud />,
    title: "Cloud Solutions",
    description:
      "Secure cloud platforms, hosting solutions, and digital infrastructure for growing businesses.",
  },
  {
    icon: <FaShieldAlt />,
    title: "Cybersecurity Solutions",
    description:
      "Security systems designed to protect business data, applications, and digital assets.",
  },
  {
    icon: <FaRobot />,
    title: "AI & Automation",
    description:
      "Smart AI solutions that automate tasks and improve business productivity.",
  },
  {
    icon: <FaMapMarkedAlt />,
    title: "Tracking & Workforce Systems",
    description:
      "Smart workforce management, biometric attendance, GPS tracking, and monitoring solutions.",
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="bg-black text-white py-24 px-6"
    >

      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-16">

          <span className="inline-block border border-yellow-500 text-yellow-400 px-5 py-2 rounded-full text-sm">
            WHAT WE DO
          </span>

          <h2 className="text-4xl md:text-5xl font-bold mt-6">
            Our{" "}
            <span className="text-yellow-400">
              Services
            </span>
          </h2>

          <p className="text-gray-400 mt-5 max-w-2xl mx-auto">
            We provide innovative technology solutions that help
            organizations improve efficiency, security, and growth.
          </p>

        </div>


        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {services.map((service, index) => (

            <div
              key={index}
              className="
              group
              bg-gray-950
              rounded-2xl
              p-8
              border
              border-gray-800
              hover:border-yellow-400
              hover:-translate-y-2
              transition-all
              duration-300
              "
            >

              {/* Icon */}
              <div
                className="
                w-16
                h-16
                rounded-xl
                bg-yellow-400
                flex
                items-center
                justify-center
                text-black
                text-3xl
                group-hover:scale-110
                transition
                "
              >
                {service.icon}
              </div>


              <h3 className="text-2xl font-bold mt-7">
                {service.title}
              </h3>


              <p className="text-gray-400 mt-4 leading-7">
                {service.description}
              </p>


              <div className="mt-6 h-1 w-12 bg-yellow-400 group-hover:w-full transition-all duration-500"></div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}