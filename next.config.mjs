const nextConfig = {
  // Static export: `next build` emits plain HTML/CSS/JS
  // into `out/` so any web server (the FastAPI backend in
  // production) can serve the frontend.
  output: "export",

  // Emit `route/index.html` so FastAPI's StaticFiles can
  // resolve every page path.
  trailingSlash: true,

  // next/image is used in Navbar/Footer; without a Next.js
  // server the default optimizer is unavailable.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
