import { LanguageSwitcher, LanguageInline, type SiteLanguage } from '../../src/components/LanguageSwitcher';

const languages: SiteLanguage[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', dir: 'rtl' },
  { code: 'my', name: 'Burmese', nativeName: 'မြန်မာ' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
];

export default function Example() {
  const hrefFor = (l: SiteLanguage) => `/${l.code}/`;
  return (
    <>
      <LanguageSwitcher languages={languages} value="en" hrefFor={hrefFor} />
      <LanguageSwitcher
        languages={languages}
        value="am"
        hrefFor={hrefFor}
        defaultOpen
        heading="Site language"
        searchPlaceholder="Search languages"
        footer={<span>Scripture in 500+ languages</span>}
        renderEmpty={(q) => `This site isn't in ${q} yet.`}
      />
      <LanguageSwitcher languages={languages.slice(0, 3)} value="en" presentation="sheet" defaultOpen title="Choose a language" onChange={() => {}} />
      <LanguageInline languages={languages} value="en" hrefFor={hrefFor} moreLabel="More" />
    </>
  );
}
