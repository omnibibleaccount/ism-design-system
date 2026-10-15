import { SearchResults, type SearchResultGroup } from '../../src/components/SearchResults';

const groups: SearchResultGroup[] = [
  {
    id: 'lang',
    title: 'Languages',
    items: [
      { id: 'sw', tile: 'SW', title: 'Swahili', subtitle: 'Kiswahili · Bible + audio', href: '/languages/sw' },
      { id: 'swa', tile: 'SW', title: 'Swati', subtitle: 'siSwati · Bible', onSelect: () => undefined },
    ],
  },
  {
    id: 'verse',
    title: 'Verses',
    kind: 'verse',
    count: 14,
    items: [{ id: 'v1', tile: 'JN', title: 'John 3:16', subtitle: 'For God so loved the swa…', onSelect: () => undefined }],
  },
  {
    id: 'page',
    title: 'Pages',
    kind: 'page',
    items: [{ id: 'p1', tile: 'WEB', title: 'Swahili Bible online', subtitle: 'ism.bible', href: 'https://ism.bible/sw', external: true }],
  },
];

export default function Example() {
  return (
    <>
      <div className="ap-screen">
        <SearchResults
          query="swa"
          placeholder="Search languages, verses"
          groups={groups}
          announcement="2 languages, 14 verses, 1 page"
        />
      </div>
      <div className="ap-screen">
        <SearchResults
          query=""
          placeholder="Search languages, verses"
          recents={['Amharic', 'John 3']}
          recentsHeading="Recent"
          clearRecentsLabel="Clear"
          suggestions={['Swahili', 'Psalms']}
          suggestionsHeading="Try"
        />
      </div>
      <div className="ap-screen">
        <SearchResults
          query="xqz"
          empty={{
            title: 'No results for “xqz”',
            hint: 'Check the spelling, or try a book name like “John” or a language like “Amharic”.',
            actionLabel: 'Browse all languages',
          }}
        />
      </div>
    </>
  );
}
