/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
            };
        }
        return config;
    },
    // サーバーサイドの設定を追加
    serverRuntimeConfig: {
        POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL,
    },
    // クライアントサイドとサーバーサイドの両方で使用する設定（必要な場合）
    publicRuntimeConfig: {
        // ここに公開しても安全な設定を追加できます
    },
};

export default nextConfig;