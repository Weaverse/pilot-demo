import { Image } from "@shopify/hydrogen";
import clsx from "clsx";

import type { MediaFragment } from "storefrontapi.generated";

/**
 * A client component that defines a media gallery for hosting images, 3D models, and videos of products
 */
export function ProductGallery({
  media,
  className,
}: {
  media: MediaFragment[];
  className?: string;
}) {
  if (!media.length) {
    return null;
  }

  return (
    <div
      className={`swimlane md:grid-flow-row hidden-scroll md:p-0 md:overflow-x-auto md:grid-cols-2 ${className}`}
    >
      {media.map((med, i) => {
        const isFirst = i === 0;
        const isFourth = i === 3;
        const isFullWidth = i % 3 === 0;

        const image =
          med.__typename === "MediaImage"
            ? { ...med.image, altText: med.alt || "Product image" }
            : null;

        const style = [
          isFullWidth ? "md:col-span-2" : "md:col-span-1",
          isFirst || isFourth ? "" : "md:aspect-[4/5]",
          "aspect-square snap-center card-image bg-white w-mobileGallery md:w-full",
        ].join(" ");

        return (
          <div className={style} key={med.id || image?.id}>
            {image && (
              <Image
                loading={i === 0 ? "eager" : "lazy"}
                data={image}
                aspectRatio={!isFirst && !isFourth ? "4/5" : undefined}
                sizes={
                  isFirst || isFourth
                    ? "(min-width: 48em) 60vw, 90vw"
                    : "(min-width: 48em) 30vw, 90vw"
                }
                className={clsx(
                  "object-cover w-full h-full aspect-square opacity-0 animate-fade-in",
                  i === 0 ? "vt-product-image" : "",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
