import {
  FaLinkedin,
  FaGithub,
  FaEnvelope,
  FaCode,
} from "react-icons/fa";

export default function Team() {

  const team = [
    {
      name: "Rodgers Musonda",
      role: "Founder & Software Developer",
      initials: "RM",
      description:
        "Building modern software solutions, AI systems, websites, mobile applications, and digital platforms that solve real business challenges.",
      linkedin: "#",
      github: "#",
      email: "mailto:musondagrant@outlook.com",
    },

    {
      name: "Dirk Van Deventer",
      role: "Director & Solutions Architect",
      initials: "DV",
      description:
        "Leading technology strategy with expertise in enterprise software, cloud solutions, cybersecurity, and workforce management systems.",
      linkedin: "#",
      github: "#",
      email: "mailto:dirk@digiwize.tech",
    },
  ];


  return (
    <section
      id="team"
      className="bg-black text-white py-24 px-6"
    >

      <div className="max-w-7xl mx-auto">


        {/* Heading */}
        <div className="text-center mb-16">

          <h2 className="text-5xl font-bold">
            Meet Our{" "}
            <span className="text-yellow-400">
              Team
            </span>
          </h2>

          <p className="text-gray-400 mt-4">
            The vision and expertise behind Different.Tech.
          </p>

        </div>



        {/* Team Cards */}
        <div className="grid md:grid-cols-2 gap-10">


          {team.map((member,index)=>(

            <div
              key={index}
              className="
              bg-gray-900
              border
              border-yellow-500
              rounded-2xl
              p-8
              text-center
              hover:-translate-y-2
              transition
              duration-300
              shadow-xl
              "
            >


              {/* Initial Badge */}
              <div
                className="
                w-28
                h-28
                rounded-full
                mx-auto
                bg-yellow-400
                text-black
                flex
                items-center
                justify-center
                text-4xl
                font-extrabold
                border-4
                border-white
                "
              >
                {member.initials}
              </div>



              <h3 className="text-3xl font-bold mt-6">
                {member.name}
              </h3>



              <p className="text-yellow-400 font-semibold mt-2">
                {member.role}
              </p>



              <div className="flex justify-center mt-5">
                <FaCode className="text-yellow-400 text-3xl"/>
              </div>



              <p className="text-gray-300 mt-6 leading-7">
                {member.description}
              </p>



              {/* Social Icons */}
              <div className="flex justify-center gap-6 mt-8 text-2xl">


                <a
                  href={member.linkedin}
                  target="_blank"
                  className="hover:text-yellow-400 transition"
                >
                  <FaLinkedin />
                </a>


                <a
                  href={member.github}
                  target="_blank"
                  className="hover:text-yellow-400 transition"
                >
                  <FaGithub />
                </a>


                <a
                  href={member.email}
                  className="hover:text-yellow-400 transition"
                >
                  <FaEnvelope />
                </a>


              </div>


            </div>

          ))}


        </div>


      </div>


    </section>
  );
}