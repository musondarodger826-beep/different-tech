import websiteImg from "../assets/website.jpg";
import mobileImg from "../assets/mobile-app.jpg";
import cloudImg from "../assets/cloud.jpg";
import cyberImg from "../assets/cybersecurity.jpg";
import aiImg from "../assets/ai.jpg";
import trackingImg from "../assets/tracking.jpg";

export default function Services() {
  const services = [
    {
      title: "Website Development",
      image: websiteImg,
      description:
        "Professional, responsive websites that help businesses build a strong online presence.",
    },
    {
      title: "Mobile Application Development",
      image: mobileImg,
      description:
        "Modern Android and iOS applications designed to improve customer and business operations.",
    },
    {
      title: "Cloud Solutions",
      image: cloudImg,
      description:
        "Secure cloud platforms, hosting solutions, and digital infrastructure for growing businesses.",
    },
    {
      title: "Cybersecurity Solutions",
      image: cyberImg,
      description:
        "Security systems designed to protect business data, applications, and digital assets.",
    },
    {
      title: "AI & Automation",
      image: aiImg,
      description:
        "Smart AI solutions that automate tasks and improve business productivity.",
    },
    {
      title: "Tracking & Workforce Systems",
      image: trackingImg,
      description:
        "Smart workforce management, biometric attendance, GPS tracking, and monitoring solutions.",
    },
  ];

  return (
    <section id="services" className="bg-black py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-yellow-400 font-semibold uppercase tracking-widest">
            WHAT WE DO
          </p>

          <h2 className="text-4xl md:text-5xl font-bold text-white mt-2">
            Our Services
          </h2>

          <p className="text-gray-400 mt-4 max-w-3xl mx-auto">
            We provide innovative technology solutions that help organizations
            improve efficiency, security, and growth.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-yellow-500/30 hover:-translate-y-2 transition-all duration-300"
            >
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-56 object-cover"
              />

              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-3">
                  {service.title}
                </h3>

                <p className="text-gray-400 leading-7">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}