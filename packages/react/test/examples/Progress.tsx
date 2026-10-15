import { Progress, ProgressRing, ProgressSteps } from '../../src/components/Progress';

export default function Example() {
  return (
    <>
      <Progress label="Downloading Amharic audio Bible" value={68} hint="412 MB of 600 MB · about 2 minutes left" />
      <Progress value={30} aria-label="Uploading photo" />
      <Progress indeterminate aria-label="Loading stations" />
      <ProgressRing value={50} label="Reading plan · day 15 of 30" />
      <ProgressRing value={75} size="inline" label="Uploading photo" />
      <ProgressSteps current={1} total={2} label="Step 1 of 2" />
    </>
  );
}
