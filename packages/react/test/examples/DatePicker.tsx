import { DatePicker } from '../../src/components/DatePicker';

const today = new Date(2026, 9, 14);

export default function Example() {
  return (
    <>
      <DatePicker label="Preferred call date" today={today} min={today} hint="Type a date or pick one from the calendar." />
      <DatePicker
        label="Preferred call date"
        today={today}
        min={today}
        defaultValue={new Date(2026, 9, 18)}
        defaultOpen
      />
      <DatePicker label="Preferred call date" today={today} locale="de-DE" placeholder="TT.MM.JJJJ" error="Choose today or a later date." />
      <DatePicker label="Preferred call date" today={today} disabled />
    </>
  );
}
