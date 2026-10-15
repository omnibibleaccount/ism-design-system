import { FileUpload } from '../../src/components/FileUpload';

export default function Example() {
  return (
    <FileUpload
      prompt="Drag your station licence here, or"
      browseLabel="browse"
      hint="PDF, JPG or PNG · up to 10 MB each"
      accept=".pdf,.jpg,.jpeg,.png"
      multiple
      retryLabel="Retry"
      listLabel="Uploaded files"
      dragOverLabel={(n) => `Drop to upload · ${n} files`}
      items={[
        { id: '1', name: 'fcc-station-licence-2026.pdf', status: 'uploading', progress: 64, meta: '1.8 MB of 2.8 MB · 64%' },
        { id: '2', name: 'tower-site-photo.jpg', status: 'done', meta: 'Uploaded · 2.4 MB' },
        { id: '3', name: 'studio.png', status: 'error', meta: '14.2 MB is over the 10 MB limit. Try a smaller file.' },
      ]}
    />
  );
}
