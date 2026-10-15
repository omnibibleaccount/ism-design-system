import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Avatar, type AvatarProps } from './Avatar';
import { cx } from '../utils';

export interface PullQuoteProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** The quote text, under about 35 words. Trim with an ellipsis rather than shrinking the type. */
  children: ReactNode;
  /** Person's name, shown bold in the caption. */
  author: ReactNode;
  /** Role and place after the name ("Radio Hope listener, Addis Ababa"). */
  byline?: ReactNode;
  /** Language of the quote when it is not the page language (`lang="am"`). */
  quoteLang?: string;
}

/** Large Lora pull quote with gold quote mark and a thread rule. One per screen. */
export const PullQuote = forwardRef<HTMLElement, PullQuoteProps>(function PullQuote(
  { children, author, byline, quoteLang, className, ...rest },
  ref,
) {
  return (
    <figure ref={ref} className={cx('dp-pullfig', className)} {...rest}>
      <span className="dp-qmark" aria-hidden="true">“</span>
      <blockquote className="dp-pull" lang={quoteLang}>{children}</blockquote>
      <div className="thread dp-pull-thread" aria-hidden="true" />
      <figcaption className="dp-cite">
        <strong>{author}</strong>
        {byline ? <> · {byline}</> : null}
      </figcaption>
    </figure>
  );
});

export interface TestimonialProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** The quote. Include the quotation marks you want shown. */
  children: ReactNode;
  /** Person's name. */
  name: string;
  /** Role and place ("Partner pastor · Lima, Peru"). */
  byline?: ReactNode;
  /** Photo URL for the 56px avatar. Initials show when omitted. */
  avatarSrc?: string;
  /** Extra avatar props. The avatar is always decorative because the name is visible. */
  avatarProps?: Omit<AvatarProps, 'src' | 'name' | 'size' | 'decorative'>;
  /** Language of the quote when it is not the page language. */
  quoteLang?: string;
}

/** Testimonial card: quote above a 56px avatar, name and role. Use only real, consented quotes. */
export const Testimonial = forwardRef<HTMLElement, TestimonialProps>(function Testimonial(
  { children, name, byline, avatarSrc, avatarProps, quoteLang, className, ...rest },
  ref,
) {
  return (
    <figure ref={ref} className={cx('card', 'dp-testi', className)} {...rest}>
      <blockquote className="dp-testi-q" lang={quoteLang}>{children}</blockquote>
      <figcaption className="dp-testi-by">
        <Avatar src={avatarSrc} name={name} size={56} decorative {...avatarProps} />
        <span className="dp-testi-who">
          <span className="dp-testi-name">{name}</span>
          {byline ? <span className="dp-testi-role">{byline}</span> : null}
        </span>
      </figcaption>
    </figure>
  );
});

export interface ScriptureVerse {
  /** Verse number, rendered as a superscript. */
  number: number | string;
  /** Verse text. */
  text: ReactNode;
}

export interface ScriptureQuoteProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Verses with their numbers. Alternatively pass `children` for unnumbered text. */
  verses?: ScriptureVerse[];
  /** Plain scripture text when there are no verse numbers. Used when `verses` is empty. */
  children?: ReactNode;
  /** Full reference: book, chapter:verse ("John 3:16"). */
  reference: ReactNode;
  /** Translation abbreviation ("BSB"). Shown after the reference. */
  translation?: string;
  /** On a dark surface. @default false */
  dark?: boolean;
  /** Language of the scripture text when it is not the page language. */
  quoteLang?: string;
}

/** Scripture quote in Lora with a gold rule, superscript verse numbers and a full reference. Never italic. */
export const ScriptureQuote = forwardRef<HTMLElement, ScriptureQuoteProps>(function ScriptureQuote(
  { verses, children, reference, translation, dark = false, quoteLang, className, ...rest },
  ref,
) {
  return (
    <figure ref={ref} className={cx('dp-scripfig', dark && 'dp-scripfig-dark', className)} {...rest}>
      <span className="dp-scrip-rule" aria-hidden="true" />
      <div className="dp-scrip-body">
        <blockquote className="dp-scrip" lang={quoteLang}>
          {verses && verses.length
            ? verses.map((v, i) => (
                <span key={`${v.number}-${i}`}>
                  {i > 0 ? ' ' : null}
                  <sup className="dp-sv">{v.number}</sup>
                  {v.text}
                </span>
              ))
            : children}
        </blockquote>
        <figcaption className="dp-scrip-ref">
          {reference}
          {translation ? <span> · {translation}</span> : null}
        </figcaption>
      </div>
    </figure>
  );
});
