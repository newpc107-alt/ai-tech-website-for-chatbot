import React, { useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS, CATEGORIES } from '../data/products';

const BASE_URL = 'https://khizartech.netlify.app';

export const SEOHead: React.FC = () => {
  const { route } = useStore();

  useEffect(() => {
    let title = 'Khizar Tech Store | Premium Audio, GaN Chargers, Cables & Accessories';
    let description =
      'Khizar Tech Store - High-performance audio gear, AirPods, GaN multi-port chargers, precision cables, and hardware accessories with dedicated sub-page navigation.';
    let canonicalUrl = `${BASE_URL}/`;
    let ogImage = `${BASE_URL}/images/hero_tech_ecosystem_1793216307639.jpg`;
    let ogType = 'website';
    let schemas: any[] = [];

    if (route.name === 'product') {
      const product = PRODUCTS.find((p) => p.id === route.productId);
      if (product) {
        title = `${product.name} | Khizar Tech Store`;
        description = product.description;
        canonicalUrl = `${BASE_URL}/products/${product.id}`;
        ogImage = product.image.startsWith('http') ? product.image : `${BASE_URL}${product.image}`;
        ogType = 'product';

        const category = CATEGORIES.find((c) => c.id === product.category);

        schemas.push({
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          image: ogImage,
          description: product.description,
          sku: product.id,
          brand: {
            '@type': 'Brand',
            name: 'Khizar Tech',
          },
          offers: {
            '@type': 'Offer',
            url: canonicalUrl,
            priceCurrency: 'USD',
            price: product.price,
            priceValidUntil: '2027-12-31',
            itemCondition: 'https://schema.org/NewCondition',
            availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            seller: {
              '@type': 'Organization',
              name: 'Khizar Tech Store',
            },
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
            bestRating: 5,
            worstRating: 1,
          },
        });

        // Breadcrumbs schema
        schemas.push({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: `${BASE_URL}/`,
            },
            ...(category
              ? [
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: category.name,
                    item: `${BASE_URL}/categories/${category.id}`,
                  },
                  {
                    '@type': 'ListItem',
                    position: 3,
                    name: product.name,
                    item: canonicalUrl,
                  },
                ]
              : [
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: product.name,
                    item: canonicalUrl,
                  },
                ]),
          ],
        });
      }
    } else if (route.name === 'category') {
      const category = CATEGORIES.find((c) => c.id === route.categoryId);
      if (category) {
        title = `${category.name} - Premium Hardware & Gear | Khizar Tech Store`;
        description = category.description;
        canonicalUrl = `${BASE_URL}/categories/${category.id}`;
        ogImage = category.featuredImage.startsWith('http')
          ? category.featuredImage
          : `${BASE_URL}${category.featuredImage}`;

        schemas.push({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: `${category.name} | Khizar Tech Store`,
          description: category.description,
          url: canonicalUrl,
        });

        schemas.push({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: `${BASE_URL}/`,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: category.name,
              item: canonicalUrl,
            },
          ],
        });
      }
    } else if (route.name === 'accessories') {
      title = 'Accessories Superstore & Interconnects | Khizar Tech Store';
      description =
        'Explore precision CNC desk stands, Kevlar aramid phone cases, 9H+ screen glass, and magnetic cable blocks engineered for productivity.';
      canonicalUrl = `${BASE_URL}/accessories`;
    } else if (route.name === 'deals') {
      title = 'Hardware Bundles & Exclusive Deals | Khizar Tech Store';
      description =
        'Special package discounts on GaN chargers, audio earbuds, and 240W braided cables from Khizar Tech Store.';
      canonicalUrl = `${BASE_URL}/deals`;
    } else if (route.name === 'about') {
      title = 'Engineering Lab & Philosophy | Khizar Tech Store';
      description =
        'Learn about Khizar Tech Store engineering principles, 2-year warranty commitments, and thermal design excellence.';
      canonicalUrl = `${BASE_URL}/about`;
    } else if (route.name === 'cart') {
      title = 'Your Shopping Bag | Khizar Tech Store';
      description = 'Review your selected tech hardware items in your shopping bag.';
      canonicalUrl = `${BASE_URL}/cart`;
    } else if (route.name === 'checkout') {
      title = 'Cash on Delivery Checkout | Khizar Tech Store';
      description = 'Complete your Cash on Delivery (COD) tech order with official delivery receipt.';
      canonicalUrl = `${BASE_URL}/checkout`;
    } else {
      // Home
      title = 'Khizar Tech Store | Premium Audio, GaN Chargers, Cables & Accessories';
      description =
        'Khizar Tech Store - High-performance audio gear, AirPods, GaN multi-port chargers, precision cables, and hardware accessories with dedicated sub-page navigation.';
      canonicalUrl = `${BASE_URL}/`;

      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Khizar Tech Store',
        url: BASE_URL,
        logo: `${BASE_URL}/images/hero_tech_ecosystem_1793216307639.jpg`,
        description:
          'Khizar Tech Store designs and delivers studio audio, GaN chargers, braided cables, and precision accessories.',
      });

      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Khizar Tech Store',
        url: BASE_URL,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${BASE_URL}/?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      });
    }

    // Update document title
    document.title = title;

    // Helper to update or create meta tags
    const setMetaTag = (attrName: string, attrVal: string, content: string) => {
      let meta = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attrName, attrVal);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    setMetaTag('name', 'description', description);
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);

    // Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // Structured data (Schema.org JSON-LD)
    const existingJsonLd = document.querySelectorAll('script[data-seo="json-ld"]');
    existingJsonLd.forEach((node) => node.remove());

    schemas.forEach((schema) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo', 'json-ld');
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });
  }, [route]);

  return null;
};
