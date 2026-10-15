import { IconButton } from '../../src/components/IconButton';
import { UiIcon } from '../../src/Icon';

export default function Example() {
  return (
    <>
      <div style={{ background: '#000', padding: 16, display: 'flex', gap: 8 }}>
        <IconButton aria-label="Open menu" aria-expanded={false} aria-controls="drawer"><UiIcon name="menu" /></IconButton>
        <IconButton aria-label="Search" size="sm"><UiIcon name="search" /></IconButton>
        <IconButton aria-label="Close" disabled><UiIcon name="close" /></IconButton>
      </div>
      <div style={{ display: 'flex', gap: 8, padding: 16 }}>
        <IconButton tone="light" aria-label="Share"><UiIcon name="share" /></IconButton>
        <IconButton tone="light" aria-label="Bookmark" pressed><UiIcon name="bookmark" /></IconButton>
        <IconButton tone="solid" size="lg" aria-label="Play ISM Radio"><UiIcon name="play" /></IconButton>
      </div>
    </>
  );
}
