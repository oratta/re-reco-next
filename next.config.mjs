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
        POSTGRES_PRISMA_DATABASE: process.env.POSTGRES_PRISMA_DATABASE,
        POSTGRES_PRISMA_HOST: process.env.POSTGRES_PRISMA_HOST,
        POSTGRES_PRISMA_PASSWORD: process.env.POSTGRES_PRISMA_PASSWORD,
        POSTGRES_PRISMA_URL_NON_POOLING: process.env.POSTGRES_PRISMA_URL_NON_POOLING,
        POSTGRES_PRISMA_URL_NO_SSL: process.env.POSTGRES_PRISMA_URL_NO_SSL
},
    // クライアントサイドとサーバーサイドの両方で使用する設定（必要な場合）
    publicRuntimeConfig: {
        // ここに公開しても安全な設定を追加できます
    },
};

export default nextConfig;