'use client'; //required for Polaris
import ShopifyPurchaseOrdersTable from '../../components/ShopifyPurchaseOrdersTable';
import { PurchaseOrdersRow } from '../../components/PurchaseOrdersTable';
import enTranslations from '@shopify/polaris/locales/en.json';
import { AppProvider } from '@shopify/polaris';

export const getData = async () => {
  try {
    const res = await fetch('http://localhost:3100/api/purchase-orders', {cache: 'no-cache', next: { tags: ['purchase-orders'] }})
    const purchaseOrders: PurchaseOrdersRow[] = await res.json()
    return purchaseOrders
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    return [];
  }
}

export default async function Index() {
  const purchaseOrders = await getData()
  return (
    <AppProvider i18n={enTranslations}>
      <h1 className="text-2xl">Purchase Orders</h1>
      <ShopifyPurchaseOrdersTable purchaseOrders={purchaseOrders} />
    </AppProvider>
  );
}

