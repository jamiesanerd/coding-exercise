'use client';
import { PurchaseOrderLineItems, PurchaseOrders } from '@prisma/client';
import {
  IndexTable,
  Card,
  useIndexResourceState,
  Text,
  useBreakpoints,
} from '@shopify/polaris';
import { IndexTableSortDirection } from '@shopify/polaris/build/ts/src/components/IndexTable';

import React, { useMemo, useState } from 'react';

export type PurchaseOrdersRow = PurchaseOrders & {
  purchase_order_line_items: PurchaseOrderLineItems[];
};

type ComputedPurchaseOrdersRow = Omit<PurchaseOrdersRow, 'id'> & {
  id: string;
  quantity: number;
  totalCost: number;
};

const dateFormat = (value: Date | null) => {
  if (value === null) {
    return '';
  }
  return new Date(value).toLocaleDateString();
};

const currencyFormat = (value: number) => {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

export default function ShopifyPurchaseOrdersTable({
  purchaseOrders,
}: {
  purchaseOrders: PurchaseOrdersRow[];
}) {
  const [computedPurchaseOrdersRows, setComputedPurchaseOrdersRows] = useState<
    ComputedPurchaseOrdersRow[]
  >(
    purchaseOrders.map((purchaseOrder) => {
      const { totalCost, quantity } =
        purchaseOrder.purchase_order_line_items.reduce(
          (acc, item) => {
            return {
              quantity: acc.quantity + item.quantity,
              totalCost: acc.totalCost + Number(item.unit_cost) * item.quantity,
            };
          },
          { quantity: 0, totalCost: 0 }
        );
      return {
        ...purchaseOrder,
        id: purchaseOrder.id.toString(),
        totalCost,
        quantity,
      };
    })
  );

  const resourceName = {
    singular: 'order',
    plural: 'orders',
  };

  const [sortDirection, setSortDirection] = useState<IndexTableSortDirection>();
  const [sortedColumnIndex, setSortedColumnIndex] = useState<number>();

  const handleSort = (
    headingIndex: number,
    direction: IndexTableSortDirection
  ) => {
    setSortDirection(direction);
    setSortedColumnIndex(headingIndex);
    const headingKey = [
      'id',
      'vendor_name',
      'order_date',
      'expected_delivery_date',
      'quantity',
      'totalCost',
    ][headingIndex] as keyof ComputedPurchaseOrdersRow;
    const sortedRows = [...computedPurchaseOrdersRows].sort((rowA, rowB) => {
      const valueA = rowA[headingKey];
      const valueB = rowB[headingKey];
      if (typeof valueA === 'string') {
        return valueA.localeCompare(valueB as string);
      }
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return valueA - valueB;
      }
      if (valueA instanceof Date && valueB instanceof Date) {
        return valueA.getTime() - valueB.getTime();
      }
      return 0;
    });
    if (direction === 'descending') {
      sortedRows.reverse();
    }
    setComputedPurchaseOrdersRows(sortedRows);
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(computedPurchaseOrdersRows);

  const rowMarkup = useMemo(
    () =>
      computedPurchaseOrdersRows.map(
        (
          {
            id,
            vendor_name,
            order_date,
            expected_delivery_date,
            quantity,
            totalCost,
            purchase_order_line_items,
          },
          index
        ) => {
          console.log(selectedResources);
          const selected = selectedResources.includes(id.toString());
          return (
            <>
              <IndexTable.Row
                id={id.toString()}
                key={id}
                selected={selected}
                position={index}
              >
                <IndexTable.Cell>
                  <Text as="span">{id}</Text>
                </IndexTable.Cell>
                <IndexTable.Cell>{vendor_name}</IndexTable.Cell>
                <IndexTable.Cell>
                  {' '}
                  <Text as="span" alignment="end" numeric>
                    {dateFormat(order_date)}
                  </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                  {' '}
                  <Text as="span" alignment="end" numeric>
                    {dateFormat(expected_delivery_date)}
                  </Text>
                </IndexTable.Cell>

                <IndexTable.Cell>
                  <Text as="span" alignment="end" numeric>
                    {quantity}
                  </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                  <Text as="span" alignment="end" numeric>
                    {currencyFormat(totalCost)}
                  </Text>
                </IndexTable.Cell>
              </IndexTable.Row>
              {selected ? (
                <>
                  <IndexTable.Row
                    rowType="subheader"
                    id={id.toString()}
                    hideSelectable={true}
                    position={0}
                    key={`${id}-subheader`}
                  >
                    <IndexTable.Cell colSpan={2} scope="colgroup" as="th">
                      <Text as="span" alignment="end">
                        {'Items in Order:'}
                      </Text>
                    </IndexTable.Cell>
                    <IndexTable.Cell as="th">
                      <Text as="span" alignment="end">
                        {'Item ID'}
                      </Text>
                    </IndexTable.Cell>
                    <IndexTable.Cell as="th">
                      <Text as="span" alignment="end">
                        {'Unit Cost'}
                      </Text>
                    </IndexTable.Cell>
                    <IndexTable.Cell as="th">
                      <Text as="span" alignment="end">
                        {'Quantity'}
                      </Text>
                    </IndexTable.Cell>
                    <IndexTable.Cell as="th">
                      <Text as="span" alignment="end">
                        {'Total Cost'}
                      </Text>
                    </IndexTable.Cell>
                  </IndexTable.Row>
                  {purchase_order_line_items.map((lineItem) => (
                    <IndexTable.Row
                      id={lineItem.id.toString()}
                      key={`${id}-${lineItem.id}`}
                      hideSelectable={true}
                      position={index}
                    >
                      <IndexTable.Cell colSpan={3}>
                        <Text as="span" alignment="end">
                          {lineItem.item_id}
                        </Text>
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                        <Text as="span" alignment="end" numeric>
                          {currencyFormat(Number(lineItem.unit_cost))}
                        </Text>
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                        <Text as="span" alignment="end" numeric>
                          {lineItem.quantity.toString()}
                        </Text>
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                        <Text as="span" alignment="end" numeric>
                          {currencyFormat(
                            Number(lineItem.unit_cost) * lineItem.quantity
                          )}
                        </Text>
                      </IndexTable.Cell>
                    </IndexTable.Row>
                  ))}
                </>
              ) : null}
            </>
          );
        }
      ),
    [computedPurchaseOrdersRows, selectedResources]
  );

  return (
    <Card>
      <IndexTable
        condensed={useBreakpoints().smDown}
        resourceName={resourceName}
        itemCount={computedPurchaseOrdersRows.length}
        selectedItemsCount={
          allResourcesSelected ? 'All' : selectedResources.length
        }
        onSelectionChange={handleSelectionChange}
        sortable={[true, true, true, true, true, true]}
        onSort={handleSort}
        sortColumnIndex={sortedColumnIndex}
        sortDirection={sortDirection}
        headings={[
          { title: 'Order' },
          { title: 'Vendor' },
          { title: 'Order Date', alignment: 'end' },
          { title: 'Expected Delivery Date', alignment: 'end' },
          { title: 'Quantity', alignment: 'end' },
          { title: 'Total Cost', alignment: 'end' },
        ]}
      >
        {rowMarkup}
      </IndexTable>
    </Card>
  );
}
