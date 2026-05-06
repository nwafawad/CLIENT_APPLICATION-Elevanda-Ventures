import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBalance, getTransactionHistory, depositFee, withdrawFee } from '../services/feeService';

export const useBalance = () => {
  return useQuery({
    queryKey: ['balance'],
    queryFn: getBalance,
    select: (data) => data.data?.balance,
  });
};

export const useTransactions = (params = {}) => {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => getTransactionHistory(params),
    select: (data) => data.data,
  });
};

export const useDeposit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: depositFee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};

export const useWithdraw = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: withdrawFee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};
