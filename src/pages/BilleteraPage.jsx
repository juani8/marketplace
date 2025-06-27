import React, { useEffect, useState } from 'react';
import { getWalletBalance } from '@/apis/walletService';
import { useAuth } from '@/contexts/AuthContext';
import SpinnerBilletera from '@/components/SpinnerBilletera'; // Asegurate de tenerlo

export default function BilleteraPage() {
  const { rol } = useAuth();
  const [fiatBalance, setFiatBalance] = useState(null);
  const [cryptoBalance, setCryptoBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (rol !== 'admin') return;

    getWalletBalance()
      .then((data) => {
        setFiatBalance(data.fiatBalance);
        setCryptoBalance(data.cryptoBalance);
      })
      .catch(() => {
        setError('No se pudo cargar el balance. Intenta nuevamente.');
      })
      .finally(() => setLoading(false));
  }, [rol]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Mi Billetera</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <section className="mb-8 bg-white shadow-md rounded-xl p-6 border-l-4 border-green-600">
        <h2 className="text-xl font-semibold mb-4">Saldo en Pesos</h2>
        <div className="text-3xl font-bold text-green-600">
          {loading
            ? <SpinnerBilletera />
            : fiatBalance != null
              ? `$ ${fiatBalance.toFixed(2)}`
              : '$-'}
        </div>
      </section>

      <section className="bg-white shadow-md rounded-xl p-6 border-l-4 border-green-600">
        <h2 className="text-xl font-semibold mb-4">Criptomonedas</h2>
        <div className="text-lg font-bold text-green-600">
          {loading
            ? <SpinnerBilletera />
            : cryptoBalance != null
              ? `${cryptoBalance.toFixed(2)} USDT`
              : '$-'}
        </div>
      </section>
    </div>
  );
}
