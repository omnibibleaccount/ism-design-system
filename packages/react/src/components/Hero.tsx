import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';

export type HeroLanguageTone = 'blue' | 'gold' | 'violet';

const TONE_CLASS: Record<HeroLanguageTone, string> = { blue: '', gold: 'dp-lang-gold', violet: 'dp-lang-violet' };

export interface HeroLanguage {
  /** Link target for this language. */
  href: string;
  /** Language name written in its own script, for example "Español". */
  label: string;
  /** BCP 47 code set on the link so screen readers pronounce the name correctly, for example "es". */
  lang: string;
  /** Reading direction of the name; set "rtl" for Arabic-script and Hebrew names. */
  dir?: 'ltr' | 'rtl';
  /** Colour of the dot. @default "blue" */
  tone?: HeroLanguageTone;
}

export interface HeroProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Eyebrow line above the headline: the organisation or programme name. */
  eyebrow?: ReactNode;
  /** Headline (the page's single h1). Wrap at most one word in `<span className="em">`. */
  title: ReactNode;
  /** One-sentence lead under the headline. */
  lead?: ReactNode;
  /** Action buttons: one `Button` primary (size lg) and one `outlineDark` (size lg). */
  actions?: ReactNode;
  /** Language chips shown under the actions. */
  languages?: HeroLanguage[];
  /** Accessible name of the language chip group. @default "Read in another language" */
  languagesLabel?: string;
  /** Decorative background photo. Add the dark overlay in CSS; do not lighten it. @default "/ism/assets/imagery/deck-bg-gradient-dark.jpg" */
  backgroundSrc?: string;
  /** Rounded corners for a hero placed inside the page frame instead of full bleed. @default false */
  inset?: boolean;
  /** Id of the h1; generated when omitted. */
  headingId?: string;
}

/**
 * Dark, centred home-page hero. Use once per page: it owns the page's only `<h1>`.
 */
export const Hero = forwardRef<HTMLElement, HeroProps>(function Hero(
  {
    eyebrow,
    title,
    lead,
    actions,
    languages,
    languagesLabel = 'Read in another language',
    backgroundSrc = '/ism/assets/imagery/deck-bg-gradient-dark.jpg',
    inset = false,
    headingId,
    className,
    children,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const hid = headingId ?? `hero-h-${autoId}`;
  return (
    <section ref={ref} className={cx('dp-hero', 'on-dark', inset && 'dp-hero-inset', className)} aria-labelledby={hid} {...rest}>
      <img className="dp-hero-bg" src={backgroundSrc} alt="" />
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h1 className="h1 dp-hero-title" id={hid}>{title}</h1>
      {lead ? <p className="lead dp-hero-lead">{lead}</p> : null}
      {actions ? <div className="dp-hero-actions">{actions}</div> : null}
      {languages && languages.length > 0 ? (
        <div className="dp-langs" aria-label={languagesLabel}>
          {languages.map((l) => (
            <a key={l.href + l.lang} className="dp-lang" href={l.href} lang={l.lang} dir={l.dir}>
              <span className={cx('dp-lang-dot', TONE_CLASS[l.tone ?? 'blue'])} />
              {l.label}
            </a>
          ))}
        </div>
      ) : null}
      {children}
    </section>
  );
});
