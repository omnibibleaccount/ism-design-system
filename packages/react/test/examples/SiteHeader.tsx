import { SiteHeader, type SiteHeaderNavItem } from '../../src/components/SiteHeader';
import { UiIcon } from '../../src/Icon';

const navigation: SiteHeaderNavItem[] = [
  {
    label: 'About ISM',
    href: '/about',
    overviewLabel: 'About ISM overview',
    overviewDescription: 'Who we are and why',
    current: true,
    children: [
      { label: 'Our Mission', href: '/mission', description: 'Why Scripture access matters' },
      { label: 'Statement of Faith', href: '/faith', description: 'What we believe' },
    ],
  },
  {
    label: 'Resources',
    href: '/resources',
    children: [
      { label: 'dot.Bible App', href: '/app', description: 'Free Bible apps in 500+ languages' },
      { label: 'HD Radio Broadcast', href: '/radio', description: 'Scripture on the airwaves' },
    ],
  },
  { label: 'Global Network', href: '/global-network' },
  { label: 'Join The Mission', href: '/join', children: [{ label: 'Partner With Us', href: '/partner' }] },
  { label: 'Contact', href: '/contact' },
];

export default function Example() {
  return (
    <>
      <SiteHeader
        navigation={navigation}
        skipLabel="Skip to content"
        give={
          <a className="btn btn-light btn-sm nv-give" href="/give">
            <UiIcon name="heart" size={16} />
            Give
          </a>
        }
        drawerActions={
          <>
            <a className="btn btn-primary btn-lg" href="/give">Give online</a>
            <a className="btn btn-outline-light btn-lg" href="/partner">Partner with us</a>
          </>
        }
      />
      <SiteHeader navigation={navigation} defaultDrawerOpen />
    </>
  );
}
