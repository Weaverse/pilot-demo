import { Image, flattenConnection } from "@shopify/hydrogen";
import type { OrderCardFragment } from "customer-accountapi.generated";
import { statusMessage } from "~/lib/utils";
import { Heading, Text } from "~/modules/text";
import { Link } from "~/components/link";

export function OrderCard({ order }: { order: OrderCardFragment }) {
  if (!order?.id) return null;
  const [legacyOrderId, key] = order!.id!.split("/").pop()!.split("?");
  const lineItems = flattenConnection(order?.lineItems);
  const fulfillmentStatus = flattenConnection(order?.fulfillments)[0]?.status;

  return (
    <li className="grid text-center border rounded">
      <Link
        className="grid items-center gap-4 p-4 md:gap-6 md:p-6 md:grid-cols-2"
        to={`/account/orders/${legacyOrderId}?${key}`}
        prefetch="intent"
      >
        {lineItems[0].image && (
          <div className="card-image aspect-square bg-background/5">
            <Image
              width={168}
              height={168}
              className="w-full opacity-0 animate-fade-in cover"
              alt={lineItems[0].image?.altText ?? "Order image"}
              src={lineItems[0].image.url}
            />
          </div>
        )}
        <div
          className={`flex-col justify-center text-left ${
            !lineItems[0].image && "md:col-span-2"
          }`}
        >
          <Heading as="h3" format size="copy">
            {lineItems.length > 1
              ? `${lineItems[0].title} +${lineItems.length - 1} more`
              : lineItems[0].title}
          </Heading>
          <dl className="grid grid-gap-1">
            <dt className="sr-only">Order ID</dt>
            <dd>
              <Text size="fine" color="subtle">
                Order No. {order.number}
              </Text>
            </dd>
            <dt className="sr-only">Order Date</dt>
            <dd>
              <Text size="fine" color="subtle">
                {new Date(order.processedAt).toDateString()}
              </Text>
            </dd>
            {fulfillmentStatus && (
              <>
                <dt className="sr-only">Fulfillment Status</dt>
                <dd className="mt-2">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      fulfillmentStatus === "SUCCESS"
                        ? "bg-green-100 text-green-800"
                        : "bg-background/5 text-body/50"
                    }`}
                  >
                    <Text size="fine">{statusMessage(fulfillmentStatus)}</Text>
                  </span>
                </dd>
              </>
            )}
          </dl>
        </div>
      </Link>
      <div className="self-end border-t">
        <Link
          className="block w-full p-2 text-center"
          to={`/account/orders/${legacyOrderId}?${key}`}
          prefetch="intent"
        >
          <Text color="subtle" className="ml-3">
            View Details
          </Text>
        </Link>
      </div>
    </li>
  );
}

export const ORDER_CARD_FRAGMENT = `#graphql
  fragment OrderCard on Order {
    id
    orderNumber
    processedAt
    financialStatus
    fulfillmentStatus
    currentTotalPrice {
      amount
      currencyCode
    }
    lineItems(first: 2) {
      edges {
        node {
          variant {
            image {
              url
              altText
              height
              width
            }
          }
          title
        }
      }
    }
  }
`;
