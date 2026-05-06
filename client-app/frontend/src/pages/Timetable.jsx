import PageWrapper from '../components/layout/PageWrapper';
import TimetableGrid from '../components/academics/TimetableGrid';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import { SkeletonTable } from '../components/ui/Skeleton';
import { useTimetable } from '../hooks/useAcademics';
import { useAuth } from '../hooks/useAuth';

export default function Timetable() {
  const { user } = useAuth();
  const { data, isLoading } = useTimetable();
  const isParent = user?.role === 'parent';

  return (
    <PageWrapper>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isParent ? `Timetable for ${data?.studentName || 'Student'}` : 'My Timetable'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">Weekly class schedule</p>
        </div>
        <Card>
          <CardHeader><h3 className="text-sm font-semibold text-gray-900">Weekly Schedule</h3></CardHeader>
          <CardBody>
            {isLoading ? <SkeletonTable rows={5} cols={5} /> : <TimetableGrid timetable={data?.timetable || {}} />}
          </CardBody>
        </Card>
      </div>
    </PageWrapper>
  );
}
