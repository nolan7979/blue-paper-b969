import { NextSeo } from 'next-seo';
import { usePathname } from 'next/navigation';

import { NextRouter, useRouter } from 'next/router';
import { useMemo } from 'react';
// !STARTERCONF Change these default meta
const defaultMeta = {
  title: 'Uniscore',
  siteName: 'Uniscore',
  description:
    'Discover the latest sports scores, live updates, and real-time match results on Uniscore. Stay informed about your favorite teams and events with our sports app.',
  type: 'website',
  robots: 'follow, index',
  image: '/images/large-og.png',
  url: `https://uniscore.com`,
};

interface ImageMeta {
  url: string;
  width?: number;
  height?: number;
  type?: string;
  secure_url?: string;
}
const GOOGLE_VERIFICATION = process.env.GOOGLE_SITE_VERIFICATION || '';
const DMCA_VERIFICATION = process.env.DMCA_SITE_VERIFICATION || '';

const truncateDescription = (desc: string, maxLength = 160) => {
  return desc.length > maxLength ? `${desc.substring(0, maxLength)}...` : desc;
};

const currentUrl = (router: NextRouter, isServer: boolean): string => {
  // Get hostname based on environment
  const hostname = isServer 
    ? process.env.NEXT_PUBLIC_HOSTNAME 
    : window.location.origin;

  // Use https in server, browser protocol otherwise
  const protocol = isServer ? 'https:' : window.location.protocol;

  // Handle localized routes
  const activeLanguage = router.locale 
    && router.locale !== router.defaultLocale 
    && !router.asPath.startsWith(`/${router.locale}`)
      ? `/${router.locale}`
      : '';

  // Ensure hostname has protocol
  const fullHostname = hostname?.includes('http') 
    ? hostname 
    : `${protocol}//${hostname}`;

  return `${fullHostname}${activeLanguage}${router.asPath}`;
};
const favicons = [
  {
    rel: 'apple-touch-icon',
    sizes: '180x180',
    href: '/favicon/apple-touch-icon.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '32x32',
    href: '/favicon/favicon-32x32.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '16x16',
    href: '/favicon/favicon-16x16.png',
  },
  { rel: 'manifest', href: '/favicon/site.webmanifest' },
  {
    rel: 'mask-icon',
    href: '/favicon/safari-pinned-tab.svg',
    color: '#00e887',
  },
  { rel: 'shortcut icon', href: '/favicon/favicon.ico' },
];

export type SeoProps = {
  date?: string;
  templateTitle?: string;
  description?: string;
  image?: string;
  isSquareImage?: boolean;
} & Partial<typeof defaultMeta>;

export default function Seo(props: SeoProps) {
  const router = useRouter();
  const routerPath = usePathname();
  const isServer = typeof window === 'undefined';

  const meta: any = useMemo(() => ({
    ...defaultMeta,
    ...props,
    title: props.templateTitle ? `${props.templateTitle} - ${defaultMeta.siteName}` : defaultMeta.title,
    description: props.description ? truncateDescription(props.description) : defaultMeta.description,
    url: currentUrl(router, isServer),
  }), [props, router, isServer]);

  const images = useMemo(() => {
    const defaultImage = {
      url: props.image || defaultMeta.image,
      width: props.isSquareImage ? 800 : 1200,
      height: props.isSquareImage ? 800 : 600,
      alt: meta.title,
      type: 'image/jpeg',
      secureUrl: props.image || defaultMeta.image,
    };
    return meta.og_image ? Array.isArray(meta.og_image)
      ? meta.og_image.map((img: ImageMeta) => ({
        url: img.url,
        width: img.width || 800,
        height: img.height || 600,
        alt: meta.title,
        type: img.type || 'image/jpeg',
        secureUrl: img.secure_url || img.url,
      }))
      : [{
        url: meta.og_image.url,
        width: meta.og_image.width || props.isSquareImage ? 800 : 1200,
        height: meta.og_image.height || props.isSquareImage ? 800 : 600,
        alt: meta.title,
        type: meta.og_image.type || 'image/jpeg',
        secureUrl: meta.og_image.secure_url || meta.og_image.url,
      }]
      : [defaultImage];
  }, [meta.og_image, meta.title]);

  return (
    <NextSeo
      title={meta.title}
      description={meta.description}
      canonical={meta.url}
      languageAlternates={router.locales?.map(locale => {
        const newUrl = locale === router.defaultLocale
          ? currentUrl({ ...router, locale: router.defaultLocale }, isServer)
          : currentUrl({ ...router, locale }, isServer);
        return {
          hrefLang: locale,
          href: newUrl,
        };
      })}
      additionalMetaTags={[
        { name: 'dmca-site-verification', content: DMCA_VERIFICATION },
        { name: 'google-site-verification', content: GOOGLE_VERIFICATION },
      ]}
      additionalLinkTags={[
        ...favicons,
        { rel: 'preconnect', href: 'https://cdn.uniscore.com' },
        { rel: 'dns-prefetch', href: 'https://cdn.uniscore.com' },
        { rel: 'preconnect', href: 'https://api.uniscore.com' },
        { rel: 'dns-prefetch', href: 'https://api.uniscore.com' },
        { rel: 'preconnect', href: 'https://api-n1.uniscore.com' },
        { rel: 'dns-prefetch', href: 'https://api-n1.uniscore.com' },
      ]}
      openGraph={{
        url: meta.url,
        title: meta.title,
        description: meta.description,
        images,
        siteName: meta.siteName,
      }}
      twitter={{
        handle: '@Uniscore_App',
        site: '@Uniscore_App',
        cardType: 'summary_large_image',
      }}
    />
  );
}