export default function Home() {
  return (
    <main className="min-h-screen bg-[#C8E6C9]">

      {/* Hero Section */}
      <section className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center">

          <p className="mb-4 text-[#2F6B2F] font-semibold tracking-wide uppercase">
            AI-Powered Geospatial Assistance
          </p>

          <h1 className="text-5xl md:text-7xl font-bold text-[#0D3B0D] leading-tight">
            Find Any Place
            <br />
            From Any Clue.
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-[#1A1A1A]">
            Describe what you know through text, voice, or an image
            and let Nishaan help you discover the location.
          </p>

          {/* Input Options */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">

            {/* Image */}
            <div className="bg-white rounded-2xl p-7 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              <div className="text-4xl mb-4">🖼️</div>

              <h2 className="text-xl font-bold text-[#0D3B0D]">
                Image
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Upload an image and let Nishaan identify the place.
              </p>
            </div>

            {/* Voice */}
            <div className="bg-white rounded-2xl p-7 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              <div className="text-4xl mb-4">🎙️</div>

              <h2 className="text-xl font-bold text-[#0D3B0D]">
                Voice
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Describe the location using your voice.
              </p>
            </div>

            {/* Text */}
            <div className="bg-white rounded-2xl p-7 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              <div className="text-4xl mb-4">✏️</div>

              <h2 className="text-xl font-bold text-[#0D3B0D]">
                Text
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Enter any clues you know about the location.
              </p>
            </div>

          </div>

          {/* Get Started */}
          <button className="mt-10 px-8 py-3 rounded-full bg-[#0D3B0D] text-white font-semibold hover:bg-[#2F6B2F] transition-all duration-300 hover:scale-105">
            Get Started
          </button>

        </div>
      </section>

    </main>
  );
}