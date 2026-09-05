"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FiUploadCloud, FiImage, FiX, FiArrowRight, FiLoader } from "react-icons/fi";

const MAX_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Maximum dimension (long side) the compressed image will have.
// GeoCLIP / StreetCLIP / CLIP models use 224-336px internally,
// so 1600px preserves far more detail than they need while keeping
// the base64 payload well below the 5MB mobile sessionStorage limit.
const MAX_LONG_SIDE = 1600;
const JPEG_QUALITY = 0.85;

export default function ImageInputPage() {
  const router = useRouter();
const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [compressing, setCompressing] = useState(false);

  // =====================================================
  // PROCESS FILE
  // =====================================================

  const processFile = async (selectedFile) => {
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

    // Compress the image client-side so the base64 string stays well
    // below the mobile sessionStorage limit (~5MB). Desktop browsers
    // follow the same path — no behavioral difference, just a smaller
    // payload and faster API calls.
    setCompressing(true);

    try {
      const compressedDataUrl = await compressImage(
        selectedFile,
        MAX_LONG_SIDE,
        JPEG_QUALITY,
      );

      setFile(selectedFile);
      setPreview(compressedDataUrl);
    } catch (err) {
      console.error("Image compression failed:", err);
      setError(
        "Could not process the image. Please try a different file or a smaller photo.",
      );
    } finally {
      setCompressing(false);
    }
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

    // Guard against the mobile QuotaExceededError that previously
    // froze the UI: a raw camera photo's base64 string can exceed
    // the ~5MB sessionStorage limit on mobile browsers, throwing
    // synchronously and skipping the navigation entirely.
    try {
      sessionStorage.setItem("nishaanImage", JSON.stringify(imageData));
    } catch (err) {
      console.error("sessionStorage write failed:", err);
      setError(
        "Could not store the image — please try a smaller photo or clear your browser data.",
      );
      return;
    }

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
              disabled={compressing}
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
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {compressing ? "Processing…" : "Choose File"}
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
            disabled={compressing}
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
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {compressing ? (
              <>
                <FiLoader className="animate-spin" />
                Processing…
              </>
            ) : (
              <>
                Analyze Image
                <FiArrowRight />
              </>
            )}
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

/* ================================================= */
/* CLIENT-SIDE IMAGE COMPRESSION                      */
/* ================================================= */

/**
 * Resize and JPEG-compress an image file via the Canvas API.
 *
 * Mobile camera photos from modern phones are typically 4-15MB.
 * Base64 encoding inflates them by ~33%, producing 5-20MB strings
 * that exceed the ~5MB mobile sessionStorage limit and cause
 * `sessionStorage.setItem` to throw `QuotaExceededError` — which
 * is what froze the image analysis flow on phones.
 *
 * This helper scales the image down to `maxLongSide` pixels on
 * its longest edge and exports it as JPEG at the given `quality`.
 * GeoCLIP, StreetCLIP, and OpenAI CLIP all resize internally to
 * 224-336px, so 1600px preserves far more detail than any model
 * needs while keeping the resulting payload well under 2MB.
 *
 * @param {File} file  The original image file from the file input.
 * @param {number} maxLongSide  Max pixel dimension on the long side.
 * @param {number} quality  JPEG quality 0-1 passed to canvas.toBlob.
 * @returns {Promise<string>} A `data:image/jpeg;base64,...` string.
 */
function compressImage(file, maxLongSide, quality) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);

    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      // Compute the scaled dimensions while preserving aspect ratio.
      const { width: srcW, height: srcH } = img;
      const longSide = Math.max(srcW, srcH);
      const scale = longSide > maxLongSide ? maxLongSide / longSide : 1;
      const dstW = Math.round(srcW * scale);
      const dstH = Math.round(srcH * scale);

      const canvas = document.createElement("canvas");
      canvas.width = dstW;
      canvas.height = dstH;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Could not create canvas context"));
        return;
      }

      // Use high-quality downscaling; browsers already apply a
      // Lanczos-style filter when drawing to a smaller canvas.
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, dstW, dstH);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas toBlob returned null"));
            return;
          }

          const reader = new FileReader();

          reader.onload = () => {
            if (typeof reader.result === "string") {
              resolve(reader.result);
            } else {
              reject(new Error("FileReader returned non-string result"));
            }
          };

          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(blob);
        },
        "image/jpeg",
        quality,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Image failed to load for compression"));
    };

    img.src = objectUrl;
  });
}
