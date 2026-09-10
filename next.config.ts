import type { NextConfig } from 'next';

function getWordPressMediaRemotePatterns(): NonNullable<
  NonNullable<NextConfig['images']>['remotePatterns']
> {
  const configuredUrl =
    process.env.WORDPRESS_MEDIA_URL ?? process.env.WORDPRESS_GRAPHQL_URL;

  if (!configuredUrl) {
    return [];
  }

  let mediaUrl: URL;

  try {
    mediaUrl = new URL(configuredUrl);
  } catch {
    throw new Error(
      'WORDPRESS_MEDIA_URL or WORDPRESS_GRAPHQL_URL must be a valid absolute URL',
    );
  }

  if (mediaUrl.protocol !== 'http:' && mediaUrl.protocol !== 'https:') {
    throw new Error(
      'WORDPRESS_MEDIA_URL or WORDPRESS_GRAPHQL_URL must use http or https',
    );
  }

  return [
    {
      protocol: mediaUrl.protocol === 'https:' ? 'https' : 'http',
      hostname: mediaUrl.hostname,
      port: mediaUrl.port,
      pathname: '/**',
    },
  ];
}

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: getWordPressMediaRemotePatterns(),
  },
};

export default nextConfig;
