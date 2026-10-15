import { Breadcrumbs } from '../../src/components/Breadcrumbs';

export default function Example() {
  return (
    <>
      <Breadcrumbs
        items={[{ label: 'Home', href: '/' }, { label: 'About ISM', href: '/about' }, { label: 'Statement of Faith' }]}
      />
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Resources', href: '/resources' },
          { label: 'ISM Publishing', href: '/resources/publishing' },
          { label: 'TAP Cards', href: '/resources/tap' },
          { label: 'Order', href: '/resources/tap/order' },
          { label: 'Checkout' },
        ]}
      />
      <Breadcrumbs dark items={[{ label: 'Home', href: '/' }, { label: 'Resources', href: '/resources' }, { label: 'HD Radio Broadcast' }]} />
    </>
  );
}
