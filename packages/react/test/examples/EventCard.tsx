import { EventCard, NewsCard } from '../../src/components/EventCard';

export default function Example() {
  return (
    <>
      <EventCard
        month="NOV"
        day="12"
        badge="Online event"
        title="Global prayer night for Bible translation"
        dateTime="2026-11-12T19:00-05:00"
        dateText="Thursday, Nov 12 · 7:00 pm ET · 90 min"
        place="Online · link sent after you register"
        description="Pray with partners from 40 countries for the languages still waiting for Scripture."
        actionLabel="Register"
        href="/events/prayer-night"
        footNote="212 going (sample)"
      />
      <EventCard
        month="DEC"
        day="3"
        badge="In person"
        badgeTone="brand"
        title="Launch of the Amharic audio Bible"
        dateTime="2026-12-03T10:00+03:00"
        dateText="Thursday, Dec 3 · 10:00 am EAT · 2 hr"
        place="Addis Ababa, Ethiopia"
        actionLabel="Register"
        href="/events/launch"
      />
      <NewsCard
        imageSrc="/ism/assets/imagery/print-photo-listener.jpg"
        imageAlt="A woman listening to Scripture on her phone"
        badge="Field story"
        dateTime="2026-10-02"
        dateText="Oct 2, 2026"
        title="An audio Bible in Amharic reaches 40 radio stations"
        description="Listeners across Ethiopia now hear Scripture read aloud each morning in their heart language."
        href="/news/amharic-audio"
        linkLabel="Read the story"
      />
    </>
  );
}
