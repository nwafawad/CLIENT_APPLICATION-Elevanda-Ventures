import { useState } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import AttendanceTable from '../components/academics/AttendanceTable';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import { SkeletonTable } from '../components/ui/Skeleton';
import { useAttendance } from '../hooks/useAcademics';
import { useAuth } from '../hooks/useAuth';

function SummaryBar({ summary }) {
  if (!summary) return null;
  const items = [
    { label: 'Total', value: summary.total, color: 'bg-gray-100 text-gray-800' },
    { label: 'Present', value: summary.present, color: 'bg-emerald-100 text-emerald-800' },
    { label: 'Absent', value: summary.absent, color: 'bg-red-100 text-red-800' },
    { label: 'Late', value: summary.late, color: 'bg-amber-100 text-amber-800' },
    { label: 'Rate', value: `${summary.attendanceRate}%`, color: 'bg-blue-100 text-blue-800' },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
      {items.map((item) => (
        <div key={item.label} className={`${item.color} rounded-lg px-4 py-3 text-center`}>
          <p className="text-xs font-medium opacity-70">{item.label}</p>
          <p className="text-lg font-bold mt-0.5">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

export default function Attendance() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({ startDate: '', endDate: '', status: '' });
  const activeFilters = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
  const { data, isLoading } = useAttendance(activeFilters);
  const isParent = user?.role === 'parent';

  return (
    <PageWrapper>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isParent ? `Attendance for ${data?.studentName || 'Student'}` : 'My Attendance'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">Track attendance records</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <input type="date" value={filters.startDate}
            onChange={(e) => setFilters((f) => ({ ...f, startDate: e.target.value }))}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-200" id="filter-start-date" />
          <input type="date" value={filters.endDate}
            onChange={(e) => setFilters((f) => ({ ...f, endDate: e.target.value }))}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-200" id="filter-end-date" />
          <select value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-200" id="filter-status">
            <option value="">All Statuses</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
          </select>
        </div>
        <SummaryBar summary={data?.summary} />
        <Card>
          <CardHeader><h3 className="text-sm font-semibold text-gray-900">Attendance Records</h3></CardHeader>
          <CardBody className="p-0">
            {isLoading ? <div className="p-6"><SkeletonTable rows={5} cols={2} /></div> : <AttendanceTable records={data?.records || []} />}
          </CardBody>
        </Card>
      </div>
    </PageWrapper>
  );
}
