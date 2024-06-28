import { PurchaseOrderLineItems, PurchaseOrders } from '@prisma/client';
import { useMemo } from 'react';

export type PurchaseOrdersRow = PurchaseOrders & {
  purchase_order_line_items: PurchaseOrderLineItems[];
};

type ComputedPurchaseOrdersRow = PurchaseOrdersRow & {
  totalCost: number;
  quantity: number;
};

const dateFormat = (value: Date | null) => {
  if (value === null) {
    return '';
  }
  return new Date(value).toLocaleDateString();
};

export function PurchaseOrdersTable({
  purchaseOrders,
}: {
  purchaseOrders: PurchaseOrdersRow[];
}) {
  const computedPurchaseOrdersRows = useMemo(() => {
    return purchaseOrders.map((purchaseOrder) => {
      const { totalCost, quantity } =
        purchaseOrder.purchase_order_line_items.reduce(
          (acc, item) => {
            return {
              totalCost: acc.totalCost + Number(item.unit_cost) * item.quantity,
              quantity: acc.quantity + item.quantity,
            };
          },
          { totalCost: 0, quantity: 0 }
        );
      return {
        ...purchaseOrder,
        totalCost,
        quantity,
      };
    });
  }, [purchaseOrders]);

  return (
    <table className="border-collapse table-auto w-full text-sm">
      <thead>
        <tr>
          <th className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-left">
            Order ID
          </th>
          <th className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-left">
            Vendor
          </th>
          <th className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-left">
            Expected Delivery Date
          </th>
          <th className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-left">
            Order Date
          </th>
          <th className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-left">
            Total Cost
          </th>
          <th className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-left">
            Quantity
          </th>
          <th className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-left w-64">
            Details
          </th>
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-slate-800">
        {computedPurchaseOrdersRows.map(
          (purchaseOrder: ComputedPurchaseOrdersRow) => (
            <tr key={purchaseOrder.id}>
              <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
                {purchaseOrder.id}
              </td>
              <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
                {purchaseOrder.vendor_name}
              </td>
              <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
                {dateFormat(purchaseOrder.expected_delivery_date)}
              </td>
              <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
                {dateFormat(purchaseOrder.order_date)}
              </td>
              <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
                {`$${purchaseOrder.totalCost}`}
              </td>
              <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
                {purchaseOrder.quantity}
              </td>
              <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
                <table className="table-auto">
                  <thead>
                    <tr>
                      <th className="align-left pr-4">ID</th>
                      <th className="align-left pr-4">Quantity</th>
                      <th className="align-left pr-4">Unit Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchaseOrder.purchase_order_line_items.map(
                      (item: PurchaseOrderLineItems) => (
                        <tr key={item.id}>
                          <td>{item.item_id}</td>
                          <td>{item.quantity}</td>
                          <td>{`$${item.unit_cost}`}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
}
