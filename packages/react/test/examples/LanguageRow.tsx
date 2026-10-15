import { LanguageRow, LanguageList } from '../../src/components/LanguageRow';

const formats = [
  { type: 'app' as const, label: 'App' },
  { type: 'read' as const, label: 'Read' },
  { type: 'listen' as const, label: 'Listen' },
  { type: 'print' as const, label: 'Print' },
];

export default function Example() {
  return (
    <>
      <LanguageList>
        <LanguageRow href="/amharic" nativeName="አማርኛ" nativeLang="am" englishName="Amharic" formats={formats} />
        <LanguageRow href="/urdu" nativeName="اردو" nativeLang="ur" nativeDir="rtl" englishName="Urdu" formats={formats.slice(0, 2)} />
      </LanguageList>
      <LanguageRow
        variant="card"
        href="/amharic"
        nativeName="አማርኛ"
        nativeLang="am"
        englishName="Amharic"
        meta="Amharic · Ethiopia · 57M speakers (sample)"
        formats={formats}
      />
    </>
  );
}
