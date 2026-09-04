// app/lib/api.ts

// Backend base URL.
//
// In production the backend serves the frontend itself, so
// API calls use relative paths. In development the frontend
// runs on port 3000 and the backend on port 8000.
//
// Override with NEXT_PUBLIC_API_URL when frontend and backend
// run on separate origins.
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ??
  (process.env.NODE_ENV === "production"
    ? ""
    : "http://127.0.0.1:8000");

export async function analyzeVoice(file: File) {
  const formData = new FormData();

  formData.append("audio", file);

  const response = await fetch(
    `${API_BASE}/api/analyze/voice`,
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
    `${API_BASE}/api/location/analyze`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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

  // Convert base64 to binary
  const binary = atob(base64);

  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  const blob = new Blob([bytes], {
    type: mimeType,
  });

  const file = new File([blob], filename, {
    type: mimeType,
  });

  const formData = new FormData();

  formData.append("image", file);

  const response = await fetch(
    `${API_BASE}/api/analyze/image`,
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