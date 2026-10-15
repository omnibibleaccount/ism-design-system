# DownloadState
Offline and download indicators for ISM apps: the 44px download button in its four states, a storage usage row, and offline / back-online banners.

## When to use
- Use the download button on any Bible, audio or language row that can be saved for offline use.
- Use the storage row at the top of Manage downloads.
- Show the offline banner under the AppBar while the phone has no connection; show Back online briefly when it returns.
- Use the inline warning when the reader opens something that is not downloaded while offline.

## Anatomy & markup
```html
<div class="ap-row ap-row-tall">
  <span class="ap-tt"><span class="ap-t">Amharic <span class="ap-eth">አማርኛ</span></span><span class="ap-s">312 MB · Bible + audio</span></span>
  <button class="ap-dl ap-dl-idle" type="button" aria-label="Download Amharic">…</button>
</div>

<div class="ap-banner" role="status">…<span><b>You’re offline</b> · Downloaded Bibles still work</span></div>
```

Progress ring:

```html
<button class="ap-dl" type="button" aria-label="Stop download, 62 percent">
  <svg width="44" height="44" viewBox="0 0 44 44"><circle class="ap-ring-track" cx="22" cy="22" r="19"/>
  <circle class="ap-ring-val" cx="22" cy="22" r="19" stroke-dasharray="74 120" transform="rotate(-90 22 22)"/>
  <rect class="ap-ring-stop" x="17" y="17" width="10" height="10" rx="2"/></svg>
</button>
```

## Variants & states
| State | Classes | Meaning |
|---|---|---|
| Not downloaded | `.ap-dl.ap-dl-idle` | hairline circle, blue ↓ |
| Downloading | `.ap-dl` + ring | 3px Horizon Blue ring on `--gray-200`, stop square |
| Downloaded | `.ap-dl.ap-dl-ok` | `--success` tick on `--success-bg` |
| Error | `.ap-dl.ap-dl-err` + `.ap-s-err` subtitle | `--error` retry on `--error-bg` |
| Small | `.ap-dl-sm` (36px, 44px hit area) | inside dense lists |
| Offline banner | `.ap-banner` | `--charcoal-900`, full width under the bar |
| Back online | `.ap-banner.ap-banner-online` | success tint, auto-hides after 3s |
| Not downloaded warning | `.alert.alert-warn.ap-warn` | inline, under the banner |

## Rules
- The button is always 44×44 and on the right of the row.
- Ring dasharray = progress × 119.4 (the circumference); update it at most every 250ms.
- Show size before download ("312 MB") and progress during ("193 of 312 MB").
- Storage bar: Bibles Horizon Blue, audio `--gradient-violet`, other `--gray-300`; always show the legend with numbers.
- While offline, keep downloaded rows normal and mark the rest disabled with "Needs a connection".
- Never block the screen for offline; the banner is enough.

## Accessibility
- Each button's name says the action and item: "Download Amharic", "Stop download, 62 percent", "Retry download".
- Banners use `role="status"` so the change is announced once.
- The storage bar has `role="img"` and an `aria-label` with all values.
- State never relies on colour alone: icon shape and subtitle change too.

## Content
- "You’re offline · Downloaded Bibles still work"
- "Back online"
- "Download failed · Tap to retry"
- "This Bible isn’t downloaded" / "Download Español · NBLA to read it without a connection."
- Mark example sizes as samples in specs.
