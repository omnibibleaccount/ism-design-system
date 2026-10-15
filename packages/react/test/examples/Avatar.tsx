import { Avatar, AvatarStack } from '../../src/components/Avatar';

export default function Example() {
  return (
    <>
      <Avatar size={56} src="/maria.jpg" name="Maria Santos" />
      <Avatar size={40} name="Maria Santos" decorative />
      <Avatar size={40} name="Dawit Alemu" color="violet" />
      <Avatar size={56} />
      <Avatar size={56} name="Dawit Alemu" color="blue" presence="away" presenceLabel="away" />
      <Avatar size={32} name="Joy Kamau" color="gold" presence="online" presenceLabel="online" />
      <Avatar size={24} initials="MS" color="ink" presence="offline" presenceLabel="offline" />
      <Avatar size={80} name="Musa Bello" color="peach" />
      <AvatarStack aria-label="Maria, Dawit, Musa, Joy and 5 more partners" more={5}>
        <Avatar size={40} src="/a.jpg" decorative />
        <Avatar size={40} name="Joy Kamau" color="gold" decorative />
      </AvatarStack>
    </>
  );
}
