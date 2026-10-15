import { AnchorNav } from '../../src/components/AnchorNav';

const items = [
  { id: 'scriptures', label: 'The Scriptures' },
  { id: 'god', label: 'God' },
  { id: 'jesus', label: 'Jesus Christ' },
  { id: 'spirit', label: 'The Holy Spirit' },
];

export default function Example() {
  return (
    <>
      <AnchorNav items={items} heading="On this page" current="jesus" />
      <AnchorNav
        variant="bar"
        title="dot.Bible App"
        items={[{ id: 'overview', label: 'Overview' }, { id: 'features', label: 'Features' }, { id: 'faq', label: 'FAQ' }]}
        current="features"
        action={<a className="btn btn-primary btn-sm" href="#get">Get the app</a>}
      />
    </>
  );
}
