import { ListRow, List, ListGroup, ListItem } from '../../src/components/ListRow';
import { UiIcon } from '../../src/Icon';

export default function Example() {
  return (
    <>
      <ListRow icon={<UiIcon name="headphones" />} title="John 3:17-4:54" meta="9:12" progress={0.3} />
      <ListRow dark={false} icon={<UiIcon name="headphones" />} title="John 4" meta="7:40" playLabel="Play John 4" />
      <List>
        <ListItem href="/app/language" icon={<UiIcon name="language" />} title="Language" value="Amharic" end="drill" />
        <ListItem
          avatar={<span className="cr-av">MS</span>}
          title="Maria Santos"
          meta="Partner · Lima, Peru"
          value="2d ago"
        />
        <ListItem href="https://dot.bible" external iconGold icon={<UiIcon name="globe" />} title="dot.Bible directory" end="out" />
        <ListItem title="Plain row" meta="Meta wraps to two lines and then truncates with an ellipsis when it is long enough" twoLine />
        <ListItem title="Disabled" disabled />
      </List>
      <ListGroup title="Reading">
        <ListItem noIcon title="Daily verse" meta="7:00 each morning" checked onCheckedChange={() => {}} />
        <ListItem noIcon title="Offline audio" checked={false} onCheckedChange={() => {}} />
      </ListGroup>
    </>
  );
}
