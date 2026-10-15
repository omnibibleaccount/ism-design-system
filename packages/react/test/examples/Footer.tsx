import { Footer } from '../../src/components/Footer';

export default function Example() {
  return (
    <Footer
      ctaText="Help deliver the Bible beyond every barrier."
      ctaLabel="Support Bible Access"
      ctaHref="/give"
      tagline="Delivering unhindered access to the Bible until everyone can engage with Scripture in their own language, without barriers."
      socials={[
        { name: 'Instagram', href: 'https://instagram.com/', icon: <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="6" /></svg> },
        { name: 'Facebook', href: 'https://facebook.com/', icon: <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 4v24" /></svg> },
      ]}
      columns={[
        { heading: 'About', links: [{ label: 'About ISM', href: '/about' }, { label: 'Our Mission', href: '/mission' }] },
        { heading: 'Platforms', links: [{ label: 'dot.Bible App', href: '/app' }, { label: 'Global Bible Network', href: '/gbn' }] },
        { heading: 'Get Involved', links: [{ label: 'Give Online', href: '/give' }, { label: 'Contact', href: '/contact' }] },
      ]}
      legal={['© 2026 – International Scripture Ministries Inc', 'ISM is a 501(c)(3) nonprofit organization. All donations are tax-deductible.']}
      legalLinks={[{ label: 'Cookie Policy', href: '/cookies' }, { label: 'Terms', href: '/terms' }, { label: 'Privacy', href: '/privacy' }]}
      cookieSettingsLabel="Cookie settings"
      onCookieSettings={() => {}}
    />
  );
}
