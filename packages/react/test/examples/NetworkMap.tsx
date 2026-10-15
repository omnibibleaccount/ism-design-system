import { NetworkMap, type NetworkRegion, type NetworkStation } from '../../src/components/NetworkMap';

// Abbreviated sample dot paths (abstract; not for real geography).
const OFF = "M236 20h0M244 20h0M252 20h0M260 20h0M268 20h0M276 20h0M284 20h0M292 20h0M300 20h0M308 20h0M220 28h0M228 28h0M236 28h0M244 28h0M252 28h0M260 28h0M268 28h0M276 28h0M284 28h0M292 28h0M300 28h0M308 28h0M228 36h0M236 36h0M244 36h0M252 36h0M260 36h0M268 36h0M276 36h0M284 36h0M292 36h0M300 36h0M308 36h0M316 36h0M52 44h0M60 44h0M68 44h0M76 44h0M84 44h0M92 44h0M100 44h0M108 44h0M116 44h0M124 44h0M132 44h0M140 44h0M148 44h0M156 44h0M164 44h0M172 44h0M180 44h0M244 44h0M252 44h0M260 44h0M268 44h0M276 44h0M284 44h0M292 44h0M300 44h0M388 44h0";
const AFRICA = "M356 108h0M364 108h0M372 108h0M380 108h0M348 116h0M356 116h0M364 116h0M372 116h0M380 116h0M388 116h0M396 116h0M340 124h0M348 124h0M356 124h0M364 124h0M372 124h0M380 124h0M388 124h0M396 124h0M404 124h0M412 124h0M420 124h0M428 124h0M332 132h0M340 132h0M348 132h0M356 132h0M364 132h0M372 132h0M380 132h0M388 132h0M396 132h0M404 132h0M412 132h0M420 132h0M428 132h0M332 140h0M340 140h0M348 140h0M356 140h0";
const ASIA = "M564 28h0M572 28h0M580 28h0M588 28h0M500 36h0M508 36h0M516 36h0M524 36h0M532 36h0M540 36h0M548 36h0M556 36h0M564 36h0M572 36h0M580 36h0M588 36h0M596 36h0M604 36h0M612 36h0M620 36h0M628 36h0M636 36h0M460 44h0M468 44h0M476 44h0M484 44h0M492 44h0M500 44h0M508 44h0M516 44h0M524 44h0M532 44h0M540 44h0M548 44h0M556 44h0M564 44h0M572 44h0M580 44h0M588 44h0M596 44h0";

const regions: NetworkRegion[] = [
  { id: 'africa', name: 'Africa', partners: 142, dots: AFRICA },
  { id: 'asia', name: 'Asia', partners: 118, dots: ASIA },
  { id: 'latam', name: 'Latin America', partners: 86 },
  { id: 'me', name: 'Middle East', partners: 37 },
  { id: 'oceania', name: 'Oceania', partners: 0, status: 'soon', soonLabel: 'coming soon' },
];

const stations: NetworkStation[] = [
  { id: 'nbo', name: 'Nairobi', partners: 14, x: 434, y: 182, regionId: 'africa' },
  { id: 'lag', name: 'Lagos', partners: 9, x: 366, y: 168, regionId: 'africa' },
  { id: 'mnl', name: 'Manila', partners: 6, x: 602, y: 151, regionId: 'asia' },
];

export default function Example() {
  return (
    <NetworkMap
      title="Global Bible Network"
      mapLabel="Abstract world map with Africa selected and partner hubs in Africa and Asia"
      regions={regions}
      stations={stations}
      offDots={OFF}
      note="Choose a region or a pin to see its stations, partners and languages."
      summary={<><b>383</b> partners in 61 countries</>}
      joinLabel="Join"
      joinHref="/partners"
    />
  );
}
