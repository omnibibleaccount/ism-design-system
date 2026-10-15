import { Tabs } from '../../src/components/Tabs';
import { DirectionProvider } from '../../src/direction';

export default function Example() {
  return (
    <>
      <Tabs
        label="Resource types"
        items={[
          { value: 'all', label: 'All resources', count: 24, panel: <p>Everything.</p> },
          { value: 'apps', label: 'Apps', count: 6, panel: <p>Apps.</p> },
          { value: 'radio', label: 'Radio', count: 3, panel: <p>Radio.</p> },
          { value: 'archive', label: 'Archive', count: 0, disabled: true, panel: <p>Archive.</p> },
        ]}
      />
      <Tabs
        variant="segmented"
        label="Gift frequency"
        defaultValue="monthly"
        items={[{ value: 'once', label: 'One-time' }, { value: 'monthly', label: 'Monthly' }, { value: 'yearly', label: 'Yearly' }]}
      />
      <Tabs
        variant="segmented"
        dark
        label="Mode"
        items={[{ value: 'listen', label: 'Listen' }, { value: 'read', label: 'Read' }]}
      />
      <Tabs
        variant="vertical"
        label="Ways to partner"
        items={[{ value: 'pray', label: 'Pray', panel: <p>Pray.</p> }, { value: 'give', label: 'Give', panel: <p>Give.</p> }]}
      />
      <Tabs scrollable label="Scrolling row" items={[{ value: 'a', label: 'One' }, { value: 'b', label: 'Two' }]} />
      <DirectionProvider dir="rtl">
        <Tabs label="RTL" items={[{ value: 'a', label: 'الأول' }, { value: 'b', label: 'الثاني' }]} />
      </DirectionProvider>
    </>
  );
}
