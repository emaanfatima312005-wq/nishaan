"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FiHelpCircle,
  FiChevronDown,
  FiImage,
  FiMapPin,
  FiCpu,
  FiShield,
  FiMic,
  FiType,
} from "react-icons/fi";

const faqData = [
  {
    category: "Getting Started",
    icon: FiHelpCircle,
    questions: [
      {
        question: "What is Nishaan?",
        answer:
          "Nishaan is an AI-powered location discovery system that helps users identify potential locations using images, voice descriptions, text clues, and geographic information.",
      },
      {
        question: "How does Nishaan work?",
        answer:
          "You provide an image, description, or other location clues. Nishaan analyzes the available information using AI and geospatial technologies and returns potential location matches.",
      },
      {
        question: "Do I need an account to use Nishaan?",
        answer:
          "Depending on the available features, some parts of Nishaan may be accessible without an account. Features that require saved information or personalized functionality may require additional user information.",
      },
    ],
  },

  {
    category: "Image Analysis",
    icon: FiImage,
    questions: [
      {
        question: "Can I upload an image to identify a location?",
        answer:
          "Yes. Nishaan can analyze user-provided images and look for visual clues that may help identify a potential geographic location.",
      },
      {
        question: "What type of images work best?",
        answer:
          "Images containing recognizable landmarks, road signs, buildings, streets, vehicles, landscapes, business signs, or other geographic clues may provide more useful information for analysis.",
      },
      {
        question: "Will Nishaan always identify the correct location?",
        answer:
          "No. AI-generated results are predictions and suggestions. Accuracy can vary depending on the quality of the image and the amount of recognizable information available.",
      },
    ],
  },

  {
    category: "Voice",
    icon: FiMic,
    questions: [
      {
        question: "Can I describe a location using my voice?",
        answer:
          "Yes. Nishaan can use voice descriptions as location clues. You can describe landmarks, roads, buildings, signs, surroundings, or other details that may help identify a location.",
      },
      {
        question: "What should I say when using voice input?",
        answer:
          "Try to describe as many useful details as possible, such as visible signs, road names, landmarks, buildings, nearby places, language, or other recognizable features.",
      },
      {
        question: "Does Nishaan understand every voice recording?",
        answer:
          "Voice results may vary depending on audio quality, pronunciation, background noise, and the information provided. Clear and detailed descriptions can help produce better results.",
      },
    ],
  },

  {
    category: "Text",
    icon: FiType,
    questions: [
      {
        question: "Can I type clues instead of uploading an image?",
        answer:
          "Yes. You can provide text-based clues about a location. Nishaan can use details such as road names, landmarks, signs, buildings, businesses, or surrounding areas to assist with location discovery.",
      },
      {
        question: "What kind of text clues should I provide?",
        answer:
          "Useful clues can include street names, shop names, road signs, landmarks, nearby buildings, area names, or descriptions of what you can see around you.",
      },
      {
        question: "Can I combine text with an image?",
        answer:
          "Yes. Providing additional text along with an image can give Nishaan more context and may help the system interpret the available location clues.",
      },
    ],
  },

  {
    category: "AI & Results",
    icon: FiCpu,
    questions: [
      {
        question: "How accurate are Nishaan's results?",
        answer:
          "Accuracy can vary from one location to another. Nishaan provides potential matches based on available clues, but important location information should always be independently verified.",
      },
      {
        question: "Why did Nishaan give me an unexpected result?",
        answer:
          "AI systems can interpret visual and geographic clues differently depending on the available information. An image or description with limited or ambiguous clues may result in less accurate predictions.",
      },
      {
        question: "Can I trust the result for navigation?",
        answer:
          "Nishaan is designed as a location assistance and discovery tool. You should verify important location information before relying on a result for navigation, travel, or other important decisions.",
      },
    ],
  },

  {
    category: "Privacy & Security",
    icon: FiShield,
    questions: [
      {
        question: "What happens to the images I upload?",
        answer:
          "Images submitted to Nishaan may be processed to provide location-analysis features. Please review the Privacy Policy for more information about how submitted information is handled.",
      },
      {
        question: "Does Nishaan sell my personal information?",
        answer:
          "Nishaan does not intend to sell users' personal information. Information may be processed when necessary to provide requested features, maintain the service, improve functionality, maintain security, or comply with applicable requirements.",
      },
      {
        question: "Can I request deletion of my information?",
        answer:
          "If you have questions about information associated with your use of Nishaan or want to request deletion of applicable data, you can contact the Nishaan team.",
      },
    ],
  },

  {
    category: "Location & Maps",
    icon: FiMapPin,
    questions: [
      {
        question: "Does Nishaan use my location?",
        answer:
          "Location-related information may be used when required to provide geographic and location-discovery functionality.",
      },
      {
        question: "Can Nishaan identify any location in Pakistan?",
        answer:
          "Nishaan is designed to help identify potential locations using available geographic clues. Results depend on the information provided and the system's ability to recognize relevant features.",
      },
      {
        question: "Can I use Nishaan for locations outside Pakistan?",
        answer:
          "Nishaan can potentially analyze geographic clues from different locations. However, accuracy depends on the available data and recognizable features in the submitted content.",
      },
    ],
  },
];

