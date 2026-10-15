import { AppBar } from '../../src/components/AppBar';
import { UiIcon } from '../../src/Icon';

const share = { label: 'Share', icon: <UiIcon name="share" size={24} /> };
const more = { label: 'More', icon: <UiIcon name="more-horizontal" size={24} /> };

export default function Example() {
  return (
    <>
      <AppBar statusBar={<span>9:41</span>} back={{ label: 'Books' }} title="John 3" actions={[share, more]} />
      <AppBar variant="large" title="Bible" actions={[{ label: 'Search', icon: <UiIcon name="search" size={24} /> }]} searchPlaceholder="Search books and verses" />
      <AppBar scrolled title="Settings" />
      <AppBar variant="search" searchValue="swa" onSearchChange={() => undefined} />
      <AppBar dark back={{ label: 'Books' }} title="John 3" actions={[share]} />
      <AppBar glass dark actions={[share, more]} />
    </>
  );
}
