import { MetadataRoute } from "next";

// Required by Next.js static export (`output: "export").
// Without this, the build refuses to generate the file.
export const dynamic = "force-static";

/**
 * Static robots.txt generated at build time.
 * Pre-rendered into `out/robots.txt` by Next.js static export.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/image/analyzing",
          "/image/result",
          "/text/analyzing",
          "/text/result",
          "/voice/analyzing",
          "/voice/output",
        ],
      },
    ],
    sitemap: "https://nishaan-sigma.vercel.app/sitemap.xml",
  };
}
