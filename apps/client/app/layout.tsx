import './global.css';
import '@shopify/polaris/build/esm/styles.css';
import Link from 'next/link';

export const metadata = {
  title: 'GoodDay Software Coding Exercise',
  description: 'Thank you for your time!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-[var(--p-color-bg)]">
      <body>
        <div className="container mx-auto">
          <div className="navbar bg-accent-content/5 mt-2 mb-4 rounded-md">
            <Link
              href="/purchase-orders"
              className="btn btn-ghost normal-case text-xl"
            >
              Purchase Orders
            </Link>
            <Link
              href="/parent-items"
              className="btn btn-ghost normal-case text-xl"
            >
              Item Catalog
            </Link>
          </div>
          <div className="mx-6 mb-6">{children}</div>
        </div>
      </body>
    </html>
  );
}
