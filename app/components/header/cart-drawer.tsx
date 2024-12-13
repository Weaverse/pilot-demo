import { Handbag, X } from "@phosphor-icons/react";
import * as Dialog from "@radix-ui/react-dialog";
import { Await, useRouteLoaderData } from "@remix-run/react";
import { type CartReturn, useAnalytics } from "@shopify/hydrogen";
import clsx from "clsx";
import { Suspense } from "react";
import Link from "~/components/link";
import { ScrollArea } from "~/components/scroll-area";
import { Cart } from "~/modules/cart";
import type { RootLoader } from "~/root";

export function CartDrawer({ isTransparent }: { isTransparent: boolean }) {
  let rootData = useRouteLoaderData<RootLoader>("root");
  let { publish } = useAnalytics();

  return (
    <Suspense
      fallback={
        <Link
          to="/cart"
          className="relative flex items-center justify-center w-8 h-8 focus:ring-border"
        >
          <Handbag className="w-5 h-5" />
        </Link>
      }
    >
      <Await resolve={rootData?.cart}>
        {(cart) => (
          <Dialog.Root>
            <Dialog.Trigger
              onClick={() => publish("custom_sidecart_viewed", { cart })}
              className="relative flex items-center justify-center w-8 h-8 focus:ring-border"
            >
              <Handbag className="w-5 h-5" />
              {cart?.totalQuantity > 0 && (
                <div
                  className={clsx(
                    "text-sm leading-none text-center font-medium subpixel-antialiased",
                    "flex items-center justify-center min-w-4 rounded-full p-0.5",
                    "absolute top-0 -right-1",
                    "transition-colors duration-300",
                    "group-hover/header:bg-[--color-header-text] group-hover/header:text-[--color-header-bg]",
                    isTransparent
                      ? "text-[--color-header-text] bg-[--color-transparent-header-text]"
                      : "bg-[--color-header-text] text-[--color-header-bg]",
                  )}
                >
                  <span>{cart?.totalQuantity}</span>
                </div>
              )}
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay
                className="fixed inset-0 bg-black/50 data-[state=open]:animate-fade-in z-10"
                style={{ "--fade-in-duration": "100ms" } as React.CSSProperties}
              />
              <Dialog.Content
                className={clsx([
                  "fixed inset-y-0 w-screen max-w-[400px] bg-[--color-background] py-4 z-10",
                  "right-0 translate-x-full data-[state=open]:animate-enter-from-right",
                ])}
                aria-describedby={undefined}
              >
                <div className="space-y-6">
                  <div className="flex gap-2 items-center justify-between px-4">
                    <Dialog.Title asChild className="py-2.5 font-bold">
                      <span>Cart</span>
                    </Dialog.Title>
                    <Dialog.Close asChild>
                      <button
                        className="p-2 translate-x-2"
                        aria-label="Close cart drawer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </Dialog.Close>
                  </div>
                  <ScrollArea className="max-h-[calc(100vh-4.5rem)]" size="sm">
                    <Cart layout="drawer" cart={cart as CartReturn} />
                  </ScrollArea>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        )}
      </Await>
    </Suspense>
  );
}
