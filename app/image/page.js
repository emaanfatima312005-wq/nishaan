"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FiUploadCloud, FiImage, FiX, FiArrowRight } from "react-icons/fi";

const MAX_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function ImageInputPage() {
  const router = useRouter();
const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  // =====================================================
  // PROCESS FILE
  // =====================================================

  const processFile = (selectedFile) => {
    setError("");

    if (!selectedFile) return;

    // File type validation
    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError("Invalid file type. Please upload a JPG, PNG, or WEBP image.");
      return;
    }

    // File size validation
    if (selectedFile.size > MAX_SIZE) {
      setError("Image size must be less than 10 MB.");
      return;
    }

    setFile(selectedFile);

    const reader = new FileReader();

    reader.onload = () => {
      setPreview(reader.result);
    };

    reader.readAsDataURL(selectedFile);
  };

  // =====================================================
  // FILE INPUT
  // =====================================================

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    processFile(selectedFile);
  };

  // =====================================================
  // DRAG & DROP
  // =====================================================

  const handleDrop = (event) => {
    event.preventDefault();

    setDragging(false);

    const droppedFile = event.dataTransfer.files?.[0];
    processFile(droppedFile);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  // =====================================================
  // REMOVE FILE
  // =====================================================

  const removeFile = () => {
    setFile(null);
    setPreview("");
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // =====================================================
  // CONTINUE TO ANALYSIS
  // =====================================================

  const continueToAnalysis = () => {
    if (!file || !preview) {
      setError("Please select an image first.");
      return;
    }

    const imageData = {
      name: file.name,
      type: file.type,
      size: file.size,
      data: preview,
    };

    sessionStorage.setItem("nishaanImage", JSON.stringify(imageData));

    router.push("/image/analyzing");
  };

  return (
    <main className="relative min-h-[calc(100vh-96px)] overflow-hidden bg-[#fbfcf7] text-[#1A1A1A]">
      {/* ================================================= */}
      {/* FULL SCREEN 3D MOSQUE VIDEO BACKGROUND */}
      {/* ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-0
          overflow-hidden
          bg-[#fbfcf7]
        "
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="
            absolute
            left-1/2
            top-1/2
            h-full
            w-full
            min-h-full
            min-w-full
            -translate-x-1/2
            -translate-y-1/2
            scale-[1.25]
            object-cover
            animate-video-fade
          "
        >
          <source src="/videos/Historic_mosque.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Soft overlay */}
        <div
          className="
            absolute
            inset-0
            bg-[#fbfcf7]/20
          "
        />

        {/* Top and bottom fade */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-b
            from-[#fbfcf7]/40
            via-transparent
            to-[#fbfcf7]/50
          "
        />
      </div>

      {/* ================================================= */}
      {/* BACKGROUND VISUALS */}
      {/* ================================================= */}

      {/* LEFT — MINAR */}

      <img
        src="/images/minar.png"
        alt=""
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-[-100px]
          top-[100px]
          z-[2]
          hidden
          h-[calc(100vh-100px)]
          w-auto
          max-w-none
          select-none
          opacity-[0.10]
          lg:block
        "
      />

      {/* RIGHT — PAKISTAN MAP */}

      <img
        src="/images/map.png"
        alt=""
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          right-[-80px]
          top-[200px]
          z-[2]
          hidden
          w-[500px]
          select-none
          opacity-[0.07]
          lg:block
        "
      />

      {/* ================================================= */}
      {/* PROGRESS */}
      {/* ================================================= */}

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-5xl
          px-5
          pt-8
          sm:px-8
          lg:px-10
        "
      >
        <div className="flex items-center">
          <Step number="1" label="Input" active />

          <Line active />

          <Step number="2" label="Analyzing" />

          <Line />

          <Step number="3" label="Output" />
        </div>
      </div>

      {/* ================================================= */}
      {/* MAIN CONTENT */}
      {/* ================================================= */}

      <section
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-[620px]
          max-w-4xl
          flex-col
          items-center
          px-5
          py-12
          sm:px-8
          lg:py-16
        "
      >
        {/* ================================================= */}
        {/* HEADING */}
        {/* ================================================= */}

        <div className="mb-8 text-center">
          <p
            className="
              mb-3
              text-xs
              font-semibold
              uppercase
              tracking-[0.3em]
              text-[#5FAF5F]
            "
          >
            Location Discovery
          </p>

          <h1
            className="
              text-3xl
              font-semibold
              tracking-tight
              text-[#0D3B0D]
              sm:text-4xl
            "
          >
            Image Input
          </h1>

          <p
            className="
              mx-auto
              mt-3
              max-w-xl
              text-sm
              leading-6
              text-[#1A1A1A]/70
              sm:text-base
            "
          >
            Upload an image and let Nishaan analyze the visual clues to discover
            where the place might be.
          </p>
        </div>

        {/* ================================================= */}
        {/* UPLOAD AREA */}
        {/* ================================================= */}

        {!preview ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative
              flex
              min-h-[310px]
              w-full
              max-w-2xl
              flex-col
              items-center
              justify-center
              rounded-2xl
              border-2
              border-dashed
              px-6
              text-center
              transition-all
              ${
                dragging
                  ? "border-[#5FAF5F] bg-[#C8E6C9]/90"
                  : "border-[#5FAF5F] bg-white/90 backdrop-blur-sm"
              }
            `}
          >
            {/* Upload Icon */}

            <div
              className="
                mb-5
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-full
                bg-[#C8E6C9]
              "
            >
              <FiUploadCloud
                className="
                  text-4xl
                  text-[#2F6B2F]
                "
              />
            </div>

            {/* Heading */}

            <h2
              className="
                text-lg
                font-semibold
                text-[#1A1A1A]
              "
            >
              Drag & drop an image here
            </h2>

            {/* OR */}

            <p
              className="
                my-2
                text-sm
                text-[#1A1A1A]/60
              "
            >
              or
            </p>

            {/* Choose File */}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="
                rounded-lg
                bg-[#0D3B0D]
                px-7
                py-3
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition
                hover:bg-[#2F6B2F]
                active:scale-[0.98]
              "
            >
              Choose File
            </button>

            {/* Hidden File Input */}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Supported Formats */}

            <p
              className="
                mt-5
                text-xs
                text-[#1A1A1A]/60
              "
            >
              Supported formats: JPG, PNG, WEBP (Max 10MB)
            </p>
          </div>
        ) : (
          
          /* ================================================= */
          /* SELECTED IMAGE */
          /* ================================================= */

          <div
            className="
              w-full
              max-w-2xl
              rounded-2xl
              border
              border-[#C8E6C9]
              bg-white/95
              p-4
              shadow-sm
              backdrop-blur-sm
              sm:p-6
            "
          >
            {/* Image Preview */}

            <div
              className="
                relative
                overflow-hidden
                rounded-xl
                bg-[#C8E6C9]
              "
            >
              <img
                src={preview}
                alt="Selected image"
                className="
                  max-h-[380px]
                  w-full
                  object-contain
                "
              />

              {/* Remove */}

              <button
                type="button"
                onClick={removeFile}
                className="
                  absolute
                  right-3
                  top-3
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-white
                  text-[#1A1A1A]
                  shadow
                  transition
                  hover:bg-[#C8E6C9]
                "
                aria-label="Remove image"
              >
                <FiX />
              </button>
            </div>

            {/* File Information */}

            <div
              className="
                mt-4
                flex
                items-center
                gap-3
              "
            >
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-lg
                  bg-[#C8E6C9]
                "
              >
                <FiImage className="text-[#2F6B2F]" />
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className="
                    truncate
                    text-sm
                    font-semibold
                    text-[#1A1A1A]
                  "
                >
                  {file?.name}
                </p>

                <p
                  className="
                    text-xs
                    text-[#1A1A1A]/60
                  "
                >
                  {file ? (file.size / 1024 / 1024).toFixed(2) : "0.00"} MB
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

        {error && (
          <p
            className="
              mt-4
              rounded-lg
              bg-red-50
              px-4
              py-2
              text-sm
              text-red-600
            "
          >
            {error}
          </p>
        )}

        {/* ================================================= */}
        {/* ANALYZE BUTTON */}
        {/* ================================================= */}

        {preview && (
          <button
            type="button"
            onClick={continueToAnalysis}
            className="
              mt-7
              flex
              items-center
              gap-2
              rounded-lg
              bg-[#0D3B0D]
              px-7
              py-3
              font-semibold
              text-white
              transition
              hover:bg-[#2F6B2F]
              active:scale-[0.98]
            "
          >
            Analyze Image
            <FiArrowRight />
          </button>
        )}
      </section>
    </main>
  );
}

/* ================================================= */
/* PROGRESS STEP */
/* ================================================= */

function Step({ number, label, active = false }) {
  return (
    <div
      className="
        flex
        min-w-0
        flex-col
        items-center
      "
    >
      <div
        className={`
          flex
          h-8
          w-8
          items-center
          justify-center
          rounded-full
          text-xs
          font-bold
          ${active ? "bg-[#0D3B0D] text-white" : "bg-[#C8E6C9] text-[#2F6B2F]"}
        `}
      >
        {number}
      </div>

      <span
        className={`
          mt-2
          text-[11px]
          font-medium
          sm:text-xs
          ${active ? "text-[#0D3B0D]" : "text-[#1A1A1A]/60"}
        `}
      >
        {label}
      </span>
    </div>
  );
}

/* ================================================= */
/* PROGRESS LINE */
/* ================================================= */

function Line({ active = false }) {
  return (
    <div
      className={`
        mx-2
        mb-6
        h-[2px]
        flex-1
        sm:mx-4
        ${active ? "bg-[#2F6B2F]" : "bg-[#C8E6C9]"}
      `}
    />
  );
}
