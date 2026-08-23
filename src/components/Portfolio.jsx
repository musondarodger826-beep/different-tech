import {
  FaExternalLinkAlt,
  FaGlobe,
  FaMobileAlt,
  FaRobot,
  FaShieldAlt,
} from "react-icons/fa";

export default function Portfolio() {
  const projects = [
    {
      title: "Different.Tech Website",
      category: "Web Development",
      icon: <FaGlobe />,
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
      description:
        "Modern responsive company website with premium UI and animations.",
    },
    {
      title: "FortKnox Workforce",
      category: "Business Software",
      icon: <FaShieldAlt />,
      image:
        "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800",
      description:
        "Workforce management system with attendance, payroll, and tracking.",
    },
    {
      title: "AI Assistant",
      category: "Artificial Intelligence",
      icon: <FaRobot />,
      image:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
      description:
        "AI-powered assistant for business automation and customer support.",
    },
    {
      title: "Mobile App",
      category: "Mobile Development",
      icon: <FaMobileAlt />,
      image:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
      description:
        "Cross-platform mobile application for Android and iOS.",
    },
  ];

  return (
    <section id="portfolio" className="bg-black text-white py-24 px-6">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold">
            Our <span className="text-yellow-400">Portfolio</span>
          </h2>

          <p className="text-gray-400 mt-6 max-w-3xl mx-auto">
            Explore some of the innovative projects we have designed and
            developed for businesses and organizations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-gray-900 rounded-2xl overflow-hidden border border-yellow-500 hover:scale-105 duration-300 shadow-xl"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-52 object-cover"
              />

              <div className="p-6">

                <div className="text-yellow-400 text-3xl mb-4">
                  {project.icon}
                </div>

                <h3 className="text-2xl font-bold">
                  {project.title}
                </h3>

                <p className="text-yellow-400 mt-2">
                  {project.category}
                </p>

                <p className="text-gray-300 mt-4">
                  {project.description}
                </p>

                <button className="mt-6 flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-semibold">
                  View Project
                  <FaExternalLinkAlt />
                </button>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}