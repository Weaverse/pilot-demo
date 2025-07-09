import { Money, mapSelectedProductOptionToObject } from "@shopify/hydrogen";
import type { MoneyV2 } from "@shopify/hydrogen/storefront-api-types";
import { useThemeSettings } from "@weaverse/hydrogen";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import type {
  ProductCardFragment,
  ProductVariantFragment,
} from "storefront-api.generated";
import { Image } from "~/components/image";
import { Link } from "~/components/link";
import { NavLink } from "~/components/nav-link";
import { Spinner } from "~/components/spinner";
import { RevealUnderline } from "~/reveal-underline";
import { calculateAspectRatio } from "~/utils/image";
import { BestSellerBadge, NewBadge, SaleBadge, SoldOutBadge } from "./badges";
import { ProductCardOptions } from "./product-card-options";
import { QuickShopTrigger } from "./quick-shop";
import { VariantPrices } from "./variant-prices";

const MAX_CACHED_IMAGES = 100;
const pcardLoadedImages = new Set<string>();

function addToImageCache(url: string) {
  if (pcardLoadedImages.size >= MAX_CACHED_IMAGES) {
    // Remove the oldest entry (first one added)
    const firstUrl = pcardLoadedImages.values().next().value;
    if (firstUrl) {
      pcardLoadedImages.delete(firstUrl);
    }
  }
  pcardLoadedImages.add(url);
}

