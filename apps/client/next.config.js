/** @type {import('next').NextConfig} */

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self';
  child-src coocobolo.com;
  style-src 'self' coocobolo.com;
  font-src 'self';  
`;

const securityHeaders = [
	{
		key: "X-DNS-Prefetch-Control",
		value: "on",
	},
	{
		key: "connection",
		value: "close",
	},
	{
		key: "Access-Control-Allow-Origin",
		value: "https://www.coocobolo.com",
	},
	{
		key: "Permissions-Policy",
		value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
	},
	{
		key: "Server",
		value: "coocobolo",
	},
	{
		key: "Strict-Transport-Security",
		value: "max-age=63072000; includeSubDomains; preload",
	},
	{
		key: "X-XSS-Protection",
		value: "0",
	},
	{
		key: "X-Frame-Options",
		value: "SAMEORIGIN",
	},
	{
		key: "X-Content-Type-Options",
		value: "nosniff",
	},
	{
		key: "Referrer-Policy",
		value: "no-referrer",
	},
	// {
	// 	key: "Content-Security-Policy",
	// 	value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
	// },
];

const nextConfig = {
	reactStrictMode: true,
	swcMinify: false,
	poweredByHeader: false,
	trailingSlash: true,
	async headers() {
		return [
			{
				source: "/:path*",
				headers: securityHeaders,
			},
		];
	},
};

module.exports = nextConfig;
