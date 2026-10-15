import { DescriptionList } from '../../src/components/DescriptionList';
import { StatusBadge } from '../../src/components/Badge';

export default function Example() {
  return (
    <>
      <DescriptionList
        title="Order details"
        status={<StatusBadge tone="success" dot>Shipped</StatusBadge>}
        items={[
          { term: 'Order number', description: 'ISM-24817', numeric: true },
          { term: 'Item', description: 'NFC Bible cards × 50' },
          { term: 'Subtotal', description: '$45.00', numeric: true },
          { term: 'Total', description: '$51.50', numeric: true, total: true },
        ]}
      />
      <DescriptionList items={[{ term: 'Language', description: 'Amharic' }]} />
      <DescriptionList variant="glossary" items={[{ term: 'HD Radio', description: 'Digital radio that carries extra channels on one FM signal.' }, { term: 'NFC', description: 'A tap-to-share chip.' }]} />
    </>
  );
}
