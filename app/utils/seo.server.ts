import type { SeoConfig } from "@shopify/hydrogen";
import type {
  Article,
  Blog,
  Collection,
  Image,
  Page,
  Product,
  ShopPolicy,
} from "@shopify/hydrogen/storefront-api-types";
import type { BreadcrumbList, CollectionPage, Offer } from "schema-dts";
import type { ProductQuery, ShopFragment } from "storefront-api.generated";

function root({
  shop,
  url,
}: {
  shop: ShopFragment;
  url: Request["url"];
}): SeoConfig {
  return {
    title: shop?.name,
    titleTemplate: "%s | Weaverse Hydrogen Demo Store",
    description: truncate(shop?.description ?? ""),
    handle: "@weaverse",
    url,
    robots: {
      noIndex: false,
      noFollow: false,
    },
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: shop.name,
      logo: shop.brand?.logo?.image?.url,
      sameAs: [
        "https://twitter.com/weaverseio",
        "https://facebook.com/weaverse",
        "https://instagram.com/weaverse.io",
        "https://youtube.com/@weaverse",
      ],
      url,
      potentialAction: {
        "@type": "SearchAction",
        target: `${url}search?q={search_term}`,
        query: "required name='search_term'",
      },
    },
  };
}

function home(): SeoConfig {
  return {
    title: "Home",
    titleTemplate: "%s | Weaverse Hydrogen Demo Store",
    description: "The best Shopify Hydrogen Theme Customizer",
    robots: {
      noIndex: false,
      noFollow: false,
    },
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Home page",
    },
  };
}

function productJsonLd({
  product,
  selectedVariant,
  url,
}: {
  product: ProductQuery["product"];
  selectedVariant: ProductQuery["product"]["selectedOrFirstAvailableVariant"];
  url: Request["url"];
}): SeoConfig["jsonLd"] {
  const origin = new URL(url).origin;
  const description = truncate(
    product?.seo?.description ?? product?.description,
  );

  // Create offers array from adjacent variants
  const offers: Offer[] = [];
  if (product?.adjacentVariants) {
    for (const variant of product.adjacentVariants) {
      const variantUrl = new URL(url);
      for (const option of variant.selectedOptions) {
        variantUrl.searchParams.set(option.name, option.value);
      }
      const availability = variant.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock";

      offers.push({
        "@type": "Offer",
        availability,
        price: Number.parseFloat(variant.price.amount),
        priceCurrency: variant.price.currencyCode,
        sku: variant?.sku ?? "",
        url: variantUrl.toString(),
      });
    }
  }

  // If no adjacent variants, add the selected variant
  if (offers.length === 0 && selectedVariant) {
    const availability = selectedVariant.availableForSale
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock";

    offers.push({
      "@type": "Offer",
      availability,
      price: Number.parseFloat(selectedVariant.price.amount),
      priceCurrency: selectedVariant.price.currencyCode,
      sku: selectedVariant?.sku ?? "",
      url,
    });
  }

  return [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Products",
          item: `${origin}/products`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: product.title,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      brand: {
        "@type": "Brand",
        name: product.vendor,
      },
      description,
      image: [selectedVariant?.image?.url ?? ""],
      name: product.title,
      offers,
      sku: selectedVariant?.sku ?? "",
      url,
    },
  ];
}

function product({
  product,
  url,
}: {
  product: ProductQuery["product"];
  url: Request["url"];
}): SeoConfig {
  const description = truncate(
    product?.seo?.description ?? product?.description ?? "",
  );
  const selectedVariant = product?.selectedOrFirstAvailableVariant;
  return {
    title: product?.seo?.title ?? product?.title,
    description,
    media: selectedVariant?.image,
    jsonLd: productJsonLd({ product, selectedVariant, url }),
  };
}

type CollectionRequiredFields = Omit<
  Collection,
  "products" | "descriptionHtml" | "metafields" | "image" | "updatedAt"
> & {
  products: { nodes: Pick<Product, "handle">[] };
  image?: null | Pick<Image, "url" | "height" | "width" | "altText">;
  descriptionHtml?: null | Collection["descriptionHtml"];
  updatedAt?: null | Collection["updatedAt"];
  metafields?: null | Collection["metafields"];
};

function collectionJsonLd({
  url,
  collection,
}: {
  url: Request["url"];
  collection: CollectionRequiredFields;
}): SeoConfig["jsonLd"] {
  const siteUrl = new URL(url);
  const itemListElement: CollectionPage["mainEntity"] =
    collection.products.nodes.map((product, index) => {
      return {
        "@type": "ListItem",
        position: index + 1,
        url: `/products/${product.handle}`,
      };
    });

  return [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Collections",
          item: `${siteUrl.host}/collections`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: collection.title,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: collection?.seo?.title ?? collection?.title ?? "",
      description: truncate(
        collection?.seo?.description ?? collection?.description ?? "",
      ),
      image: collection?.image?.url,
      url: `/collections/${collection.handle}`,
      mainEntity: {
        "@type": "ItemList",
        itemListElement,
      },
    },
  ];
}

