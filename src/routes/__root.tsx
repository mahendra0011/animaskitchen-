import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover",
      },
      { name: "theme-color", content: "#C2410C" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      {
        title:
          "Anima’s Kitchen | Best Ghar Ka Khana & Tiffin Service Patna | Kurji, Boring Road, Patliputra",
      },
      {
        name: "description",
        content:
          "Craving authentic home food in Patna? Anima’s Kitchen delivers hot, fresh, pure desi ghee homestyle thalis, parathas, and daily tiffin across Kurji, Patliputra, Boring Road, Anandpuri & nearby areas. Order fresh now!",
      },
      {
        name: "keywords",
        content:
          "Home food delivery Patna, Ghar jaisa khana Patna, Tiffin service Patna, Food delivery Kurji Patna, Patliputra Colony food delivery, Boring Road tiffin service, Desi ghee thali Patna, Pure vegetarian home delivery Patna, Anima Kitchen Patna, Best cloud kitchen Patna, Daily meal subscription Patna",
      },
      { name: "author", content: "Anima’s Kitchen Patna" },
      {
        name: "robots",
        content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      },
      // Hyper-local Patna Geo-targeting for Google Local & Maps SEO
      { name: "geo.region", content: "IN-BR" },
      { name: "geo.placename", content: "Patna, Bihar, India" },
      { name: "geo.position", content: "25.6425;85.1095" },
      { name: "ICBM", content: "25.6425, 85.1095" },
      // OpenGraph for WhatsApp, Facebook, LinkedIn previews
      { property: "og:site_name", content: "Anima’s Kitchen Patna" },
      {
        property: "og:title",
        content: "Anima’s Kitchen — Best Ghar Ka Khana & Tiffin Service in Patna",
      },
      {
        property: "og:description",
        content:
          "100% Homestyle, Pure Desi Ghee meals & daily tiffins delivered warm to your doorstep in Patna. Kurji • Patliputra • Boring Road.",
      },
      { property: "og:type", content: "restaurant" },
      { property: "og:url", content: "https://animaskitchen.com" },
      { property: "og:image", content: "https://animaskitchen.com/logo.png" },
      { property: "og:image:secure_url", content: "https://animaskitchen.com/logo.png" },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: "512" },
      { property: "og:image:height", content: "512" },
      { property: "og:image:alt", content: "Anima’s Kitchen Patna - Shuddh Ghar Ka Khana" },
      { property: "og:locale", content: "en_IN" },
      // Twitter Card
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Anima’s Kitchen — Authentic Home Food in Patna" },
      {
        name: "twitter:description",
        content:
          "Delicious, hygienic, desi-ghee homestyle meals delivered piping hot across Patna. Order your meal now!",
      },
      { name: "twitter:image", content: "https://animaskitchen.com/logo.png" },
      { name: "twitter:image:alt", content: "Anima’s Kitchen Patna Logo" },
      // Business Category
      { name: "category", content: "Food & Beverage, Restaurant, Cloud Kitchen, Tiffin Service" },
      { name: "coverage", content: "Patna, Bihar, India" },
      { name: "distribution", content: "Local" },
      { name: "rating", content: "General" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://animaskitchen.com",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/logo.png", type: "image/png" },
      { rel: "shortcut icon", href: "/logo.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/logo.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
    scripts: [
      {
        src: "https://accounts.google.com/gsi/client",
        async: true,
        defer: true,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

// Smart Structured Data (JSON-LD) for Google Rich Snippets & Local Search Pack
const schemaStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Restaurant", "FoodEstablishment", "LocalBusiness"],
      "@id": "https://animaskitchen.com/#restaurant",
      name: "Anima's Kitchen",
      alternateName: ["Animas Kitchen Patna", "Anima Kitchen Ghar Ka Khana"],
      description:
        "Authentic homestyle Indian kitchen delivering fresh, hot, pure desi ghee meals, special thalis, and daily tiffins across Patna.",
      url: "https://animaskitchen.com",
      logo: "https://animaskitchen.com/logo.png",
      image: ["https://animaskitchen.com/logo.png"],
      telephone: "+91-7004960724",
      email: "orders@animaskitchen.com",
      priceRange: "₹₹ (₹80 - ₹350)",
      servesCuisine: ["North Indian", "Bihari Homestyle", "Vegetarian", "Pure Desi Ghee", "Thali"],
      currenciesAccepted: "INR",
      paymentAccepted: "Cash, UPI, PhonePe, Google Pay, Paytm, Credit Card, Debit Card",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Vikash Nagar, Kurji More",
        addressLocality: "Patna",
        addressRegion: "Bihar",
        postalCode: "800010",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 25.6425,
        longitude: 85.1095,
      },
      areaServed: [
        { "@type": "AdministrativeArea", name: "Patna" },
        { "@type": "Place", name: "Kurji" },
        { "@type": "Place", name: "Patliputra Colony" },
        { "@type": "Place", name: "Boring Road" },
        { "@type": "Place", name: "Boring Canal Road" },
        { "@type": "Place", name: "Anandpuri" },
        { "@type": "Place", name: "Indrapuri" },
        { "@type": "Place", name: "Rajeev Nagar" },
        { "@type": "Place", name: "Digha" },
        { "@type": "Place", name: "Ashiyana Nagar" },
        { "@type": "Place", name: "Budha Colony" },
        { "@type": "Place", name: "Nehru Nagar" },
      ],
      hasMap: "https://maps.google.com/?q=25.6425,85.1095",
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens: "08:00",
          closes: "23:00",
        },
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "1280",
        bestRating: "5",
        worstRating: "1",
      },
      hasMenu: "https://animaskitchen.com/#menu",
      acceptsReservations: "False",
      potentialAction: {
        "@type": "OrderAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://animaskitchen.com/#menu",
          inLanguage: "en-IN",
          actionPlatform: [
            "http://schema.org/DesktopWebPlatform",
            "http://schema.org/MobileWebPlatform",
            "http://schema.org/IOSPlatform",
            "http://schema.org/AndroidPlatform",
          ],
        },
        deliveryMethod: "http://purl.org/goodrelations/v1#DeliveryModeOwnFleet",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://animaskitchen.com/#website",
      url: "https://animaskitchen.com",
      name: "Anima's Kitchen",
      publisher: {
        "@id": "https://animaskitchen.com/#restaurant",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: "https://animaskitchen.com/?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaStructuredData) }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
