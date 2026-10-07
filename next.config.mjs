/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // twc-auth ships untranspiled ESM with platform files (*.native.js); let Next compile it.
  transpilePackages: ['@truworth/twc-auth'],
  webpack: (config) => {
    // Two of twc-auth's type modules import this React Native icon set; nothing on the web uses it.
    config.resolve.alias['@react-native-vector-icons/ionicons'] = false
    return config
  },
}

export default nextConfig
