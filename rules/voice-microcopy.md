# Voice and microcopy

ISM's voice is plain, warm, reverent, direct and global. Write for readers who may be translating on a phone in a second language.

## General

1. Sentence case for headings, buttons, labels and menu items. Proper nouns keep their capitals.
2. No exclamation marks. No emoji. No typed all-caps (the eyebrow style is applied by CSS).
3. Short sentences. No idioms, wordplay or culture-specific metaphors; they do not translate.
4. Speak as "we" to "you". Prefer active voice.
5. Numerals for counts ("12 languages"). Spell out "one" in running prose.
6. Organisation names: International Scripture Ministries on first mention, then ISM. The app is dot.Bible (capital B). Domain: ism.bible.

## Buttons and links

Verb first, one to three words, says what happens next.

| Do | Don't |
|---|---|
| Read now · Listen · Download the app · Give today · Find a station · Send message · Save changes · Try again | Click here · Submit · OK · Learn more! · Yes · Go |

- Confirmation dialogs name the action on both buttons: "Delete note" and "Keep note", not "Yes" and "No".
- Dismiss is "Not now" when the user can come back, "Cancel" when they are abandoning input.
- The arrow → appears only on the primary continue button of a flow.
- Loading label changes only when meaning changes ("Saving…" is acceptable; keep it the same width).

## Errors

Calm, specific, no blame, no jokes. Say what is wrong and what to do: **[What is wrong]. [What to do.]**

| Don't | Do |
|---|---|
| Invalid input! | Enter an email address like name@example.com. |
| Oops, something went wrong. | We couldn't save your changes. Check your connection and try again. |
| Error 404 | We can't find that page. Go to the home page or search for what you need. |

- Never use red alone; include the word "Error" or an icon.
- Keep what the user typed.
- Do not apologise more than once, and do not use "please" more than once per view.

## Empty states

Say what will appear here and how to start, with one action: "No downloads yet. Download a Bible to read it offline." + "Browse Bibles".

## Referring to Scripture

1. **References**: Book chapter:verse, with a non-breaking space after the book: John 3:16. Ranges use an en dash: 1 Corinthians 13:4–7. Use the book names of the reader's language and tradition, not English abbreviations.
2. **Quotations**: Scripture text is set in Lora, is never edited or shortened without a visible ellipsis, and is always followed by its reference and the translation abbreviation or name.
3. **Names**: Use "Scripture", "the Bible" or "God's Word" in line with how the translation refers to itself. Capitalisation of God, Lord and pronouns follows the translation's convention; do not decide it in UI code.
4. **Verse numbers**: small, `--gray-600`, excluded from copy by default.
5. **Attribution**: show the translation and the copyright line wherever the licence requires.
6. **Never**: paraphrase Scripture in UI copy and present it as a quotation; use a verse as decoration without its reference; alter verse text to fit a layout (shorten the passage instead).
7. **Tone near Scripture**: no jokes, no marketing language, no urgency tactics next to the text.

## Translation

Strings are written in English for translators: one idea per string, no concatenation, full sentences with placeholders ("{count} languages"), plural forms supplied per language, no text inside images, and room for 40% growth.
