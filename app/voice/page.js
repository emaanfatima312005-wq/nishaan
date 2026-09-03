"use client";

<<<<<<< HEAD
import { useRef, useState } from "react";
=======
import { useRef, useState, useEffect } from "react";
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
import Link from "next/link";
import {
  FiMic,
  FiUploadCloud,
  FiArrowRight,
  FiCheck,
  FiSquare,
  FiVolume2,
} from "react-icons/fi";

export default function VoicePage() {
  const fileInputRef = useRef(null);
<<<<<<< HEAD
=======
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const audioFileRef = useRef(null);
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889

  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
<<<<<<< HEAD
=======
  const [recordingError, setRecordingError] = useState(null);

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889

  // ===============================
  // SELECT AUDIO FILE
  // ===============================

  const handleFile = (file) => {
    if (!file) return;

    setAudioFile(file);

    const url = URL.createObjectURL(file);
    setAudioURL(url);
  };

  // ===============================
  // FILE INPUT
  // ===============================

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  // ===============================
  // DRAG & DROP
  // ===============================

  const handleDrop = (event) => {
    event.preventDefault();

    const file = event.dataTransfer.files?.[0];

    if (file && file.type.startsWith("audio/")) {
      handleFile(file);
    }
  };

  // ===============================
<<<<<<< HEAD
  // RECORDING UI
  // ===============================

  const startRecording = () => {
    setIsRecording(true);
    setAudioFile(null);
    setAudioURL(null);
=======
  // STORE AUDIO FOR API
  // ===============================

  const storeAudioForAnalysis = () => {
    if (!audioFile) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        sessionStorage.setItem(
          "nishaan_voice_audio",
          JSON.stringify({
            data: reader.result,
            name: audioFile.name,
            type: audioFile.type,
            size: audioFile.size,
          })
        );
      } catch (e) {
        console.error("Could not store audio:", e);
      }
    };
    reader.readAsDataURL(audioFile);
  };

  // ===============================
  // LIVE RECORDING (MediaRecorder)
  // ===============================

  const startRecording = async () => {
    setRecordingError(null);
    setAudioFile(null);
    setAudioURL(null);
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      const recorder = new MediaRecorder(stream, { mimeType });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const file = new File([blob], `nishaan-recording-${Date.now()}.webm`, {
          type: mimeType,
        });

        audioFileRef.current = file;
        setAudioFile(file);
        const url = URL.createObjectURL(file);
        setAudioURL(url);

        // Stop all tracks to release microphone
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      };

      recorder.start(250); // Collect data every 250ms
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      console.error("[Nishaan] Microphone access denied:", err);
      setRecordingError(
        "Microphone access is required for voice recording. Please allow it in your browser settings."
      );
    }
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
  };

  const stopRecording = () => {
    setIsRecording(false);

<<<<<<< HEAD
    // Move to analyzing page
    window.location.href = "/voice/analyzing";
=======
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
      mediaRecorderRef.current = null;

      // Poll using ref (not state) since onstop sets the ref synchronously
      const waitForFile = setInterval(() => {
        const file = audioFileRef.current;
        if (file) {
          clearInterval(waitForFile);
          const reader = new FileReader();
          reader.onload = () => {
            try {
              sessionStorage.setItem(
                "nishaan_voice_audio",
                JSON.stringify({
                  data: reader.result,
                  name: file.name,
                  type: file.type,
                  size: file.size,
                })
              );
            } catch (e) {
              console.error("[Nishaan] Could not store audio:", e);
            }
            window.location.href = "/voice/analyzing";
          };
          reader.readAsDataURL(file);
        }
      }, 100);

      // Safety timeout: navigate after 8s even if something stalls
      setTimeout(() => {
        clearInterval(waitForFile);
        const file = audioFileRef.current;
        if (!file) {
          console.warn("[Nishaan] Recording timed out, navigating anyway");
          window.location.href = "/voice/analyzing";
        }
      }, 8000);
    } else {
      // No active recording — just navigate
      window.location.href = "/voice/analyzing";
    }
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
  };

  return (
    <main
<<<<<<< HEAD
      className="
        relative
        min-h-screen
        overflow-hidden
        text-[#1A1A1A]
      "
    >
      {/* ================================================= */}
      {/* BACKGROUND VIDEO */}
      {/* ================================================= */}

      <div
        className="
          pointer-events-none
          fixed
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

        {/* Light overlay */}
        <div
          className="
            absolute
            inset-0
            bg-[#fbfcf7]/45
          "
        />

        {/* Gradient overlay */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-b
            from-[#fbfcf7]/50
            via-transparent
            to-[#fbfcf7]/60
          "
        />
      </div>

      {/* ================================================= */}
      {/* SOFT GREEN GLOW */}
      {/* ================================================= */}

      <div
        className="
          pointer-events-none
          fixed
          left-[-150px]
          top-[15%]
          z-[1]
          h-[500px]
          w-[500px]
          rounded-full
          bg-[#5FAF5F]/10
          blur-[120px]
        "
      />

      <div
        className="
          pointer-events-none
          fixed
          bottom-[10%]
          right-[-150px]
          z-[1]
          h-[500px]
          w-[500px]
          rounded-full
          bg-[#2F6B2F]/10
          blur-[120px]
        "
      />
=======
      className="relative min-h-screen overflow-hidden text-[#1A1A1A]"
      style={{
        backgroundImage: "url('/images/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundAttachment: "fixed",
      }}
    >

      {/* ================================================= */}
      {/* BACKGROUND OVERLAY */}
      {/* ================================================= */}

      <div className="pointer-events-none absolute inset-0 bg-[#fbfcf7]/60" />

      {/* Soft green glow */}

      <div className="pointer-events-none absolute left-[-150px] top-[15%] h-[500px] w-[500px] rounded-full bg-[#5FAF5F]/10 blur-[120px]" />

      <div className="pointer-events-none absolute right-[-150px] bottom-[10%] h-[500px] w-[500px] rounded-full bg-[#2F6B2F]/10 blur-[120px]" />

>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889

      {/* ================================================= */}
      {/* EVERYTHING ABOVE BACKGROUND */}
      {/* ================================================= */}

      <div className="relative z-10">
<<<<<<< HEAD
=======


>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
        {/* ================================================= */}
        {/* STEP PROGRESS */}
        {/* ================================================= */}

<<<<<<< HEAD
        <section
          className="
            mx-auto
            max-w-7xl
            px-6
            pt-12
            md:px-10
          "
        >
          <div className="flex items-start">
            {/* STEP 1 */}

            <div className="flex flex-1 flex-col items-center">
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  bg-[#0D3B0D]
                  text-sm
                  font-bold
                  text-white
                  shadow-lg
                "
              >
                1
              </div>

              <p
                className="
                  mt-3
                  text-sm
                  font-medium
                  text-[#0D3B0D]
                "
              >
                Input
              </p>
            </div>

            {/* LINE */}

            <div
              className="
                mt-5
                h-[2px]
                flex-1
                bg-[#C8E6C9]
              "
            />
=======
        <section className="mx-auto max-w-7xl px-6 pt-12 md:px-10">

          <div className="flex items-start">

            {/* STEP 1 */}

            <div className="flex flex-1 flex-col items-center">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0D3B0D] text-sm font-bold text-white shadow-lg">
                1
              </div>

              <p className="mt-3 text-sm font-medium text-[#0D3B0D]">
                Input
              </p>

            </div>


            {/* LINE */}

            <div className="mt-5 h-[2px] flex-1 bg-[#C8E6C9]" />

>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889

            {/* STEP 2 */}

            <div className="flex flex-1 flex-col items-center">
<<<<<<< HEAD
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  bg-[#C8E6C9]
                  text-sm
                  font-bold
                  text-[#2F6B2F]
                "
              >
                2
              </div>

              <p
                className="
                  mt-3
                  text-sm
                  text-[#1A1A1A]/60
                "
              >
                Analyzing
              </p>
            </div>

            {/* LINE */}

            <div
              className="
                mt-5
                h-[2px]
                flex-1
                bg-[#C8E6C9]
              "
            />
=======

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#C8E6C9] text-sm font-bold text-[#2F6B2F]">
                2
              </div>

              <p className="mt-3 text-sm text-[#1A1A1A]/60">
                Analyzing
              </p>

            </div>


            {/* LINE */}

            <div className="mt-5 h-[2px] flex-1 bg-[#C8E6C9]" />

>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889

            {/* STEP 3 */}

            <div className="flex flex-1 flex-col items-center">
<<<<<<< HEAD
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  bg-[#C8E6C9]
                  text-sm
                  font-bold
                  text-[#2F6B2F]
                "
              >
                3
              </div>

              <p
                className="
                  mt-3
                  text-sm
                  text-[#1A1A1A]/60
                "
              >
                Output
              </p>
            </div>
          </div>
        </section>

=======

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#C8E6C9] text-sm font-bold text-[#2F6B2F]">
                3
              </div>

              <p className="mt-3 text-sm text-[#1A1A1A]/60">
                Output
              </p>

            </div>

          </div>

        </section>


>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
        {/* ================================================= */}
        {/* MAIN CONTENT */}
        {/* ================================================= */}

<<<<<<< HEAD
        <section
          className="
            mx-auto
            max-w-5xl
            px-6
            pb-20
            pt-20
            text-center
          "
        >
=======
        <section className="mx-auto max-w-5xl px-6 pb-20 pt-20 text-center">

>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
          {/* ================================================= */}
          {/* HEADING */}
          {/* ================================================= */}

          <p
<<<<<<< HEAD
            className="
              text-sm
              font-semibold
              uppercase
              tracking-[0.25em]
              text-[#5FAF5F]
            "
=======
            className="text-sm font-semibold uppercase tracking-[0.25em] text-[#5FAF5F]"
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
            data-aos="fade-down"
          >
            Voice Discovery
          </p>

          <h1
<<<<<<< HEAD
            className="
              mt-4
              text-4xl
              font-bold
              text-[#0D3B0D]
              md:text-5xl
            "
=======
            className="mt-4 text-4xl font-bold text-[#0D3B0D] md:text-5xl"
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Tell Nishaan what you remember.
          </h1>

          <p
<<<<<<< HEAD
            className="
              mx-auto
              mt-5
              max-w-2xl
              text-lg
              leading-8
              text-[#1A1A1A]/65
            "
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Speak naturally about the place you are looking for. Nishaan will
            use your clues to discover where it might be.
          </p>

=======
            className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#1A1A1A]/65"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Speak naturally about the place you are looking for.
            Nishaan will use your clues to discover where it might be.
          </p>


>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
          {/* ================================================= */}
          {/* VOICE INPUT CARD */}
          {/* ================================================= */}

          <div
<<<<<<< HEAD
            className={`
              relative
              mx-auto
              mt-12
              max-w-4xl
              overflow-hidden
              rounded-[2rem]
              border
              bg-white/90
              p-7
              shadow-xl
              backdrop-blur-md
              transition-[border-color,box-shadow]
              duration-500
              md:p-10

              ${
                isRecording
                  ? "border-[#5FAF5F] shadow-[0_20px_70px_rgba(47,107,47,0.25)]"
                  : "border-[#C8E6C9]"
              }
            `}
          >
=======
  className={`relative mx-auto mt-12 max-w-4xl overflow-hidden rounded-[2rem] border bg-white/95 p-7 shadow-xl backdrop-blur-md transition-[border-color,box-shadow] duration-500 md:p-10
  ${
    isRecording
      ? "border-[#5FAF5F] shadow-[0_20px_70px_rgba(47,107,47,0.25)]"
      : "border-[#C8E6C9]"
  }`}
>

>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
            {/* ================================================= */}
            {/* CARD DECORATION */}
            {/* ================================================= */}

<<<<<<< HEAD
            <div
              className="
                pointer-events-none
                absolute
                -right-24
                -top-24
                h-64
                w-64
                rounded-full
                bg-[#C8E6C9]/40
                blur-3xl
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -bottom-24
                -left-24
                h-64
                w-64
                rounded-full
                bg-[#5FAF5F]/15
                blur-3xl
              "
            />

            <div className="relative z-10">
=======
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#C8E6C9]/40 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#5FAF5F]/15 blur-3xl" />


            <div className="relative z-10">


>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
              {/* ================================================= */}
              {/* MICROPHONE */}
              {/* ================================================= */}

<<<<<<< HEAD
              <div
                className="
                  relative
                  mx-auto
                  flex
                  h-24
                  w-24
                  items-center
                  justify-center
                "
              >
                {isRecording && (
                  <>
                    <span
                      className="
                        absolute
                        inset-0
                        animate-ping
                        rounded-full
                        bg-[#5FAF5F]/20
                      "
                    />

                    <span
                      className="
                        absolute
                        -inset-4
                        animate-pulse
                        rounded-full
                        border
                        border-[#5FAF5F]/20
                      "
                    />

                    <span
                      className="
                        absolute
                        -inset-8
                        animate-pulse
                        rounded-full
                        border
                        border-[#5FAF5F]/10
                      "
                    />
=======
              <div className="relative mx-auto flex h-24 w-24 items-center justify-center">

                {isRecording && (
                  <>
                    <span className="absolute inset-0 animate-ping rounded-full bg-[#5FAF5F]/20" />

                    <span className="absolute -inset-4 rounded-full border border-[#5FAF5F]/20 animate-pulse" />

                    <span className="absolute -inset-8 rounded-full border border-[#5FAF5F]/10 animate-pulse" />
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
                  </>
                )}

                <div
<<<<<<< HEAD
                  className={`
                    relative
                    flex
                    h-24
                    w-24
                    items-center
                    justify-center
                    rounded-full
                    transition-all
                    duration-500

                    ${
                      isRecording
                        ? "bg-[#0D3B0D] shadow-[0_0_45px_rgba(95,175,95,0.5)]"
                        : "bg-[#C8E6C9]"
                    }
                  `}
                >
=======
                  className={`relative flex h-24 w-24 items-center justify-center rounded-full transition-all duration-500
                  ${
                    isRecording
                      ? "bg-[#0D3B0D] shadow-[0_0_45px_rgba(95,175,95,0.5)]"
                      : "bg-[#C8E6C9]"
                  }`}
                >

>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
                  {isRecording ? (
                    <FiSquare className="text-3xl text-[#5FAF5F]" />
                  ) : (
                    <FiMic className="text-4xl text-[#0D3B0D]" />
                  )}
<<<<<<< HEAD
                </div>
              </div>

=======

                </div>

              </div>


>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
              {/* ================================================= */}
              {/* STATUS */}
              {/* ================================================= */}

<<<<<<< HEAD
              <h2
                className="
                  mt-8
                  text-2xl
                  font-bold
                  text-[#0D3B0D]
                "
              >
                {isRecording
                  ? "Listening..."
                  : audioFile
                    ? "Voice clue ready"
                    : "Speak your clue"}
              </h2>

              <p
                className="
                  mt-3
                  text-[#1A1A1A]/60
                "
              >
                {isRecording
                  ? "Describe landmarks, buildings, surroundings or anything you remember."
                  : audioFile
                    ? "Your voice recording is ready to analyze."
                    : "You can record your voice or upload an existing audio file."}
              </p>

=======
              <h2 className="mt-8 text-2xl font-bold text-[#0D3B0D]">

                {isRecording
                  ? "Listening..."
                  : audioFile
                  ? "Voice clue ready"
                  : "Speak your clue"}

              </h2>


              <p className="mt-3 text-[#1A1A1A]/60">

                {isRecording
                  ? "Describe landmarks, buildings, surroundings or anything you remember."
                  : audioFile
                  ? "Your voice recording is ready to analyze."
                  : "You can record your voice or upload an existing audio file."}

              </p>


>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
              {/* ================================================= */}
              {/* FREQUENCY VISUALIZER */}
              {/* ================================================= */}

<<<<<<< HEAD
              <div
                className="
                  mx-auto
                  mt-10
                  flex
                  h-28
                  max-w-2xl
                  items-center
                  justify-center
                  gap-[5px]
                  overflow-hidden
                  rounded-2xl
                  bg-[#0D3B0D]
                  px-6
                "
              >
                {Array.from({ length: 55 }).map((_, index) => {
                  const heights = [
                    20, 35, 55, 30, 70, 45, 80, 35, 65, 90, 50, 75, 40, 95, 55,
                    30, 70, 45, 85, 35, 65, 95, 45, 75, 55, 35, 80, 50, 90, 40,
                    70, 30, 60, 85, 45, 75, 35, 95, 50, 70, 40, 80, 55, 30, 65,
                    90, 45, 75, 35, 60, 85, 50, 70, 40, 55,
=======
              <div className="mx-auto mt-10 flex h-28 max-w-2xl items-center justify-center gap-[5px] overflow-hidden rounded-2xl bg-[#0D3B0D] px-6">

                {Array.from({ length: 55 }).map((_, index) => {

                  const heights = [
                    20, 35, 55, 30, 70,
                    45, 80, 35, 65, 90,
                    50, 75, 40, 95, 55,
                    30, 70, 45, 85, 35,
                    65, 95, 45, 75, 55,
                    35, 80, 50, 90, 40,
                    70, 30, 60, 85, 45,
                    75, 35, 95, 50, 70,
                    40, 80, 55, 30, 65,
                    90, 45, 75, 35, 60,
                    85, 50, 70, 40, 55,
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
                  ];

                  return (
                    <span
                      key={index}
<<<<<<< HEAD
                      className={`
                        w-[3px]
                        rounded-full
                        bg-[#5FAF5F]
                        transition-all
                        duration-300

                        ${isRecording ? "animate-voice-wave" : "opacity-40"}
                      `}
=======
                      className={`w-[3px] rounded-full bg-[#5FAF5F] transition-all duration-300 ${
                        isRecording
                          ? "animate-voice-wave"
                          : "opacity-40"
                      }`}
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
                      style={{
                        height: `${heights[index % heights.length]}%`,
                        animationDelay: `${index * 35}ms`,
                      }}
                    />
                  );
<<<<<<< HEAD
                })}
              </div>

=======

                })}

              </div>


>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
              {/* ================================================= */}
              {/* RECORD BUTTON */}
              {/* ================================================= */}

              <div className="mt-10">
<<<<<<< HEAD
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="
                      group
                      mx-auto
                      flex
                      items-center
                      gap-3
                      rounded-full
                      bg-[#0D3B0D]
                      px-8
                      py-4
                      font-semibold
                      text-white
                      shadow-lg
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:bg-[#2F6B2F]
                      hover:shadow-xl
                    "
                  >
                    <FiMic
                      className="
                        text-xl
                        transition-transform
                        duration-300
                        group-hover:scale-110
                      "
                    />
                    Start Recording
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="
                      mx-auto
                      flex
                      items-center
                      gap-3
                      rounded-full
                      bg-[#2F6B2F]
                      px-8
                      py-4
                      font-semibold
                      text-white
                      shadow-lg
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:bg-[#0D3B0D]
                    "
                  >
                    <FiSquare />
                    Stop Recording
                  </button>
                )}
              </div>

=======

                {!isRecording ? (

                  <button
                    onClick={startRecording}
                    className="group mx-auto flex items-center gap-3 rounded-full bg-[#0D3B0D] px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#2F6B2F] hover:shadow-xl"
                  >

                    <FiMic className="text-xl transition-transform duration-300 group-hover:scale-110" />

                    Start Recording

                  </button>

                ) : (

                  <button
                    onClick={stopRecording}
                    className="mx-auto flex items-center gap-3 rounded-full bg-[#2F6B2F] px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#0D3B0D]"
                  >

                    <FiSquare />

                    Stop Recording

                  </button>

                )}

              </div>


              {/* Recording error */}
              {recordingError && (
                <p className="mx-auto mt-4 max-w-sm text-center text-sm text-red-600">
                  {recordingError}
                </p>
              )}


>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
              {/* ================================================= */}
              {/* DIVIDER */}
              {/* ================================================= */}

<<<<<<< HEAD
              <div
                className="
                  my-9
                  flex
                  items-center
                  gap-4
                "
              >
                <div
                  className="
                    h-px
                    flex-1
                    bg-[#C8E6C9]
                  "
                />

                <span
                  className="
                    text-sm
                    text-[#1A1A1A]/40
                  "
                >
                  or
                </span>

                <div
                  className="
                    h-px
                    flex-1
                    bg-[#C8E6C9]
                  "
                />
              </div>

=======
              <div className="my-9 flex items-center gap-4">

                <div className="h-px flex-1 bg-[#C8E6C9]" />

                <span className="text-sm text-[#1A1A1A]/40">
                  or
                </span>

                <div className="h-px flex-1 bg-[#C8E6C9]" />

              </div>


>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
              {/* ================================================= */}
              {/* UPLOAD */}
              {/* ================================================= */}

              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
<<<<<<< HEAD
                className="
                  group
                  cursor-pointer
                  rounded-2xl
                  border-2
                  border-dashed
                  border-[#C8E6C9]
                  bg-[#fbfcf7]/90
                  px-6
                  py-8
                  transition-all
                  duration-300
                  hover:border-[#5FAF5F]
                  hover:bg-[#C8E6C9]/20
                "
              >
                <div
                  className="
                    mx-auto
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-full
                    bg-[#C8E6C9]
                    transition-transform
                    duration-300
                    group-hover:scale-110
                  "
                >
                  <FiUploadCloud
                    className="
                      text-2xl
                      text-[#2F6B2F]
                    "
                  />
                </div>

                <h3
                  className="
                    mt-4
                    font-semibold
                    text-[#0D3B0D]
                  "
                >
                  Upload a voice recording
                </h3>

                <p
                  className="
                    mt-2
                    text-sm
                    text-[#1A1A1A]/50
                  "
                >
                  Drag & drop your audio here or click to browse
                </p>

                <p
                  className="
                    mt-3
                    text-xs
                    text-[#1A1A1A]/40
                  "
                >
                  MP3, WAV, M4A, WEBM
                </p>
              </div>

=======
                className="group cursor-pointer rounded-2xl border-2 border-dashed border-[#C8E6C9] bg-[#fbfcf7]/90 px-6 py-8 transition-all duration-300 hover:border-[#5FAF5F] hover:bg-[#C8E6C9]/20"
              >

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#C8E6C9] transition-transform duration-300 group-hover:scale-110">

                  <FiUploadCloud className="text-2xl text-[#2F6B2F]" />

                </div>

                <h3 className="mt-4 font-semibold text-[#0D3B0D]">
                  Upload a voice recording
                </h3>

                <p className="mt-2 text-sm text-[#1A1A1A]/50">
                  Drag & drop your audio here or click to browse
                </p>

                <p className="mt-3 text-xs text-[#1A1A1A]/40">
                  MP3, WAV, M4A, WEBM
                </p>

              </div>


>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
              {/* ================================================= */}
              {/* HIDDEN FILE INPUT */}
              {/* ================================================= */}

              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleFileChange}
              />

<<<<<<< HEAD
=======

>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
              {/* ================================================= */}
              {/* SELECTED AUDIO */}
              {/* ================================================= */}

              {audioFile && (
<<<<<<< HEAD
                <div
                  className="
                    mt-6
                    rounded-2xl
                    border
                    border-[#C8E6C9]
                    bg-[#fbfcf7]/95
                    p-5
                    text-left
                  "
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="
                        flex
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-[#0D3B0D]
                      "
                    >
                      <FiVolume2
                        className="
                          text-xl
                          text-[#5FAF5F]
                        "
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p
                        className="
                          truncate
                          font-semibold
                          text-[#0D3B0D]
                        "
                      >
                        {audioFile.name}
                      </p>

                      <p
                        className="
                          mt-1
                          text-xs
                          text-[#1A1A1A]/50
                        "
                      >
                        {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>

                    <FiCheck
                      className="
                        text-2xl
                        text-[#2F6B2F]
                      "
                    />
                  </div>

                  {audioURL && (
                    <audio src={audioURL} controls className="mt-5 w-full" />
                  )}
                </div>
              )}

=======

                <div className="mt-6 rounded-2xl border border-[#C8E6C9] bg-[#fbfcf7] p-5 text-left">

                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0D3B0D]">

                      <FiVolume2 className="text-xl text-[#5FAF5F]" />

                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="truncate font-semibold text-[#0D3B0D]">
                        {audioFile.name}
                      </p>

                      <p className="mt-1 text-xs text-[#1A1A1A]/50">
                        {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>

                    </div>

                    <FiCheck className="text-2xl text-[#2F6B2F]" />

                  </div>


                  {audioURL && (
                    <audio
                      src={audioURL}
                      controls
                      className="mt-5 w-full"
                    />
                  )}

                </div>

              )}


>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
              {/* ================================================= */}
              {/* CONTINUE */}
              {/* ================================================= */}

              {audioFile && (
<<<<<<< HEAD
                <Link
                  href="/voice/analyzing"
                  className="
                    group
                    mx-auto
                    mt-8
                    flex
                    w-fit
                    items-center
                    gap-3
                    rounded-full
                    bg-[#0D3B0D]
                    px-8
                    py-4
                    font-semibold
                    text-white
                    shadow-lg
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:bg-[#2F6B2F]
                  "
                >
                  Analyze Voice
                  <FiArrowRight
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  />
                </Link>
              )}
            </div>
          </div>

=======

                <Link
                  href="/voice/analyzing"
                  onClick={() => {
                    storeAudioForAnalysis();
                  }}
                  className="group mx-auto mt-8 flex w-fit items-center gap-3 rounded-full bg-[#0D3B0D] px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#2F6B2F]"
                >

                  Analyze Voice

                  <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />

                </Link>

              )}

            </div>

          </div>


>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
          {/* ================================================= */}
          {/* BOTTOM INFORMATION */}
          {/* ================================================= */}

<<<<<<< HEAD
          <div
            className="
              mx-auto
              mt-10
              flex
              max-w-3xl
              flex-wrap
              items-center
              justify-center
              gap-8
              text-sm
              text-[#1A1A1A]/50
            "
          >
=======
          <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-8 text-sm text-[#1A1A1A]/50">

>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
            <div className="flex items-center gap-2">
              <FiCheck className="text-[#2F6B2F]" />
              No account required
            </div>

            <div className="flex items-center gap-2">
              <FiCheck className="text-[#2F6B2F]" />
              Natural language
            </div>

            <div className="flex items-center gap-2">
              <FiCheck className="text-[#2F6B2F]" />
              AI-powered discovery
            </div>
<<<<<<< HEAD
          </div>
        </section>
      </div>
    </main>
  );
}
=======

          </div>

        </section>

      </div>

    </main>
  );
}
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
