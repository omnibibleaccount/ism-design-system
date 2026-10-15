import { Chip, ChipGroup } from '../../src/components/Chip';

export default function Example() {
  return (
    <>
      <ChipGroup
        aria-label="Filter resources"
        defaultValue="all"
        options={[
          { value: 'all', label: 'All' },
          { value: 'about', label: 'About ISM' },
          { value: 'apps', label: 'Apps' },
          { value: 'giving', label: 'Giving' },
        ]}
      />
      <ChipGroup
        aria-label="Languages"
        mode="multiple"
        defaultValue={['am']}
        options={[{ value: 'am', label: 'Amharic' }, { value: 'es', label: 'Spanish' }, { value: 'sw', label: 'Swahili', disabled: true }]}
      />
      <Chip pressed>$50</Chip>
      <Chip>Other</Chip>
    </>
  );
}
