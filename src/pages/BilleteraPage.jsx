import React, { useEffect, useState } from 'react';
import { getWalletBalance } from '@apis/walletService';

export default function BilleteraPage() {
  const [fiatBalance, setFiatBalance] = useState(null);
  const [cryptoBalance, setCryptoBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user || user.rol !== 'admin') return;

    getWalletBalance()
      .then((data) => {
        setFiatBalance(data.fiatBalance);
        setCryptoBalance(data.cryptoBalance);
      })
      .catch((err) => {
        console.error(err.message);
      })
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Mi Billetera</h1>

      <section className="mb-8 bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Saldo en Pesos</h2>
        <div className="text-3xl font-bold text-green-600">
          {loading ? 'Cargando...' : `$ ${fiatBalance?.toFixed(2)}`}
        </div>
      </section>

      <section className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Criptomonedas</h2>
        <div className="text-lg font-bold text-green-600">
          {loading ? 'Cargando...' : `${cryptoBalance?.toFixed(2)} USDT`}
        </div>
      </section>
    </div>
  );
}
