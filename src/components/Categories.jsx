export default function Categories() {
  const categories = [
    {
      title: "Web Development",
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600",
    },
    {
      title: "Artificial Intelligence",
      image:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600",
    },
    {
      title: "Mobile Applications",
      image:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600",
    },
    {
      title: "Cyber Security",
      image:
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600",
    },
    {
      title: "Cloud Computing",
      image:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600",
    },
    {
      title: "Business Software",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600",
    },
  ];

  return (
    <section id="categories" className="bg-gray-950 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-bold text-center text-white mb-4">
          What We <span className="text-yellow-400">Build</span>
        </h2>

        <p className="text-center text-gray-400 mb-16 max-w-3xl mx-auto">
          We deliver innovative technology solutions that help businesses
          improve efficiency, security, and growth.
        </p>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((item, index) => (
            <div
              key={index}
              className="bg-black rounded-2xl overflow-hidden border border-yellow-500 hover:scale-105 transition duration-300 shadow-lg"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-56 object-cover"
              />

              <div className="p-6">
                <h3 className="text-2xl font-bold text-yellow-400">
                  {item.title}
                </h3>

                <p className="text-gray-300 mt-3">
                  Professional solutions designed to help your business succeed
                  with modern technology.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}