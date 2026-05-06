import api from './api';

export const depositFee = async (data) => {
  const response = await api.post('/fees/deposit', data);
  return response.data;
};

export const withdrawFee = async (data) => {
  const response = await api.post('/fees/withdraw', data);
  return response.data;
};

export const getBalance = async () => {
  const response = await api.get('/fees/balance');
  return response.data;
};

export const getTransactionHistory = async (params = {}) => {
  const response = await api.get('/fees/history', { params });
  return response.data;
};
