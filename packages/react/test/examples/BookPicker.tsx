import { BookPicker, type BookPickerLabels } from '../../src/components/BookPicker';

const labels: BookPickerLabels = {
  dialog: 'Choose a book and chapter',
  testament: 'Testament',
  breadcrumb: 'Current selection',
  verse: 'Verse',
  books: 'Books',
  chapters: 'Chapters',
  verses: 'Verses',
  chapterCount: (b, n) => `${b} · ${n} chapters`,
  chapterCell: (b, n) => `${b} chapter ${n}`,
  verseCell: (n) => `Verse ${n}`,
  legendCurrent: 'Current',
  legendHover: 'Hover',
  legendRead: 'Read',
  sheet: 'Choose a verse',
  step: 'Step',
  stepBook: 'Book',
  stepChapter: 'Chapter',
  stepVerse: 'Verse',
  back: 'Back to chapters',
  close: 'Close',
  go: (r) => `Go to ${r}`,
};

const testaments = [
  { id: 'ot', label: 'Old Testament', books: [{ id: 'gen', name: 'Genesis', chapters: 50 }, { id: 'ps', name: 'Psalms', chapters: 150 }] },
  { id: 'nt', label: 'New Testament', books: [{ id: 'john', name: 'John', chapters: 21 }, { id: '1cor', name: '1 Corinthians', chapters: 16 }] },
];

export default function Example() {
  return (
    <>
      <BookPicker testaments={testaments} labels={labels} defaultValue={{ book: 'john', chapter: 3 }} readChapters={{ john: [1, 2] }} />
      <BookPicker
        variant="sheet"
        testaments={testaments}
        labels={labels}
        defaultValue={{ book: 'john', chapter: 3, verse: 16 }}
        getVerseCount={() => 36}
      />
    </>
  );
}
