/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https', // Mudando para 'https' para refletir o protocolo correto
        hostname: 'beefinder.s3.amazonaws.com',
        port: '', // Porta vazia significa que qualquer porta é permitida
        pathname: '/**', // Isso garante que todos os caminhos sejam aceitos
      },
    ],
  },
}

export default nextConfig
