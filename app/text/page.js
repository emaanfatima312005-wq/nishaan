"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiMapPin } from "react-icons/fi";

const MAX_LENGTH = 300;

export default function TextInputPage() {
  const router = useRouter();

  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedText = text.trim();

    if (!trimmedText) {
      setError("Please provide some details about the location.");
      return;
    }

    if (trimmedText.length < 10) {
      setError("Please provide a little more detail to help Nishaan.");
      return;
    }

    sessionStorage.setItem("nishaan_text_clue", trimmedText);

    router.push("/text/analyzing");
  };

  const handleChange = (e) => {
    const value = e.target.value;

    if (value.length <= MAX_LENGTH) {
      setText(value);

      if (error) {
        setError("");
      }
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* =====================================================
          BACKGROUND IMAGE
      ===================================================== */}

      <div
        className="
          absolute
          inset-0
          bg-cover
          bg-center
          bg-no-repeat
        "
        style={{
          backgroundImage: "url('/images/textured-background.png')",
        }}
      />

      {/* =====================================================
          DARK GREEN OVERLAY
      ===================================================== */}

      <div className="absolute inset-0 bg-[#0D3B0D]/55" />

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="relative z-10 min-h-screen text-[#1A1A1A]">
        {/* =====================================================
            PROGRESS STEPS
        ===================================================== */}

        <section className="max-w-5xl mx-auto px-6 pt-10">
          <div className="flex items-center justify-center">
            {/* STEP 1 */}

            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-[#fbfcf7] text-[#0D3B0D] flex items-center justify-center text-sm font-bold shadow-sm">
                1
              </div>

              <span className="mt-2 text-xs font-semibold text-[#fbfcf7]">
                Input
              </span>
            </div>

            {/* LINE */}

            <div className="w-20 md:w-40 h-px bg-[#5FAF5F] mb-6 opacity-70" />

            {/* STEP 2 */}

            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-[#2F6B2F] border border-[#5FAF5F] text-[#C8E6C9] flex items-center justify-center text-sm font-semibold">
                2
              </div>

              <span className="mt-2 text-xs text-[#C8E6C9]">Analyzing</span>
            </div>

            {/* LINE */}

            <div className="w-20 md:w-40 h-px bg-[#5FAF5F] mb-6 opacity-70" />

            {/* STEP 3 */}

            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-[#2F6B2F] border border-[#5FAF5F] text-[#C8E6C9] flex items-center justify-center text-sm font-semibold">
                3
              </div>

              <span className="mt-2 text-xs text-[#C8E6C9]">Result</span>
            </div>
          </div>
        </section>

        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}

        <section className="max-w-3xl mx-auto px-6 py-12">
          {/* ===================================================
              HEADING
          =================================================== */}

          <div className="text-center">
            {/* LOCATION ICON */}

            <div
              className="
                inline-flex
                items-center
                justify-center
                w-14
                h-14
                rounded-full
                bg-[#2F6B2F]
                border
                border-[#5FAF5F]
                text-[#C8E6C9]
                mb-5
                shadow-lg
              "
            >
              <FiMapPin size={24} />
            </div>

            {/* HEADING */}

            <h1 className="text-3xl md:text-5xl font-semibold text-[#fbfcf7]">
              Describe the Place
            </h1>

            {/* DESCRIPTION */}

            <p className="mt-4 max-w-xl mx-auto text-sm md:text-base leading-7 text-[#C8E6C9]">
              Tell Nishaan what you remember about the location. Even the
              smallest clue can help us find the place.
            </p>
          </div>

          {/* ===================================================
              FORM
          =================================================== */}

          <form onSubmit={handleSubmit} className="mt-10">
            <div
              className="
                rounded-3xl
                border
                border-[#5FAF5F]/40
                bg-[#fbfcf7]
                shadow-2xl
                p-5
                md:p-7
              "
            >
              {/* =================================================
                  LABEL
              ================================================= */}

              <div className="flex items-center justify-between mb-3">
                <label
                  htmlFor="location-clue"
                  className="text-sm font-bold text-[#0D3B0D]"
                >
                  Your location clues
                </label>

                <span className="text-xs font-medium text-[#2F6B2F]">
                  {text.length}/{MAX_LENGTH}
                </span>
              </div>

              {/* =================================================
                  TEXT AREA
              ================================================= */}

              <textarea
                id="location-clue"
                value={text}
                onChange={handleChange}
                maxLength={MAX_LENGTH}
                rows={7}
                placeholder="Write in English or Roman Urdu"
                className="
                  w-full
                  resize-none
                  rounded-2xl
                  border
                  border-[#5FAF5F]/40
                  bg-[#fbfcf7]
                  p-5
                  text-sm
                  md:text-base
                  text-[#0D3B0D]
                  font-medium
                  leading-7
                  outline-none
                  transition-all
                  duration-300
                  placeholder:text-[#2F6B2F]/45
                  focus:border-[#2F6B2F]
                  focus:ring-4
                  focus:ring-[#5FAF5F]/20
                "
              />

              {/* =================================================
                  EXAMPLE
              ================================================= */}

              <div
                className="
                  mt-4
                  rounded-2xl
                  bg-[#C8E6C9]/50
                  border
                  border-[#5FAF5F]/30
                  p-4
                "
              >
                <p className="text-xs font-bold text-[#0D3B0D] mb-1">Example</p>

                <p className="text-xs md:text-sm leading-6 text-[#2F6B2F]">
                  "There was a large mosque near the old market. The mosque had
                  a green gate, and a tall minaret could be seen."
                </p>
              </div>

              {/* =================================================
                  HELPFUL CLUES
              ================================================= */}

              <div className="mt-5">
                <p className="text-xs font-bold text-[#0D3B0D] mb-3">
                  Helpful clues
                </p>

                <div className="flex flex-wrap gap-2">
                  {[
                    "Landmarks",
                    "Roads",
                    "Buildings",
                    "Markets",
                    "Mosques",
                    "Shops",
                  ].map((clue) => (
                    <span
                      key={clue}
                      className="
                        px-3
                        py-1.5
                        rounded-full
                        bg-[#C8E6C9]/60
                        border
                        border-[#5FAF5F]/30
                        text-xs
                        font-medium
                        text-[#2F6B2F]
                      "
                    >
                      {clue}
                    </span>
                  ))}
                </div>
              </div>

              {/* =================================================
                  ERROR
              ================================================= */}

              {error && (
                <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
              )}

              {/* =================================================
                  BUTTON
              ================================================= */}

              <button
                type="submit"
                disabled={!text.trim()}
                className="
                  mt-7
                  w-full
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  bg-[#0D3B0D]
                  px-6
                  py-4
                  text-sm
                  font-bold
                  text-[#fbfcf7]
                  transition-all
                  duration-300
                  hover:bg-[#2F6B2F]
                  hover:shadow-lg
                  hover:-translate-y-0.5
                  disabled:cursor-not-allowed
                  disabled:bg-[#C8E6C9]
                  disabled:text-[#1A1A1A]/40
                  disabled:shadow-none
                  disabled:transform-none
                "
              >
                Find Location
                <FiArrowRight size={18} />
              </button>
            </div>
          </form>

          {/* ===================================================
              BOTTOM MESSAGE
          =================================================== */}

          <p className="mt-7 text-center text-xs text-[#C8E6C9]">
            Nishaan turns memories into meaningful clues.
            <span className="mx-2 text-[#5FAF5F]">•</span>
            From Pakistan to the world.
          </p>
        </section>
      </div>
    </main>
  );
}
