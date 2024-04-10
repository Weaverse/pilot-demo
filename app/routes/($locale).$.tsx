import {WeaverseContent} from '~/weaverse';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type {LoadPageParams} from '@weaverse/hydrogen';

export async function loader({context}: LoaderFunctionArgs) {
  let weaverseData = await context.weaverse.loadPage({
    type: 'CUSTOM',
  });
  if (weaverseData?.page?.id && !weaverseData.page.id.includes('fallback')) {
    return {
      weaverseData,
    };
  }
  // If Weaverse Data not found, return 404
  throw new Response(null, {status: 404});
}

export default function Component() {
  return <WeaverseContent />;
}
