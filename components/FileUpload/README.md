# FileUpload
A dashed drop zone with a "browse" link over a real file input, followed by a list of file rows that show upload progress, success or a plain-language error.

## When to use
- Applications and orders that need a document or photo: Broadcast partner application (station licence, tower photo), publishing artwork, a church logo for NFC cards.
- One or more files up to a stated size and type.
- Do not use for a profile avatar crop or a camera capture inside the dot.Bible app; use the platform picker there.

## Anatomy & markup
```html
<div class="fm-drop" id="licence-drop">
  <span class="fm-drop-ic"><svg …upload arrow…/></span>
  <span class="fm-drop-t">Drag your station licence here, or
    <button class="fm-linkbtn" type="button" aria-describedby="licence-types">browse</button></span>
  <span class="hint" id="licence-types">PDF, JPG or PNG · up to 10 MB each</span>
  <input class="fm-vh" type="file" id="licence" accept=".pdf,.jpg,.jpeg,.png" multiple tabindex="-1">
</div>

<ul class="fm-files" aria-label="Uploaded files">
  <li class="fm-file">
    <span class="fm-file-ic"><svg …document…/></span>
    <span class="fm-file-body">
      <span class="fm-file-nm">fcc-station-licence-2026.pdf</span>
      <span class="fm-file-meta">1.8 MB of 2.8 MB · 64%</span>
      <span class="fm-bar" role="progressbar" aria-valuenow="64" aria-valuemin="0" aria-valuemax="100"
        aria-label="Uploading fcc-station-licence-2026.pdf"><span style="width:64%"></span></span>
    </span>
    <span class="fm-file-actions"><button class="fm-ib" type="button" aria-label="Cancel upload">…</button></span>
  </li>
</ul>
```
- `.fm-drop`: min 220px tall, 2px dashed `--gray-300` border, `--radius-lg`, white, centred content.
- `.fm-drop-ic`: 52px `--blue-tint` circle with a `--horizon-blue` arrow.
- `.fm-file`: white row, `--gray-200` border, `--radius-md`, 40px icon tile, name, meta and 44px icon buttons (`.fm-ib`).
- `.fm-bar`: 4px `--gray-200` track with a `--horizon-blue` fill.

## Variants & states
- Default: dashed border; hover darkens it to `--gray-600`.
- Drag-over (`.fm-over`): solid `--horizon-blue` border on `--blue-tint`; icon tile turns solid blue, the arrow points down and the title reads "Drop to upload" with the file count.
- Uploading: neutral icon tile, "1.8 MB of 2.8 MB · 64%" and the progress bar; action is cancel (×).
- Done: `.fm-file-ic.fm-ok` green check tile, `.fm-file-meta.fm-ok` "Uploaded · 2.4 MB"; action is remove (bin).
- Error: `.fm-file.fm-err` tinted row with `--error-line` border, `.fm-file-ic.fm-bad` and `.fm-file-meta.fm-bad`; actions are Retry (`.btn-ghost .btn-sm`) and remove.

## Rules
- Always keep a real `<input type="file">` behind the "browse" button; the drop zone is an extra, never the only way.
- State accepted types and the size limit in the `.hint` line under the title.
- Add rows under the drop zone in the order files were added; never reorder them.
- Errors say what went wrong and what to do ("14.2 MB is over the 10 MB limit. Try a smaller file.").
- Use status colours only for done (`--success`) and error (`--error`); progress is `--horizon-blue`.
- Icon buttons are 44px round targets; never shrink them to the icon size.
- On phones, hide "Drag your … here" and show a single "Choose file" `.btn-secondary`.

## Accessibility
- The "browse" button opens the file input; the drop zone itself is not a tab stop.
- Progress bars have `role="progressbar"`, `aria-valuenow` and a name that includes the file name.
- Announce each finished or failed file in a polite live region ("tower-site-photo.jpg uploaded").
- Icon buttons are named with the file: "Remove tower-site-photo.jpg", "Cancel upload".
- Do not rely on colour alone: the error row also has the alert icon and the reason text.

## Content
- Title: "Drag your station licence here, or browse". Hint: "PDF, JPG or PNG · up to 10 MB each".
- Drag-over: "Drop to upload" / "2 files".
- Meta: "1.8 MB of 2.8 MB · 64%", "Uploaded · 2.4 MB".
- Error: "14.2 MB is over the 10 MB limit. Try a smaller file."
- File names in the examples are samples.
