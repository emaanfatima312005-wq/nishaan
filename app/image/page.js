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

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    processFile(selectedFile);
  };

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

  const removeFile = () => {
    setFile(null);
    setPreview("");
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
    <main className="min-h-[calc(100vh-96px)] bg-[#fbfcf7] text-[#1A1A1A]">
      {/* Progress */}
      <div className="mx-auto max-w-5xl px-5 pt-8 sm:px-8 lg:px-10">
        <div className="flex items-center">
          <Step number="1" label="Input" active />

          <Line active />

          <Step number="2" label="Analyzing" />

          <Line />

          <Step number="3" label="Output" />
        </div>
      </div>

      {/* Main Content */}
      <section className="mx-auto flex min-h-[620px] max-w-4xl flex-col items-center px-5 py-12 sm:px-8 lg:py-16">
        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-[#0D3B0D] sm:text-4xl">
            Image Input
          </h1>

          <p className="mt-3 text-sm text-[#1A1A1A]/70 sm:text-base">
            Upload an image or choose one from your device.
          </p>
        </div>

        {/* Upload Area */}
        {!preview ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex min-h-[310px] w-full max-w-2xl flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 text-center transition-all ${
              dragging
                ? "border-[#5FAF5F] bg-[#C8E6C9]"
                : "border-[#5FAF5F] bg-white"
            }`}
          >
            {/* Upload Icon */}
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#C8E6C9]">
              <FiUploadCloud className="text-4xl text-[#2F6B2F]" />
            </div>

            <h2 className="text-lg font-semibold text-[#1A1A1A]">
              Drag & drop an image here
            </h2>

            <p className="my-2 text-sm text-[#1A1A1A]/60">or</p>

            {/* Choose File */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg bg-[#0D3B0D] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2F6B2F]"
            >
              Choose File
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            <p className="mt-5 text-xs text-[#1A1A1A]/60">
              Supported formats: JPG, PNG, WEBP (Max 10MB)
            </p>
          </div>
        ) : (
          /* Selected Image */
          <div className="w-full max-w-2xl rounded-2xl border border-[#C8E6C9] bg-white p-4 shadow-sm sm:p-6">
            <div className="relative overflow-hidden rounded-xl bg-[#C8E6C9]">
              <img
                src={preview}
                alt="Selected image"
                className="max-h-[380px] w-full object-contain"
              />

              {/* Remove */}
              <button
                type="button"
                onClick={removeFile}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#1A1A1A] shadow transition hover:bg-[#C8E6C9]"
                aria-label="Remove image"
              >
                <FiX />
              </button>
            </div>

            {/* File Information */}
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#C8E6C9]">
                <FiImage className="text-[#2F6B2F]" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#1A1A1A]">
                  {file?.name}
                </p>

                <p className="text-xs text-[#1A1A1A]/60">
                  {file ? (file.size / 1024 / 1024).toFixed(2) : "0.00"} MB
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Analyze Button */}
        {preview && (
          <button
            type="button"
            onClick={continueToAnalysis}
            className="mt-7 flex items-center gap-2 rounded-lg bg-[#0D3B0D] px-7 py-3 font-semibold text-white transition hover:bg-[#2F6B2F]"
          >
            Analyze Image
            <FiArrowRight />
          </button>
        )}
      </section>
    </main>
  );
}

/* Progress Step */
function Step({ number, label, active = false }) {
  return (
    <div className="flex min-w-0 flex-col items-center">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
          active ? "bg-[#0D3B0D] text-white" : "bg-[#C8E6C9] text-[#2F6B2F]"
        }`}
      >
        {number}
      </div>

      <span
        className={`mt-2 text-[11px] font-medium sm:text-xs ${
          active ? "text-[#0D3B0D]" : "text-[#1A1A1A]/60"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

/* Progress Line */
function Line({ active = false }) {
  return (
    <div
      className={`mx-2 mb-6 h-[2px] flex-1 sm:mx-4 ${
        active ? "bg-[#2F6B2F]" : "bg-[#C8E6C9]"
      }`}
    />
  );
}
