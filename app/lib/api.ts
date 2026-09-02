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
    const errorBody = await response.text().catch(() => "unknown");
    throw new Error(
      `Voice analysis failed (${response.status}): ${errorBody}`
    );
  }

  return response.json();
}

export async function analyzeText(clue: string) {
  const response = await fetch(
    "http://127.0.0.1:8000/api/location/analyze",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clue }),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "unknown");
    throw new Error(
      `Text analysis failed (${response.status}): ${errorBody}`
    );
  }

  return response.json();
}

export async function analyzeImageFromBase64(
  dataUrl: string,
  filename: string,
  mimeType: string
) {
  // Extract the base64 portion after the comma
  const base64 = dataUrl.split(",")[1];

  if (!base64) {
    throw new Error("Invalid data URL: no base64 content");
  }

  // Convert base64 to binary using atob (reliable in all browsers)
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  const blob = new Blob([bytes], { type: mimeType });
  const file = new File([blob], filename, { type: mimeType });

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(
    "http://127.0.0.1:8000/api/analyze/image",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "unknown");
    throw new Error(
      `Image analysis failed (${response.status}): ${errorBody}`
    );
  }

  return response.json();
}