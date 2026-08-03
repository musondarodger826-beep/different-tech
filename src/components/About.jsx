import {
  FaBullseye,
  FaEye,
  FaGem,
  FaCheckCircle,
} from "react-icons/fa";

export default function About() {

  const strengths = [
    "Innovative technology solutions",
    "Business-focused software development",
    "Secure and scalable systems",
    "African technology built for global standards",
  ];

  return (
    <section
      id="about"
      className="bg-gray-950 text-white py-24 px-6"
    >

      <div className="max-w-7xl mx-auto">


        {/* Heading */}
        <div className="text-center mb-16">

          <span className="inline-block border border-yellow-500 text-yellow-400 px-5 py-2 rounded-full text-sm">
            WHO WE ARE
          </span>


          <h2 className="text-5xl font-bold mt-6">
            About{" "}
            <span className="text-yellow-400">
              Different.Tech
            </span>
          </h2>


          <p className="text-gray-400 mt-6 max-w-3xl mx-auto text-lg leading-8">
            Different.Tech is a technology company focused on building
            modern digital solutions that help organizations improve
            efficiency, security, and business growth.
          </p>

        </div>



        <div className="grid md:grid-cols-2 gap-16 items-center">


          {/* Image */}
<div className="relative">

  {/* Gold Glow Effect */}
  <div className="absolute -inset-4 bg-yellow-400/20 blur-3xl rounded-3xl"></div>


  {/* Image */}
<div className="relative">

  {/* Gold Glow Effect */}
  <div className="absolute -inset-4 bg-yellow-400/20 blur-3xl rounded-3xl"></div>


  {/* Main Image */}
  <img
    src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=900"
    alt="Different.Tech Technology"
    className="
    relative
    rounded-3xl
    shadow-2xl
    border-2
    border-yellow-500
    w-full
    hover:scale-105
    transition
    duration-500
    "
  />


  {/* Floating Information Card */}
  <div
    className="
    absolute
    bottom-6
    left-6
    bg-black/90
    border
    border-yellow-500
    rounded-xl
    px-6
    py-4
    "
  >

    <h4 className="text-yellow-400 font-bold text-xl">
      Digital Innovation
    </h4>

    <p className="text-gray-300 text-sm">
      Building smart solutions for the future
    </p>

  </div>


</div>

  {/* Floating Card */}
  <div
    className="
    absolute
    bottom-6
    left-6
    bg-black/90
    border
    border-yellow-500
    rounded-xl
    px-6
    py-4
    "
  >

    <h4 className="text-yellow-400 font-bold text-xl">
      Digital Innovation
    </h4>

    <p className="text-gray-300 text-sm">
      Building smart solutions for the future
    </p>

  </div>


</div>



          {/* Content */}
          <div>


            {/* Mission */}
            <div className="bg-black border border-yellow-500 p-6 rounded-xl mb-6 hover:-translate-y-2 transition">

              <div className="flex items-center gap-4">

                <FaBullseye className="text-yellow-400 text-3xl" />

                <h3 className="text-2xl font-bold">
                  Our Mission
                </h3>

              </div>


              <p className="text-gray-300 mt-4 leading-7">
                To deliver reliable technology solutions that help
                businesses operate smarter, faster, and more securely.
              </p>

            </div>



            {/* Vision */}
            <div className="bg-black border border-yellow-500 p-6 rounded-xl mb-6 hover:-translate-y-2 transition">

              <div className="flex items-center gap-4">

                <FaEye className="text-yellow-400 text-3xl" />

                <h3 className="text-2xl font-bold">
                  Our Vision
                </h3>

              </div>


              <p className="text-gray-300 mt-4 leading-7">
                To become a leading African technology company creating
                innovative solutions that connect businesses to the future.
              </p>

            </div>



            {/* Values */}
            <div className="bg-black border border-yellow-500 p-6 rounded-xl hover:-translate-y-2 transition">

              <div className="flex items-center gap-4">

                <FaGem className="text-yellow-400 text-3xl" />

                <h3 className="text-2xl font-bold">
                  Our Values
                </h3>

              </div>


              <p className="text-gray-300 mt-4 leading-7">
                Innovation, Integrity, Excellence, Customer Success,
                Teamwork, and Continuous Improvement.
              </p>

            </div>


          </div>

        </div>



        {/* Why Choose Us */}
        <div className="mt-20">

          <h3 className="text-4xl font-bold text-center">
            Why Choose{" "}
            <span className="text-yellow-400">
              Different.Tech?
            </span>
          </h3>


          <div className="grid md:grid-cols-4 gap-6 mt-10">

            {strengths.map((item,index)=>(
              <div
                key={index}
                className="
                bg-black
                border
                border-gray-800
                rounded-xl
                p-6
                hover:border-yellow-400
                transition
                "
              >

                <FaCheckCircle className="text-yellow-400 text-2xl mb-4"/>

                <p className="text-gray-300">
                  {item}
                </p>

              </div>
            ))}

          </div>

        </div>


      </div>

    </section>
  );
}