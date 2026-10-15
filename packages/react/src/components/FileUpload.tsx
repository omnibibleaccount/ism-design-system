import { forwardRef, useEffect, useId, useRef, useState, type ChangeEvent, type DragEvent, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';
import { UiIcon } from '../Icon';

export type FileUploadStatus = 'uploading' | 'done' | 'error';

export interface FileUploadItem {
  /** Stable key. Rows keep the order they were added in. */
  id: string;
  /** File name shown in the row and used in button and progress names. */
  name: string;
  /** Row state: `uploading` (progress bar, cancel), `done` (green check, remove), `error` (tinted row, retry and remove). */
  status: FileUploadStatus;
  /** Progress 0 to 100 while `uploading`. */
  progress?: number;
  /** Meta line text, for example "1.8 MB of 2.8 MB · 64%", "Uploaded · 2.4 MB" or the error reason and what to do. */
  meta: ReactNode;
}

export interface FileUploadLabels {
  /** Name of the cancel button; receives the file name. @default (n) => `Cancel upload ${n}` */
  cancel?: (name: string) => string;
  /** Name of the remove button; receives the file name. @default (n) => `Remove ${n}` */
  remove?: (name: string) => string;
  /** Name of the progress bar; receives the file name. @default (n) => `Uploading ${n}` */
  progress?: (name: string) => string;
  /** Live announcement when a file finishes. @default (n) => `${n} uploaded` */
  done?: (name: string) => string;
  /** Live announcement when a file fails. @default (n) => `${n} failed` */
  failed?: (name: string) => string;
}

export interface FileUploadProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'children' | 'title'> {
  /** Text before the browse button, for example "Drag your station licence here, or". */
  prompt: ReactNode;
  /** Text of the browse button that opens the real file input, for example "browse". */
  browseLabel: string;
  /** Accepted types and the size limit, for example "PDF, JPG or PNG · up to 10 MB each". Linked to the browse button. */
  hint: ReactNode;
  /** Title while files are dragged over, for example (n) => "Drop to upload · 2 files". Receives the file count (0 when unknown). */
  dragOverLabel?: (count: number) => ReactNode;
  /** Called with the chosen or dropped files. The component does no uploading: update `items` yourself. */
  onFiles?: (files: File[]) => void;
  /** Rows shown under the drop zone, in the order given. */
  items?: FileUploadItem[];
  /** Cancel an uploading row. */
  onCancel?: (id: string) => void;
  /** Remove a done or failed row. */
  onRemove?: (id: string) => void;
  /** Retry a failed row. */
  onRetry?: (id: string) => void;
  /** Text of the Retry button, for example "Retry". Required for the retry action to show. */
  retryLabel?: string;
  /** Accessible name of the file list, for example "Uploaded files". */
  listLabel?: string;
  /** Overrides for accessible names and announcements (English defaults). */
  labels?: FileUploadLabels;
  /** `accept` attribute of the file input, for example ".pdf,.jpg,.jpeg,.png". */
  accept?: string;
  /** Allow choosing several files. @default false */
  multiple?: boolean;
  /** Disable browsing and dropping. @default false */
  disabled?: boolean;
  /** `id` of the file input. Generated when omitted. */
  inputId?: string;
  /** `name` of the file input for native form posts. */
  name?: string;
}

const defaults: Required<FileUploadLabels> = {
  cancel: (n) => `Cancel upload ${n}`,
  remove: (n) => `Remove ${n}`,
  progress: (n) => `Uploading ${n}`,
  done: (n) => `${n} uploaded`,
  failed: (n) => `${n} failed`,
};

/**
 * Dashed drop zone with a "browse" button over a real `<input type="file">`, plus file rows with progress,
 * success and error states. Supports drag and drop and keyboard (Tab to browse, Enter or Space). No network code:
 * report files through `onFiles` and drive the rows with `items`. The ref points to the file input.
 */
export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(function FileUpload(
  {
    prompt, browseLabel, hint, dragOverLabel, onFiles, items = [], onCancel, onRemove, onRetry, retryLabel, listLabel, labels,
    accept, multiple = false, disabled = false, inputId, name, className, ...rest
  },
  ref,
) {
  const auto = useId();
  const id = inputId ?? `${auto}-file`;
  const hintId = `${auto}-types`;
  const input = useRef<HTMLInputElement | null>(null);
  const depth = useRef(0);
  const [over, setOver] = useState<number | null>(null);
  const [announce, setAnnounce] = useState('');
  const seen = useRef<Map<string, FileUploadStatus>>(new Map());
  const l = { ...defaults, ...labels };

  // Announce each finished or failed file once, politely.
  useEffect(() => {
    const msgs: string[] = [];
    for (const it of items) {
      const prev = seen.current.get(it.id);
      if (prev !== it.status) {
        if (it.status === 'done' && prev) msgs.push(l.done(it.name));
        if (it.status === 'error') msgs.push(l.failed(it.name));
        seen.current.set(it.id, it.status);
      }
    }
    if (msgs.length) setAnnounce(msgs.join('. '));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const setRefs = (el: HTMLInputElement | null) => {
    input.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  };

  const take = (list: FileList | null | undefined) => {
    const files = list ? Array.from(list) : [];
    if (files.length) onFiles?.(multiple ? files : files.slice(0, 1));
  };
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    take(e.target.files);
    e.target.value = '';
  };
  const onEnter = (e: DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    depth.current += 1;
    setOver(e.dataTransfer?.items?.length ?? 0);
  };
  const onLeave = () => {
    depth.current = Math.max(0, depth.current - 1);
    if (depth.current === 0) setOver(null);
  };
  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    depth.current = 0;
    setOver(null);
    if (!disabled) take(e.dataTransfer?.files);
  };

  const isOver = over !== null;
  return (
    <>
      <div
        className={cx('fm-drop', isOver && 'fm-over', className)}
        onDragEnter={onEnter}
        onDragOver={(e) => { if (!disabled) e.preventDefault(); }}
        onDragLeave={onLeave}
        onDrop={onDrop}
        {...rest}
      >
        <span className="fm-drop-ic">
          <UiIcon name={isOver ? 'download' : 'upload'} size={24} />
        </span>
        <span className="fm-drop-t">
          {isOver && dragOverLabel ? (
            dragOverLabel(over)
          ) : (
            <>
              {prompt}{' '}
              <button className="fm-linkbtn" type="button" disabled={disabled} aria-describedby={hintId} onClick={() => input.current?.click()}>
                {browseLabel}
              </button>
            </>
          )}
        </span>
        <span className="hint" id={hintId}>{hint}</span>
        <input
          ref={setRefs}
          className="fm-vh"
          type="file"
          id={id}
          name={name}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          tabIndex={-1}
          aria-label={browseLabel}
          onChange={onChange}
        />
      </div>
      <div className="fm-vh" role="status" aria-live="polite">{announce}</div>
      {items.length ? (
        <ul className="fm-files" aria-label={listLabel}>
          {items.map((it) => (
            <li key={it.id} className={cx('fm-file', it.status === 'error' && 'fm-err')}>
              <span className={cx('fm-file-ic', it.status === 'done' && 'fm-ok', it.status === 'error' && 'fm-bad')}>
                <UiIcon name={it.status === 'done' ? 'check' : it.status === 'error' ? 'alert-circle' : 'file'} size={20} />
              </span>
              <span className="fm-file-body">
                <span className="fm-file-nm">{it.name}</span>
                <span className={cx('fm-file-meta', it.status === 'done' && 'fm-ok', it.status === 'error' && 'fm-bad')}>{it.meta}</span>
                {it.status === 'uploading' ? (
                  <span
                    className="fm-bar"
                    role="progressbar"
                    aria-valuenow={Math.round(it.progress ?? 0)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={l.progress(it.name)}
                  >
                    <span style={{ width: `${Math.min(100, Math.max(0, it.progress ?? 0))}%` }} />
                  </span>
                ) : null}
              </span>
              <span className="fm-file-actions">
                {it.status === 'error' && retryLabel ? (
                  <button className="btn btn-ghost btn-sm" type="button" onClick={() => onRetry?.(it.id)}>{retryLabel}</button>
                ) : null}
                {it.status === 'uploading' ? (
                  <button className="fm-ib" type="button" aria-label={l.cancel(it.name)} onClick={() => onCancel?.(it.id)}>
                    <UiIcon name="close" size={20} />
                  </button>
                ) : (
                  <button className="fm-ib" type="button" aria-label={l.remove(it.name)} onClick={() => onRemove?.(it.id)}>
                    <UiIcon name="trash" size={20} />
                  </button>
                )}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
});
