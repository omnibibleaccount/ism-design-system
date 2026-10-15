import { ReadingView } from '../../src/components/ReadingView';

export default function Example() {
  return (
    <>
      <ReadingView
        title="John 3, Berean Standard Bible"
        lang="en"
        pickerLabel="John 3"
        translationLabel="BSB"
        onListen={() => {}}
        bookLabel="The Gospel of John"
        chapterTitle="John 3"
        textSize={22}
        sections={[
          {
            heading: 'Jesus and Nicodemus',
            verses: [
              { number: 1, text: 'Now there was a man of the Pharisees named Nicodemus, a ruler of the Jews.' },
              { number: 3, text: 'Jesus replied, “Truly, truly, I tell you, no one can see the kingdom of God unless he is born again.”', highlight: true, footnoteId: 'fn-a' },
            ],
          },
        ]}
        footnotes={[{ id: 'fn-a', mark: 'a', reference: '3:3', text: <>Or <i>born from above</i>; also in verse 7</> }]}
      />
      <ReadingView
        title="Reader"
        theme="dark"
        dir="rtl"
        lang="ar"
        pickerLabel="يوحنا 3"
        translationLabel="AVD"
        pickerOpen
        translationOpen
        chapterTitle="يوحنا 3"
      />
    </>
  );
}
