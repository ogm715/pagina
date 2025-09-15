import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // No bloquear el build por errores de ESLint en producción
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
