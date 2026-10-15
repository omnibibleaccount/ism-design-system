import { VerseBlock, VerseCitation } from '../../src/components/VerseBlock';

export default function Example() {
  return (
    <>
      <VerseBlock
        text="For God so loved the world that He gave His one and only Son, that everyone who believes in Him shall not perish but have eternal life."
        reference="John 3:16"
        translation="BSB"
        lang="en"
        onShare={() => {}}
        onCopy={() => {}}
        onBookmarkChange={() => {}}
      />
      <VerseBlock text="Saved verse" reference="1 Corinthians 13:4–7" translation="BSB" bookmarked onBookmarkChange={() => {}} />
      <VerseBlock
        variant="votd"
        eyebrow="Verse of the day"
        text="Your word is a lamp to my feet and a light to my path."
        reference="Psalm 119:105"
        translation="BSB"
        onShare={() => {}}
        more={<>Read the whole chapter in the dot.Bible app <VerseCitation dark opensPage href="/psalm-119">Psalm 119</VerseCitation></>}
      />
      <p>See <VerseCitation href="/john-3#3">John 3:3</VerseCitation>.</p>
      <VerseBlock text="اردو" reference="یوحنا 3:16" lang="ur" dir="rtl" />
    </>
  );
}
