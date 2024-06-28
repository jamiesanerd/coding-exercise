import { PurchaseOrdersRow, PurchaseOrdersTable } from '../../components/PurchaseOrdersTable';

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
    <>
      <h1 className="text-2xl">Purchase Orders</h1>
      <PurchaseOrdersTable purchaseOrders={purchaseOrders} />
    </>
  );
}