function collection({
  collection,
  url,
}: {
  collection: CollectionRequiredFields;
  url: Request["url"];
}): SeoConfig {
  return {
    title: collection?.seo?.title,
    description: truncate(
      collection?.seo?.description ?? collection?.description ?? "",
    ),
    titleTemplate: "%s | Collection",
    url,
    media: {
      type: "image",
      url: collection?.image?.url,
      height: collection?.image?.height,
      width: collection?.image?.width,
      altText: collection?.image?.altText,
    },
    jsonLd: collectionJsonLd({ collection, url }),
  };
}

type CollectionListRequiredFields = {
  nodes: Omit<CollectionRequiredFields, "products">[];
};

function collectionsJsonLd({
  url,
  collections,
}: {
  url: Request["url"];
  collections: CollectionListRequiredFields;
}): SeoConfig["jsonLd"] {
  const itemListElement: CollectionPage["mainEntity"] = collections.nodes.map(
    (collection, index) => {
      return {
        "@type": "ListItem",
        position: index + 1,
        url: `/collections/${collection.handle}`,
      };
    },
  );

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Collections",
    description: "All collections",
    url,
    mainEntity: {
      "@type": "ItemList",
      itemListElement,
    },
  };
}

function listCollections({
  collections,
  url,
}: {
  collections: CollectionListRequiredFields;
  url: Request["url"];
}): SeoConfig {
  return {
    title: "Collections",
    titleTemplate: "%s | Collections",
    description: "All hydrogen collections",
    url,
    jsonLd: collectionsJsonLd({ collections, url }),
  };
}

function article({
  article,
  url,
}: {
  article: Pick<
    Article,
    "title" | "contentHtml" | "seo" | "publishedAt" | "excerpt"
  > & {
    image?: null | Pick<
      NonNullable<Article["image"]>,
      "url" | "height" | "width" | "altText"
    >;
  };
  url: Request["url"];
}): SeoConfig {
  return {
    title: article?.seo?.title ?? article?.title,
    description: truncate(article?.seo?.description ?? ""),
    titleTemplate: "%s | Journal",
    url,
    media: {
      type: "image",
      url: article?.image?.url,
      height: article?.image?.height,
      width: article?.image?.width,
      altText: article?.image?.altText,
    },
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      alternativeHeadline: article.title,
      articleBody: article.contentHtml,
      datePublished: article?.publishedAt,
      description: truncate(
        article?.seo?.description || article?.excerpt || "",
      ),
      headline: article?.seo?.title || "",
      image: article?.image?.url,
      url,
    },
  };
}

function blog({
  blog,
  url,
}: {
  blog: Pick<Blog, "seo" | "title">;
  url: Request["url"];
}): SeoConfig {
  return {
    title: blog?.seo?.title,
    description: truncate(blog?.seo?.description || ""),
    titleTemplate: "%s | Blog",
    url,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: blog?.seo?.title || blog?.title || "",
      description: blog?.seo?.description || "",
      url,
    },
  };
}

function page({
  page,
  url,
}: {
  page: Pick<Page, "title" | "seo">;
  url: Request["url"];
}): SeoConfig {
  return {
    description: truncate(page?.seo?.description || ""),
    title: page?.seo?.title ?? page?.title,
    titleTemplate: "%s | Page",
    url,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: page.title,
    },
  };
}

function policy({
  policy,
  url,
}: {
  policy: Pick<ShopPolicy, "title" | "body">;
  url: Request["url"];
}): SeoConfig {
  return {
    description: truncate(policy?.body ?? ""),
    title: policy?.title,
    titleTemplate: "%s | Policy",
    url,
  };
}

function policies({
  policies,
  url,
}: {
  policies: Array<Pick<ShopPolicy, "title" | "handle">>;
  url: Request["url"];
}): SeoConfig {
  const origin = new URL(url).origin;
  const itemListElement: BreadcrumbList["itemListElement"] = policies
    .filter(Boolean)
    .map((policy, index) => {
      return {
        "@type": "ListItem",
        position: index + 1,
        name: policy.title,
        item: `${origin}/policies/${policy.handle}`,
      };
    });
  return {
    title: "Policies",
    titleTemplate: "%s | Policies",
    description: "Weaverse Hydrogen store policies",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement,
      },
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        description: "Weaverse Hydrogen store policies",
        name: "Policies",
        url,
      },
    ],
  };
}

export const seoPayload = {
  article,
  blog,
  collection,
  home,
  listCollections,
  page,
  policies,
  policy,
  product,
  root,
};

/**
 * Truncate a string to a given length, adding an ellipsis if it was truncated
 * @param str - The string to truncate
 * @param num - The maximum length of the string
 * @returns The truncated string
 * @example
 * ```js
 * truncate('Hello world', 5) // 'Hello...'
 * ```
 */
function truncate(str: string, num = 155): string {
  if (typeof str !== "string") return "";
  if (str.length <= num) {
    return str;
  }
  return `${str.slice(0, num - 3)}...`;
}
