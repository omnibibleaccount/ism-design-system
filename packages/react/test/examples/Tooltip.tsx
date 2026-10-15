import { Tooltip, Popover } from '../../src/components/Tooltip';
import { UiIcon } from '../../src/Icon';

export default function Example() {
  return (
    <>
      <Tooltip label="Copy link">
        <button className="fb-ib" type="button" aria-label="Copy link"><UiIcon name="copy" /></button>
      </Tooltip>
      <Tooltip label="Share verse" side="bottom">
        <button className="fb-ib" type="button" aria-label="Share verse"><UiIcon name="share" /></button>
      </Tooltip>
      <Tooltip label="Listen" side="right">
        <button className="fb-ib" type="button" aria-label="Listen"><UiIcon name="headphones" /></button>
      </Tooltip>
      <Popover label="About offline reading" title="Read without a connection" defaultOpen linkHref="/dot-bible-app#offline" linkLabel="How offline reading works ↗">
        Download a Bible once and it stays on your phone.
      </Popover>
    </>
  );
}
