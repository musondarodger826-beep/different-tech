import {
  FaShieldAlt,
  FaTruck,
  FaGlobe,
} from "react-icons/fa";

export default function Projects() {

  const projects = [
    {
      icon: <FaShieldAlt />,
      title: "FortKnox Workforce Platform",
      description:
        "Manage Your Workforce. All in One Platform. FortKnox Workforce combines employee management, biometric attendance, payroll, live vehicle tracking, and GuardWatch mobile into one connected workforce solution built in Africa.",
    },

    {
      icon: <FaTruck />,
      title: "Vehicle Tracking System",
      description:
        "A smart logistics solution providing vehicle tracking, convoy monitoring, GPS visibility, route management, and real-time fleet operations.",
    },

    {
      icon: <FaGlobe />,
      title: "Business Websites",
      description:
        "Modern responsive websites and digital platforms designed to help businesses build their online presence and grow.",
    },
  ];


  return (
    <section
      id="projects"
      className="bg-gray-950 text-white py-24 px-6"
    >

      <div className="max-w-7xl mx-auto">


        {/* Heading */}
        <div className="text-center mb-14">

          <h2 className="text-5xl font-bold">
            Our{" "}
            <span className="text-yellow-400">
              Projects
            </span>
          </h2>


          <p className="text-gray-400 mt-5 max-w-3xl mx-auto">
            Technology solutions built by Different.Tech to solve
            real business challenges through innovation and automation.
          </p>

        </div>



        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">


          {projects.map((project,index)=>(

            <div
              key={index}
              className="
              bg-black
              rounded-2xl
              p-8
              border
              border-yellow-500
              hover:-translate-y-2
              transition
              duration-300
              "
            >

              <div className="text-yellow-400 text-4xl mb-5">
                {project.icon}
              </div>


              <h3 className="text-2xl font-bold text-yellow-400">
                {project.title}
              </h3>


              <p className="text-gray-300 mt-5 leading-7">
                {project.description}
              </p>


              <button
                className="
                mt-6
                text-yellow-400
                font-semibold
                hover:text-white
                "
              >
                Learn More →
              </button>


            </div>

          ))}


        </div>


      </div>

    </section>
  );
}