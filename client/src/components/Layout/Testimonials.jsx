const Testimonials = () => {
  const data = [
    {
      name: "Aman Sharma",
      role: "Software Engineer",
      text: "The live transcription feature is incredibly accurate and fast. I use it daily for meetings.",
      avatar: "https://i.pravatar.cc/100?img=7",
    },
    {
      name: "Priya Verma",
      role: "Content Creator",
      text: "YouTube transcription saves me HOURS. Upload → get clean text instantly. Super convenient!",
      avatar: "https://i.pravatar.cc/100?img=10",
    },
    {
      name: "Rohit Singh",
      role: "Student",
      text: "Fast, clean UI, and zero nonsense. Probably the smoothest Whisper-based app I've used.",
      avatar: "https://i.pravatar.cc/100?img=12",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <h2 className="text-center text-4xl font-bold text-gray-800 mb-14 tracking-tight">
        Loved By Users ❤️
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto px-6">
        {data.map((item, i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            {/* Avatar */}
            <div className="flex items-center gap-4 mb-5">
              <img
                src={item.avatar}
                alt={item.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.role}</p>
              </div>
            </div>

            {/* Testimonial */}
            <p className="text-gray-700 leading-relaxed text-[15px]">
              “{item.text}”
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
