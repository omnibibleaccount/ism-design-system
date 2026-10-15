import { Table } from '../../src/components/Table';
import { StatusBadge } from '../../src/components/Badge';

interface Station { id: string; name: string; city: string; freq: string; status: string }
const rows: Station[] = [
  { id: 'ISM-ET-01', name: 'Radio Hope', city: 'Addis Ababa', freq: '98.7 FM', status: 'On air' },
  { id: 'ISM-PE-02', name: 'Radio Luz', city: 'Lima', freq: '101.3 FM', status: 'Maintenance' },
  { id: 'ISM-KE-03', name: 'Radio Neema', city: 'Nairobi', freq: '88.1 FM', status: 'Offline' },
];

export default function Example() {
  return (
    <Table<Station>
      aria-label="HD Radio stations (sample)"
      rows={rows}
      getRowId={(r) => r.id}
      getRowName={(r) => r.name}
      selectable
      defaultSelectedIds={['ISM-ET-01']}
      defaultSort={{ key: 'name', direction: 'ascending' }}
      zebra
      columns={[
        { key: 'name', header: 'Station', sortable: true, sortValue: (r) => r.name, cell: (r) => (<><span className="dp-strong">{r.name}</span><span className="dp-sub">{r.id}</span></>) },
        { key: 'city', header: 'City', sortable: true, sortValue: (r) => r.city, cell: (r) => r.city },
        { key: 'freq', header: 'Frequency', numeric: true, cell: (r) => r.freq },
        { key: 'status', header: 'Status', cell: (r) => <StatusBadge tone={r.status === 'On air' ? 'success' : r.status === 'Offline' ? 'error' : 'warning'} dot>{r.status}</StatusBadge> },
      ]}
      rowActions={() => [
        { key: 'edit', label: 'Edit details' },
        { key: 'listen', label: 'Listen live', external: true },
        { key: 'remove', label: 'Remove station', danger: true, separatorBefore: true },
      ]}
      footer={<span>1 of 3 stations selected</span>}
      mobileCard={(r) => ({ title: r.name, meta: r.city, badge: <StatusBadge tone="success">{r.status}</StatusBadge>, figure: r.freq })}
    />
  );
}
