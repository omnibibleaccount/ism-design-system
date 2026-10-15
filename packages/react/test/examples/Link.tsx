import { Link } from '../../src/components/Link';

export default function Example() {
  return (
    <>
      <p>Read our <Link href="/privacy">privacy policy</Link> for details.</p>
      <Link variant="reveal" href="/prayer" arrow>Get prayer updates</Link>
      <Link variant="ghost" href="https://dot.bible" external arrow>Browse the directory</Link>
      <Link variant="ink" href="/faith">Statement of faith</Link>
      <div className="sec-ink"><Link variant="onDark" href="/cookies">cookie policy</Link></div>
    </>
  );
}
