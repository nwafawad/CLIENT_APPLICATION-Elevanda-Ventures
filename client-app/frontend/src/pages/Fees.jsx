import { useState } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import FeeCard from '../components/fees/FeeCard';
import DepositForm from '../components/fees/DepositForm';
import WithdrawForm from '../components/fees/WithdrawForm';
import TransactionRow from '../components/fees/TransactionRow';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { SkeletonCard, SkeletonTable } from '../components/ui/Skeleton';
import { useBalance, useTransactions, useDeposit, useWithdraw } from '../hooks/useFees';
import toast from 'react-hot-toast';

const tabs = ['Overview', 'Deposit', 'Withdraw', 'History'];

function TabButton({ active, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer
        ${active
          ? 'bg-primary-600 text-white shadow-sm'
          : 'text-gray-600 hover:bg-gray-100'
        }
      `}
    >
      {label}
    </button>
  );
}

function HistoryFilters({ filters, setFilters }) {
  return (
    <div className="flex flex-wrap gap-3 mb-4">
      <select
        value={filters.type || ''}
        onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value || undefined, page: 1 }))}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-200"
        id="filter-type"
      >
        <option value="">All Types</option>
        <option value="deposit">Deposits</option>
        <option value="withdraw">Withdrawals</option>
      </select>
      <select
        value={filters.status || ''}
        onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value || undefined, page: 1 }))}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-200"
        id="filter-status"
      >
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>
    </div>
  );
}

export default function Fees() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [historyFilters, setHistoryFilters] = useState({ page: 1, limit: 10 });

  const { data: balance, isLoading: balanceLoading } = useBalance();
  const { data: transactionData, isLoading: txLoading } = useTransactions(historyFilters);
  const depositMutation = useDeposit();
  const withdrawMutation = useWithdraw();

  const handleDeposit = async (data) => {
    try {
      await depositMutation.mutateAsync(data);
      toast.success('Fee deposited successfully');
      setActiveTab('History');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Deposit failed');
    }
  };

  const handleWithdraw = async (data) => {
    try {
      await withdrawMutation.mutateAsync(data);
      toast.success('Withdrawal submitted successfully');
      setActiveTab('History');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Withdrawal failed');
    }
  };

  return (
    <PageWrapper>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fee Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your school fee payments and history</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit">
          {tabs.map((tab) => (
            <TabButton
              key={tab}
              label={tab}
              active={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            />
          ))}
        </div>

        {/* Tab content */}
        <div className="animate-fade-in">
          {/* Overview */}
          {activeTab === 'Overview' && (
            <div className="space-y-4">
              {balanceLoading ? (
                <SkeletonCard />
              ) : (
                <FeeCard balance={balance?.balance} isLow={balance?.isLow} />
              )}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-5">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Deposits</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">
                    {transactionData?.transactions?.filter((t) => t.type === 'deposit').length || 0}
                  </p>
                </Card>
                <Card className="p-5">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Withdrawals</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">
                    {transactionData?.transactions?.filter((t) => t.type === 'withdraw').length || 0}
                  </p>
                </Card>
                <Card className="p-5">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Pending</p>
                  <p className="text-xl font-bold text-amber-600 mt-1">
                    {transactionData?.transactions?.filter((t) => t.status === 'pending').length || 0}
                  </p>
                </Card>
              </div>
            </div>
          )}

          {/* Deposit */}
          {activeTab === 'Deposit' && (
            <Card>
              <CardHeader>
                <h3 className="text-sm font-semibold text-gray-900">Make a Deposit</h3>
                <p className="text-xs text-gray-500 mt-0.5">Submit a deposit request for processing</p>
              </CardHeader>
              <CardBody>
                <div className="max-w-md">
                  <DepositForm onSubmit={handleDeposit} isLoading={depositMutation.isPending} />
                </div>
              </CardBody>
            </Card>
          )}

          {/* Withdraw */}
          {activeTab === 'Withdraw' && (
            <Card>
              <CardHeader>
                <h3 className="text-sm font-semibold text-gray-900">Request Withdrawal</h3>
                <p className="text-xs text-gray-500 mt-0.5">Submit a withdrawal request for processing</p>
              </CardHeader>
              <CardBody>
                <div className="max-w-md">
                  <WithdrawForm
                    onSubmit={handleWithdraw}
                    isLoading={withdrawMutation.isPending}
                    currentBalance={balance?.balance || 0}
                  />
                </div>
              </CardBody>
            </Card>
          )}

          {/* History */}
          {activeTab === 'History' && (
            <Card>
              <CardHeader>
                <h3 className="text-sm font-semibold text-gray-900">Transaction History</h3>
              </CardHeader>
              <CardBody className="p-0">
                <div className="px-6 pt-4">
                  <HistoryFilters filters={historyFilters} setFilters={setHistoryFilters} />
                </div>
                {txLoading ? (
                  <div className="px-6 pb-4">
                    <SkeletonTable rows={5} cols={5} />
                  </div>
                ) : transactionData?.transactions?.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <svg className="mx-auto w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-sm text-gray-500 mt-3">No transactions found</p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactionData.transactions.map((tx) => (
                            <TransactionRow key={tx.id} transaction={tx} />
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {/* Pagination */}
                    {transactionData.pagination && transactionData.pagination.pages > 1 && (
                      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                          Page {transactionData.pagination.page} of {transactionData.pagination.pages}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            disabled={transactionData.pagination.page <= 1}
                            onClick={() => setHistoryFilters((f) => ({ ...f, page: f.page - 1 }))}
                          >
                            Previous
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            disabled={transactionData.pagination.page >= transactionData.pagination.pages}
                            onClick={() => setHistoryFilters((f) => ({ ...f, page: f.page + 1 }))}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
