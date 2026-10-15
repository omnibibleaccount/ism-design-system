import { Combobox, type ComboboxOption } from '../../src/components/Combobox';

const languages: ComboboxOption[] = [
  { value: 'vi', label: 'Tiếng Việt', sub: 'Vietnamese', lang: 'vi' },
  { value: 'am', label: 'አማርኛ', sub: 'Amharic', lang: 'am' },
  { value: 'es', label: 'Español', sub: 'Spanish', lang: 'es' },
  { value: 'sw', label: 'Kiswahili', sub: 'Swahili', lang: 'sw' },
];

export default function Example() {
  return (
    <>
      <Combobox
        label="Language"
        options={languages}
        placeholder="Search or choose a language"
        showAllLabel="Show all languages"
        listLabel="Languages"
        formatHead={({ total, matches, filtering }) => (filtering ? `${matches} matches` : `All languages · ${total}`)}
      />
      <Combobox label="Language" options={languages} defaultValue="am" error="Please choose a language." />
      <Combobox
        variant="hero"
        label="Search for your language"
        options={languages}
        searchLabel="Search Bible languages"
        listLabel="Matching languages"
        showAllLabel="Show all languages"
        placeholder="Try “Español”, “Swahili” or “हिन्दी”"
        emptyAction={<a href="https://dot.bible">Browse every language on dot.Bible ↗</a>}
      />
    </>
  );
}
