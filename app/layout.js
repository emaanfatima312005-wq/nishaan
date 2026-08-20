import "./globals.css";

export const metadata = {
  title: "Nishaan",
  description: "AI-Powered Geospatial Verification and Location Assistance System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}