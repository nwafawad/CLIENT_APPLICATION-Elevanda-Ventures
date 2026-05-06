import { useState } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import GradeTable from '../components/academics/GradeTable';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import { SkeletonTable } from '../components/ui/Skeleton';
import { useGrades } from '../hooks/useAcademics';
import { useAuth } from '../hooks/useAuth';

export default function Grades() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({ term: '', subject: '' });
  const activeFilters = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v)
  );
  const { data, isLoading } = useGrades(activeFilters);
  const isParent = user?.role === 'parent';

  return (
    <PageWrapper>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isParent ? `Grades for ${data?.studentName || 'Student'}` : 'My Grades'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">View academic performance</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <input type="text" placeholder="Filter by term" value={filters.term}
            onChange={(e) => setFilters((f) => ({ ...f, term: e.target.value }))}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-200" id="filter-term" />
          <input type="text" placeholder="Filter by subject" value={filters.subject}
            onChange={(e) => setFilters((f) => ({ ...f, subject: e.target.value }))}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-200" id="filter-subject" />
        </div>
        <Card>
          <CardHeader><h3 className="text-sm font-semibold text-gray-900">Grade Report</h3></CardHeader>
          <CardBody className="p-0">
            {isLoading ? <div className="p-6"><SkeletonTable rows={5} cols={4} /></div> : <GradeTable grades={data?.grades || []} />}
          </CardBody>
        </Card>
      </div>
    </PageWrapper>
  );
}
