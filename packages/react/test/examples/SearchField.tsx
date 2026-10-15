import { SearchField } from '../../src/components/SearchField';

export default function Example() {
  return (
    <>
      <SearchField label="Search" placeholder="Search programs, FAQs, pages" hint="Press Enter to see results." />
      <SearchField label="Search" defaultValue="tap card" />
      <SearchField label="Search" defaultValue="x" error="Enter at least two letters." />
    </>
  );
}
