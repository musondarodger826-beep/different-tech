export default function Services() {
  const services = [
    {
      title: "Website Development",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
      description:
        "Professional, responsive websites that help businesses build a strong online presence.",
    },
    {
      title: "Mobile Application Development",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
      description:
        "Modern Android and iOS applications designed to improve customer and business operations.",
    },
    {
      title: "Cloud Solutions",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
      description:
        "Secure cloud platforms, hosting solutions, and digital infrastructure for growing businesses.",
    },
    {
      title: "Cybersecurity Solutions",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800",
      description:
        "Security systems designed to protect business data, applications, and digital assets.",
    },
    {
      title: "AI & Automation",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
      description:
        "Smart AI solutions that automate tasks and improve business productivity.",
    },
    {
      title: "Tracking & Workforce Systems",
      image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800",
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