export async function analyzeVoice(file: File) {
  const formData = new FormData();
  formData.append("audio", file);

  const response = await fetch(
    "http://127.0.0.1:8000/api/analyze/voice",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Voice analysis failed");
  }

  return response.json();
}