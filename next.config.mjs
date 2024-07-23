import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
			},
			{
				protocol: 'https',
				hostname: 'avatars.githubusercontent.com',
			},
		],
	},

	async headers() {
		return [
			{
				source: '/api/game/:path*',
				headers: [
					{ key: 'Access-Control-Allow-Origin', value: process.env.NEXT_PUBLIC_SOCKET_URL || '*' },
					{ key: 'Access-Control-Allow-Methods', value: 'GET,POST' },
					{
						key: 'Access-Control-Allow-Headers',
						value: 'Content-Type, Authorization',
					},
				],
			},
		];
	},
};

export default withNextIntl(nextConfig);
