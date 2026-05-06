import { Link } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import { useAuth } from '../hooks/useAuth';
import { useBalance, useTransactions } from '../hooks/useFees';
import FeeCard from '../components/fees/FeeCard';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { SkeletonCard } from '../components/ui/Skeleton';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDateTime } from '../utils/formatDate';

const statusColors = { pending: 'yellow', approved: 'green', rejected: 'red' };

function QuickLinkCard({ to, icon, label, description, color }) {
  return (
    <Link to={to}>
      <Card hover className="p-5 group">
        <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
          {icon}
        </div>
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </Card>
    </Link>
  );
}

function RecentTransactions({ transactions, isLoading }) {
  if (isLoading) {
    return <SkeletonCard className="h-48" />;
  }

  const items = transactions?.transactions?.slice(0, 5) || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Recent Transactions</h3>
          <Link to="/fees" className="text-xs text-primary-600 hover:text-primary-700 font-medium">
            View all →
          </Link>
        </div>
      </CardHeader>
      <CardBody className="p-0">
        {items.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="text-sm text-gray-400">No transactions yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {items.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === 'deposit' ? 'bg-emerald-100' : 'bg-orange-100'}`}>
                    <span className={`text-sm font-bold ${tx.type === 'deposit' ? 'text-emerald-600' : 'text-orange-600'}`}>
                      {tx.type === 'deposit' ? '↑' : '↓'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(tx.amount)}</p>
                    <p className="text-xs text-gray-500">{formatDateTime(tx.createdAt)}</p>
                  </div>
                </div>
                <Badge color={statusColors[tx.status]}>{tx.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { data: balance, isLoading: balanceLoading } = useBalance();
  const { data: transactionData, isLoading: txLoading } = useTransactions({ limit: 5 });

  return (
    <PageWrapper>
      <div className="space-y-6 animate-fade-in">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Here&apos;s your school dashboard overview
          </p>
        </div>

        {/* Low balance alert */}
        {balance?.isLow && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 flex items-start gap-3 animate-fade-in">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-red-800">Low Balance Alert</p>
              <p className="text-xs text-red-600 mt-0.5">
                Your fee balance is below RWF 5,000. Please deposit funds to avoid disruptions.
              </p>
            </div>
          </div>
        )}

        {/* Balance card */}
        {balanceLoading ? (
          <SkeletonCard />
        ) : (
          <FeeCard balance={balance?.balance} isLow={balance?.isLow} />
        )}

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <QuickLinkCard
            to="/fees"
            label="Pay Fees"
            description="Manage deposits & withdrawals"
            color="bg-primary-100"
            icon={<svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 1v8m0 0v1" /></svg>}
          />
          <QuickLinkCard
            to="/grades"
            label="View Grades"
            description="Check academic performance"
            color="bg-emerald-100"
            icon={<svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
          />
          <QuickLinkCard
            to="/attendance"
            label="Attendance"
            description="Track attendance records"
            color="bg-amber-100"
            icon={<svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          />
        </div>

        {/* Recent transactions */}
        <RecentTransactions transactions={transactionData} isLoading={txLoading} />
      </div>
    </PageWrapper>
  );
}