export function ProductCard({
  product,
  className,
}: {
  product: ProductCardFragment;
  className?: string;
}) {
  const {
    pcardBorderRadius,
    pcardBackgroundColor,
    pcardShowImageOnHover,
    pcardImageRatio,
    pcardTitlePricesAlignment,
    pcardAlignment,
    pcardShowVendor,
    pcardShowLowestPrice,
    pcardShowSalePrice,
    pcardEnableQuickShop,
    pcardShowQuickShopOnHover,
    pcardQuickShopButtonType,
    pcardQuickShopButtonText,
    pcardQuickShopPanelType,
    pcardShowSaleBadges,
    pcardShowBestSellerBadges,
    pcardShowNewBadges,
    pcardShowOutOfStockBadges,
  } = useThemeSettings();

  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariantFragment | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { images, badges, priceRange } = product;
  const { minVariantPrice, maxVariantPrice } = priceRange;

  const handleVariantChange = (variant: ProductVariantFragment) => {
    // Clear any existing timeout
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }

    if (
      variant.image &&
      variant.id !== selectedVariant?.id &&
      !pcardLoadedImages.has(variant.image.url)
    ) {
      setIsImageLoading(true);
      // Set a timeout to prevent infinite loading state
      loadingTimeoutRef.current = setTimeout(() => {
        setIsImageLoading(false);
      }, 5000);
    }
    setSelectedVariant(variant);
  };

  // Reset loading state if variant doesn't have an image
  useEffect(() => {
    if (selectedVariant && !selectedVariant.image) {
      setIsImageLoading(false);
    }
  }, [selectedVariant]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  const firstVariant = product.selectedOrFirstAvailableVariant;
  const params = new URLSearchParams(
    mapSelectedProductOptionToObject(
      (selectedVariant || firstVariant)?.selectedOptions || [],
    ),
  );

  const isVertical = pcardTitlePricesAlignment === "vertical";
  const isBestSellerProduct = badges
    .filter(Boolean)
    .some(({ key, value }) => key === "best_seller" && value === "true");

  let [image, secondImage] = images.nodes;
  if (selectedVariant) {
    if (selectedVariant.image) {
      image = selectedVariant.image;
      const imageUrl = image.url;
      const imageIndex = images.nodes.findIndex(({ url }) => url === imageUrl);
      if (imageIndex > 0 && imageIndex < images.nodes.length - 1) {
        secondImage = images.nodes[imageIndex + 1];
      }
    }
  }

  return (
    <div
      className={clsx("rounded-(--pcard-radius)", className)}
      style={
        {
          backgroundColor: pcardBackgroundColor,
          "--pcard-radius": `${pcardBorderRadius}px`,
          "--pcard-image-ratio": calculateAspectRatio(image, pcardImageRatio),
        } as React.CSSProperties
      }
    >
      <div className="group relative">
        {image && (
          <Link
            to={`/products/${product.handle}?${params.toString()}`}
            prefetch="intent"
            className="group relative block aspect-(--pcard-image-ratio) overflow-hidden rounded-t-(--pcard-radius) bg-gray-100"
          >
            {/* Loading skeleton overlay */}
            {isImageLoading && <Spinner />}
            <Image
              className={clsx([
                "absolute inset-0",
                pcardShowImageOnHover &&
                  secondImage &&
                  "transition-opacity duration-300 group-hover:opacity-50",
              ])}
              sizes="(min-width: 64em) 25vw, (min-width: 48em) 30vw, 45vw"
              data={image}
              width={700}
              alt={image.altText || `Picture of ${product.title}`}
              loading="lazy"
              onLoad={() => {
                // Clear timeout when image loads successfully
                if (loadingTimeoutRef.current) {
                  clearTimeout(loadingTimeoutRef.current);
                  loadingTimeoutRef.current = null;
                }
                setIsImageLoading(false);
                if (!pcardLoadedImages.has(image.url)) {
                  addToImageCache(image.url);
                }
              }}
            />
            {pcardShowImageOnHover && secondImage && (
              <Image
                className={clsx([
                  "absolute inset-0",
                  "opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                ])}
                sizes="auto"
                width={700}
                data={secondImage}
                alt={
                  secondImage.altText || `Second picture of ${product.title}`
                }
                loading="lazy"
              />
            )}
          </Link>
        )}
        <div className="absolute top-2.5 right-2.5 flex gap-1">
          {pcardShowSaleBadges && (
            <SaleBadge
              price={minVariantPrice as MoneyV2}
              compareAtPrice={maxVariantPrice as MoneyV2}
            />
          )}
          {pcardShowBestSellerBadges && isBestSellerProduct && (
            <BestSellerBadge />
          )}
          {pcardShowNewBadges && <NewBadge publishedAt={product.publishedAt} />}
          {pcardShowOutOfStockBadges && <SoldOutBadge />}
        </div>
        {pcardEnableQuickShop && (
          <QuickShopTrigger
            productHandle={product.handle}
            showOnHover={pcardShowQuickShopOnHover}
            buttonType={pcardQuickShopButtonType}
            buttonText={pcardQuickShopButtonText}
            panelType={pcardQuickShopPanelType}
          />
        )}
      </div>
      <div
        className={clsx(
          "space-y-2 py-3 text-sm",
          pcardBackgroundColor && "px-2",
          isVertical && [
            pcardAlignment === "left" && "text-left",
            pcardAlignment === "center" && "text-center",
            pcardAlignment === "right" && "text-right",
          ],
        )}
      >
        {pcardShowVendor && (
          <div className="text-body-subtle uppercase">{product.vendor}</div>
        )}
        <div
          className={clsx(
            "flex",
            isVertical
              ? [
                  "flex-col gap-1",
                  [
                    pcardAlignment === "left" && "items-start",
                    pcardAlignment === "center" && "items-center",
                    pcardAlignment === "right" && "items-end",
                  ],
                ]
              : "justify-between gap-4",
          )}
        >
          <NavLink
            to={`/products/${product.handle}?${params.toString()}`}
            prefetch="intent"
            className={({ isTransitioning }) =>
              clsx(
                "font-bold ",
                isTransitioning && "[view-transition-name:product-image]",
              )
            }
          >
            <RevealUnderline>{product.title}</RevealUnderline>
          </NavLink>
          {pcardShowLowestPrice ? (
            <div className="flex gap-1">
              <span>From</span>
              <Money withoutTrailingZeros data={minVariantPrice} />
            </div>
          ) : (
            <VariantPrices
              variant={selectedVariant || firstVariant}
              showCompareAtPrice={pcardShowSalePrice}
            />
          )}
        </div>
        <ProductCardOptions
          product={product}
          selectedVariant={selectedVariant}
          setSelectedVariant={handleVariantChange}
          className={clsx(
            isVertical && [
              pcardAlignment === "left" && "justify-start",
              pcardAlignment === "center" && "justify-center",
              pcardAlignment === "right" && "justify-end",
            ],
          )}
        />
      </div>
    </div>
  );
}
