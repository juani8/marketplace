import api from './api_config';

export const getWalletBalance = async () => {
  try {
    const response = await api.get('/tenants/balance');
    return response.data; // { fiatBalance, cryptoBalance }
  } catch (error) {
    console.error('Error al obtener el balance:', error);
    throw new Error('No se pudo obtener el saldo de la billetera');
  }
};


/*
export const getWalletBalance = async (tenantEmail) => {
  // Simulá un delay y un balance falso
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        fiatBalance: 7530.50,
        cryptoBalance: 120.35,
        lastUpdated: new Date().toISOString(),
      });
    }, 800);
  });
};
*/