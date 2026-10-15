import { Badge, StatusBadge, Tag, Count } from '../../src/components/Badge';

export default function Example() {
  return (
    <>
      <Badge>Trending</Badge>
      <Badge tone="outlineLight">500+ languages</Badge>
      <Badge tone="solidBlue">New</Badge>
      <Badge tone="accentText">You're almost done!</Badge>
      <StatusBadge tone="success">Live</StatusBadge>
      <StatusBadge tone="info" size="md" dot>New</StatusBadge>
      <StatusBadge tone="error" solid>Failed</StatusBadge>
      <StatusBadge tone="warning" size="sm">Pending</StatusBadge>
      <StatusBadge tone="neutral">Draft</StatusBadge>
      <StatusBadge tone="gold">Partner</StatusBadge>
      <StatusBadge tone="success" live>On air</StatusBadge>
      <Tag active onRemove={() => {}}>HD Radio</Tag>
      <Tag disabled>Amharic</Tag>
      <a className="navlink" href="/inbox">Messages <Count hiddenLabel="unread">3</Count></a>
    </>
  );
}
