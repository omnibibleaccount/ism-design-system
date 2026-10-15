import { Iconography, IconTile, UiIcon, MinistryIcon } from '../../src/components/Iconography';

export default function Example() {
  return (
    <>
      <UiIcon name="chevron-down" size={16} />
      <UiIcon name="search" size={24} title="Search" />
      <MinistryIcon name="translate" size={32} />
      <MinistryIcon name="bible" size={48} title="Bible" />
      <IconTile><UiIcon name="home" /></IconTile>
      <IconTile gold><UiIcon name="star" /></IconTile>
      <Iconography set="ui" size={20} />
      <Iconography set="ministry" size={24} showNames={false} />
    </>
  );
}
