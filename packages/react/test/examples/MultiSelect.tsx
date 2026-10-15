import { MultiSelect } from '../../src/components/MultiSelect';

const options = [
  { value: 'am', label: 'Amharic', native: 'አማርኛ', nativeLang: 'am' },
  { value: 'es', label: 'Spanish', native: 'Español', nativeLang: 'es' },
  { value: 'sw', label: 'Swahili', native: 'Kiswahili', nativeLang: 'sw' },
  { value: 'tl', label: 'Tagalog', native: 'Tagalog', nativeLang: 'tl' },
  { value: 'pt', label: 'Portuguese', native: 'Português', nativeLang: 'pt' },
];
const labels = {
  matches: (n: number) => `${n} matches`,
  empty: 'No languages match. Try the English or native name.',
  list: 'Languages',
};

export default function Example() {
  return (
    <>
      <MultiSelect label="Languages your church serves" options={options} labels={labels} placeholder="Choose languages" placeholderMore="Add more" />
      <MultiSelect
        label="Languages your church serves"
        options={options}
        labels={labels}
        defaultValue={['am', 'es', 'sw']}
        placeholderMore="Add more"
        hint="3 selected · Bibles in 500+ languages on dot.Bible"
      />
      <MultiSelect label="Languages" options={options} labels={labels} placeholder="Choose languages" error="Choose at least one language." required />
    </>
  );
}
