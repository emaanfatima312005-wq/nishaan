import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AnimationProvider from "../components/AnimationProvider";

export const metadata = {
  title: "Nishaan",
  description:
    "AI-Powered Geospatial Verification and Location Assistance System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AnimationProvider>
          <Navbar />

          {children}

          <Footer />
        </AnimationProvider>
      </body>
    </html>
  );
}