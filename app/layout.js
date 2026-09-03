import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AnimationProvider from "../components/AnimationProvider";
import CursorParticleBackground from "../components/CursorParticleBackground";

export const metadata = {
  title: "Nishaan",
  description:
    "AI-Powered Geospatial Verification and Location Assistance System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CursorParticleBackground />

        <AnimationProvider>
          <Navbar />

          {children}

          <Footer />
        </AnimationProvider>
      </body>
    </html>
  );
}