function FAQItem({ question, answer, isOpen, onClick }) {
  return (
    <div
      className={`border-b border-[#C8E6C9] last:border-b-0 ${
        isOpen ? "bg-[#C8E6C9]/20" : "bg-white"
      } transition-colors duration-300`}
    >
      <button
        type="button"
        onClick={onClick}
        className="w-full flex items-center justify-between gap-6 text-left px-6 py-5"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-[#0D3B0D]">{question}</span>

        <span
          className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center ${
            isOpen ? "bg-[#0D3B0D] text-white" : "bg-[#C8E6C9] text-[#0D3B0D]"
          } transition-all duration-300`}
        >
          <FiChevronDown
            className={`transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </span>
      </button>

      <div
        className={`grid transition-all duration-300 ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-6 pr-16 text-sm leading-7 text-[#1A1A1A]/65">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQs() {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...faqData.map((item) => item.category)];

  const visibleCategories =
    activeCategory === "All"
      ? faqData
      : faqData.filter((item) => item.category === activeCategory);

  const handleFAQClick = (categoryIndex, questionIndex) => {
    const id = `${categoryIndex}-${questionIndex}`;

    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
<<<<<<< HEAD
    <main className="relative min-h-screen text-[#1A1A1A] overflow-hidden">
      {/* ================================================= */}
      {/* FULL PAGE BACKGROUND IMAGE */}
      {/* ================================================= */}

      <div className="fixed inset-0 -z-10 overflow-hidden">
        <img
          src="/images/download.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-[0.25]"
        />
      </div>

=======
    <main className="min-h-screen bg-[#fbfcf7] text-[#1A1A1A]">
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <section className="relative overflow-hidden bg-[#0D3B0D] text-white">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#2F6B2F]/40" />

        <div className="absolute -bottom-40 left-10 w-96 h-96 rounded-full bg-[#5FAF5F]/10" />

        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32 text-center">
          <div
            className="w-16 h-16 mx-auto rounded-2xl bg-[#5FAF5F] flex items-center justify-center"
            data-aos="fade-up"
          >
            <FiHelpCircle className="text-3xl" />
          </div>

          <p
            className="mt-6 text-sm uppercase tracking-[0.25em] text-[#C8E6C9]"
            data-aos="fade-up"
          >
            Help Center
          </p>

          <h1
            className="mt-4 text-5xl md:text-7xl font-bold tracking-tight"
            data-aos="fade-up"
          >
            Frequently Asked
            <span className="block text-[#5FAF5F]">Questions</span>
          </h1>

          <p
            className="mt-6 max-w-2xl mx-auto text-lg leading-8 text-[#C8E6C9]"
            data-aos="fade-up"
          >
            Everything you need to know about using Nishaan to discover and
            identify locations.
          </p>
        </div>
      </section>

      {/* ================================================= */}
      {/* CATEGORY FILTER */}
      {/* ================================================= */}

      <section className="max-w-6xl mx-auto px-6 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl border border-[#C8E6C9] shadow-lg p-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => {
                  setActiveCategory(category);
                  setOpenFAQ(null);
                }}
                className={`whitespace-nowrap px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-[#0D3B0D] text-white"
                    : "text-[#0D3B0D] hover:bg-[#C8E6C9]/50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* FAQ CONTENT */}
      {/* ================================================= */}

      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="space-y-14">
          {visibleCategories.map((category, categoryIndex) => {
            const Icon = category.icon;

            return (
              <div key={category.category} data-aos="fade-up">
                {/* CATEGORY HEADER */}

                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-[#C8E6C9] flex items-center justify-center text-[#0D3B0D]">
                    <Icon className="text-xl" />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#5FAF5F]">
                      Questions
                    </p>

                    <h2 className="text-2xl font-bold text-[#0D3B0D]">
                      {category.category}
                    </h2>
                  </div>
                </div>

                {/* QUESTIONS */}

                <div className="bg-white rounded-2xl border border-[#C8E6C9] overflow-hidden shadow-sm">
                  {category.questions.map((faq, questionIndex) => {
                    const id = `${categoryIndex}-${questionIndex}`;

                    return (
                      <FAQItem
                        key={faq.question}
                        question={faq.question}
                        answer={faq.answer}
                        isOpen={openFAQ === id}
                        onClick={() =>
                          handleFAQClick(categoryIndex, questionIndex)
                        }
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================================================= */}
      {/* EXPLORE */}
      {/* ================================================= */}

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div
          className="relative overflow-hidden rounded-[2rem] bg-[#0D3B0D] px-8 py-14 md:px-16 text-center"
          data-aos="fade-up"
        >
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-[#5FAF5F]/20" />

          <div className="absolute -bottom-24 -left-20 w-60 h-60 rounded-full bg-[#2F6B2F]/30" />

          <div className="relative">
            <FiHelpCircle className="mx-auto text-[#5FAF5F] text-4xl" />

            <h2 className="mt-5 text-3xl md:text-4xl font-bold text-white">
              Ready to explore?
            </h2>

            <p className="mt-4 max-w-xl mx-auto text-[#C8E6C9] leading-7">
              Use Nishaan to turn images, voice descriptions, and text clues
              into potential locations.
            </p>

            <Link
              href="/explore"
<<<<<<< HEAD
              className="inline-block mt-7 px-7 py-3 rounded-xl bg-[#5FAF5F] text-white font-semibold 
              hover:bg-[#2F6B2F] hover:-translate-y-1 
=======
              className="inline-block mt-7 px-7 py-3 rounded-xl bg-[#5FAF5F] text-white font-semibold
              hover:bg-[#2F6B2F] hover:-translate-y-1
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
              transition-all duration-300"
            >
              Explore
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
