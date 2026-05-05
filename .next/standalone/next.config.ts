import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // réduit la taille du déploiement
  images: {
    unoptimized: true,  // pas besoin d'un serveur d'images externe
  },
};

export default nextConfig;
