import {
  type HydrogenComponentProps,
  type InspectorGroup,
} from "@weaverse/hydrogen";
import clsx from "clsx";
import type { HTMLAttributes } from "react";
import React, { forwardRef } from "react";
import type { BackgroundImageProps } from "./BackgroundImage";
import { BackgroundImage, backgroundInputs } from "./BackgroundImage";
import { Overlay, overlayInputs } from "./Overlay";

export type SectionWidth = "full" | "stretch" | "fixed";
export type VerticalPadding = "none" | "small" | "medium" | "large";
export type DividerType = "none" | "top" | "bottom" | "both";
export type SectionAlignment = "unset" | "left" | "center" | "right";

export type SectionProps = HydrogenComponentProps &
  HTMLAttributes<HTMLElement> &
  BackgroundImageProps &
  Partial<{
    as: React.ElementType;
    width: SectionWidth;
    gap: number;
    contentAlignment: SectionAlignment;
    className: string;
    verticalPadding: VerticalPadding;
    divider: DividerType;
    borderRadius: number;
    enableOverlay: boolean;
    overlayColor: string;
    overlayOpacity: number;
    backgroundColor: string;
    backgroundFor: "section" | "content";
    children: React.ReactNode;
  }>;

export let gapClasses: Record<number, string> = {
  0: "",
  4: "space-y-1",
  8: "space-y-2",
  12: "space-y-3",
  16: "space-y-4",
  20: "space-y-5",
  24: "space-y-3 lg:space-y-6",
  28: "space-y-3.5 lg:space-y-7",
  32: "space-y-4 lg:space-y-8",
  36: "space-y-4 lg:space-y-9",
  40: "space-y-5 lg:space-y-10",
  44: "space-y-5 lg:space-y-11",
  48: "space-y-6 lg:space-y-12",
  52: "space-y-6 lg:space-y-[52px]",
  56: "space-y-7 lg:space-y-14",
  60: "space-y-7 lg:space-y-[60px]",
};

export let verticalPaddingClasses: Record<VerticalPadding, string> = {
  none: "",
  small: "py-4 md:py-6 lg:py-8",
  medium: "py-8 md:py-12 lg:py-16",
  large: "py-12 md:py-24 lg:py-32",
};

let paddingClasses = {
  full: "",
  stretch: "px-3 md:px-10 lg:px-16",
  fixed: "px-3 md:px-4 lg:px-6 mx-auto",
};

export let widthClasses: Record<SectionWidth, string> = {
  full: "w-full h-full",
  stretch: "w-full h-full",
  fixed: "w-full h-full max-w-[var(--page-width,1280px)] mx-auto",
};

export let alignmentClasses: Record<SectionAlignment, string> = {
  unset: "",
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export let Section = forwardRef<HTMLElement, SectionProps>((props, ref) => {
  let {
    as: Component = "section",
    width,
    gap,
    contentAlignment,
    divider,
    verticalPadding,
    borderRadius,
    backgroundColor,
    backgroundFor,
    backgroundImage,
    backgroundFit,
    backgroundPosition,
    enableOverlay,
    overlayColor,
    overlayOpacity,
    className,
    children,
    style = {},
    ...rest
  } = props;

  return (
    <>
      {(divider === "top" || divider === "both") && <Divider />}
      <Component
        ref={ref}
        {...rest}
        className={clsx(
          "relative overflow-hidden",
          paddingClasses[width!],
          className,
        )}
        style={{
          ...style,
          backgroundColor: backgroundFor === "section" ? backgroundColor : "",
          borderRadius: backgroundFor === "section" ? borderRadius : "",
        }}
      >
        {backgroundFor === "section" && (
          <>
            <BackgroundImage
              backgroundImage={backgroundImage}
              backgroundFit={backgroundFit}
              backgroundPosition={backgroundPosition}
            />
            <Overlay
              enable={enableOverlay}
              color={overlayColor}
              opacity={overlayOpacity}
            />
          </>
        )}
        <div
          className={clsx(
            "relative overflow-hidden",
            widthClasses[width!],
            gapClasses[gap!],
            verticalPaddingClasses[verticalPadding!],
            alignmentClasses[contentAlignment!],
          )}
          style={{
            backgroundColor: backgroundFor === "content" ? backgroundColor : "",
            borderRadius: backgroundFor === "content" ? borderRadius : "",
          }}
        >
          {backgroundFor === "content" && (
            <>
              <BackgroundImage
                backgroundImage={backgroundImage}
                backgroundFit={backgroundFit}
                backgroundPosition={backgroundPosition}
              />
              <Overlay
                enable={enableOverlay}
                color={overlayColor}
                opacity={overlayOpacity}
              />
            </>
          )}
          {children}
        </div>
      </Component>
      {(divider === "bottom" || divider === "both") && <Divider />}
    </>
  );
});

function Divider() {
  return <div className="border-t w-2/3 lg:w-1/2 mx-auto" />;
}

export let layoutInputs: InspectorGroup["inputs"] = [
  {
    type: "heading",
    label: "Layout",
  },
  {
    type: "select",
    name: "width",
    label: "Content width",
    configs: {
      options: [
        { value: "full", label: "Full page" },
        { value: "stretch", label: "Stretch" },
        { value: "fixed", label: "Fixed" },
      ],
    },
    defaultValue: "fixed",
  },
  {
    type: "select",
    name: "contentAlignment",
    label: "Items alignment",
    configs: {
      options: [
        { value: "unset", label: "Unset" },
        { value: "left", label: "Left" },
        { value: "center", label: "Center" },
        { value: "right", label: "Right" },
      ],
    },
    defaultValue: "center",
  },
  {
    type: "range",
    name: "gap",
    label: "Items spacing",
    configs: {
      min: 0,
      max: 60,
      step: 4,
      unit: "px",
    },
    defaultValue: 20,
  },
  {
    type: "select",
    name: "verticalPadding",
    label: "Vertical padding",
    configs: {
      options: [
        { value: "none", label: "None" },
        { value: "small", label: "Small" },
        { value: "medium", label: "Medium" },
        { value: "large", label: "Large" },
      ],
    },
    defaultValue: "medium",
  },
  {
    type: "select",
    name: "divider",
    label: "Divider",
    configs: {
      options: [
        { value: "none", label: "None" },
        { value: "top", label: "Top" },
        { value: "bottom", label: "Bottom" },
        { value: "both", label: "Both" },
      ],
    },
    defaultValue: "none",
  },
  {
    type: "range",
    name: "borderRadius",
    label: "Corner radius",
    configs: {
      min: 0,
      max: 40,
      step: 2,
      unit: "px",
    },
    defaultValue: 0,
  },
];

export let sectionInspector: InspectorGroup = {
  group: "General",
  inputs: [...layoutInputs, ...backgroundInputs, ...overlayInputs],
};
