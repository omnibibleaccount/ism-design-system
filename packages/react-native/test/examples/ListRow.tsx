import { useState } from 'react';
import { View } from 'react-native';
import { ListRow, ListItem, List, ListGroup } from '../../src/components/ListRow';
import { Avatar } from '../../src/components/Avatar';
import { UiIcon } from '../../src/Icon';

export default function Example() {
  const [on, setOn] = useState(true);
  return (
    <>
      <View style={{ backgroundColor: '#000000' }}>
        <ListRow dark icon={<UiIcon name="headphones" color="#ffffff" />} title="John 3:17-4:54" meta="9:12" progress={0.3} />
        <ListRow dark title="Psalm 23" meta="2:40" progress={1} />
      </View>
      <ListRow dark={false} icon={<UiIcon name="headphones" />} title="Romans 8" meta="14:03" progress={0.6} />
      <List>
        <ListItem icon="language" title="Language" value="Amharic" end="drill" onPress={() => undefined} />
        <ListItem leading={<Avatar name="Maria Santos" />} title="Maria Santos" meta="Partner · Lima, Peru" value="2d ago" />
        <ListItem icon="globe" title="dot.Bible directory" end="out" href="https://dot.bible" newTabLabel="(opens in a new tab)" />
        <ListItem icon="download" title="Downloaded Bibles" disabled end="drill" onPress={() => undefined} />
      </List>
      <ListGroup title="Reading">
        <ListItem icon="text-size" title="Text size" value="Medium" end="drill" onPress={() => undefined} />
        <ListItem icon="bookmark" iconGold title="Daily verse" meta="7:00 each morning" checked={on} onCheckedChange={setOn} />
        <ListItem noIcon twoLine title="Offline audio" meta="Download chapters over Wi-Fi so they play without a connection or mobile data." />
      </ListGroup>
    </>
  );
}
