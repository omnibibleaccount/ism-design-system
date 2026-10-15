import { TabBar, type TabBarItem } from '../../src/components/TabBar';
import { UiIcon } from '../../src/Icon';

const tabs: TabBarItem[] = [
  { id: 'home', label: 'Home', icon: <UiIcon name="home" size={24} /> },
  { id: 'bible', label: 'Bible', icon: <UiIcon name="book-open" size={24} /> },
  { id: 'listen', label: 'Listen', icon: <UiIcon name="headphones" size={24} /> },
  { id: 'saved', label: 'Saved', icon: <UiIcon name="bookmark" size={24} /> },
  { id: 'more', label: 'More', icon: <UiIcon name="menu" size={24} />, dot: true, ariaLabel: 'More, new item' },
];

export default function Example() {
  return (
    <>
      <TabBar tabs={tabs} defaultValue="home" />
      <TabBar tabs={tabs} defaultValue="listen" dark />
    </>
  );
}
