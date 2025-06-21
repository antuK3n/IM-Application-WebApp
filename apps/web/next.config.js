/** @type {import('next').NextConfig} */
const nextConfig = {
    serverExternalPackages: ["pdfkit"],
    devIndicators: {
        buildActivity: false
    }
};

export default nextConfig;
