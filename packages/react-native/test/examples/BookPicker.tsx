import { useState } from 'react';
import { View } from 'react-native';
import { BookPicker, type BookPickerBook, type BookPickerStep, type BookPickerTestament } from '../../src/components/BookPicker';

const BOOKS: BookPickerBook[] = [
  { id: 'gen', name: 'Genesis', chapters: 50, testament: 'old' },
  { id: 'ps', name: 'Psalms', chapters: 150, testament: 'old' },
  { id: 'matt', name: 'Matthew', chapters: 28, testament: 'new' },
  { id: 'john', name: 'John', chapters: 21, testament: 'new' },
  { id: '1cor', name: '1 Corinthians', chapters: 16, testament: 'new' },
];

export default function Example() {
  const [testament, setTestament] = useState<BookPickerTestament>('new');
  const [step, setStep] = useState<BookPickerStep>('verse');
  return (
    <View style={{ gap: 16 }}>
      <BookPicker books={BOOKS} testament={testament} onTestamentChange={setTestament} bookId="john" onSelectBook={() => {}} chapter={3} readChapters={[1, 2]} onSelectChapter={() => {}} />
      <BookPicker
        variant="sheet" books={BOOKS} testament={testament} onTestamentChange={setTestament} bookId="john" onSelectBook={() => {}} chapter={3}
        onSelectChapter={() => {}} step={step} onStepChange={setStep} verseCount={36} verse={16} onSelectVerse={() => {}} sheetTitle="John 3"
        confirmLabel="Go to John 3:16" onConfirm={() => {}} onClose={() => {}}
      />
      <BookPicker variant="sheet" books={BOOKS} testament="old" onTestamentChange={() => {}} onSelectBook={() => {}} onSelectChapter={() => {}} step="book" />
    </View>
  );
}
