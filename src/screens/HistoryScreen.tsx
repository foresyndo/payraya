import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Search, Filter, Send, PlusCircle, ArrowDownToLine, CreditCard } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, Input } from '../components/UI';
import { formatRupiah, formatDate } from '../utils/format';
import { Transaction } from '../types';
import { ReceiptCard } from '../components/ReceiptCard';
import { AnimatePresence } from 'motion/react';

export const HistoryScreen: React.FC = () => {
  const { transactions, setScreen } = useApp();
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [search, setSearch] = useState('');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const filteredTransactions = transactions.filter(tx => {
    const isIncome = tx.type === 'income' || tx.type === 'topup';
    if (filter === 'income' && !isIncome) return false;
    if (filter === 'expense' && isIncome) return false;
    if (search && !tx.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="pb-24 pt-6 px-5 flex flex-col min-h-screen bg-[#F5F7FA] relative">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => setScreen('home')} className="p-2 bg-white rounded-lg shadow-sm">
          <ArrowLeft size={20} className="text-[#003A8F]" />
        </button>
        <h1 className="text-xl font-bold text-[#003A8F]">Riwayat Transaksi</h1>
      </div>

      <div className="flex flex-col gap-4 mb-6">
         <Input
            placeholder="Cari transaksi..."
            icon={<Search size={18} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
         />
         <div className="flex gap-2">
            {[
              { id: 'all', label: 'Semua' },
              { id: 'income', label: 'Masuk' },
              { id: 'expense', label: 'Keluar' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={`
                  px-4 py-2 rounded-xl text-xs font-bold transition-all
                  ${filter === f.id ? 'bg-[#003A8F] text-white shadow-md shadow-blue-100' : 'bg-white text-gray-500'}
                `}
              >
                {f.label}
              </button>
            ))}
         </div>
      </div>

      <div className="flex flex-col gap-3">
        {filteredTransactions.map((tx, idx) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => setSelectedTx(tx)}
          >
            <TransactionItem tx={tx} />
          </motion.div>
        ))}
        {filteredTransactions.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 px-10 text-center"
          >
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 relative">
               <HistoryIcon size={48} strokeWidth={1} className="text-[#003A8F] opacity-30" />
               <div className="absolute inset-0 border-2 border-[#003A8F] border-dashed rounded-full animate-[spin_10s_linear_infinite] opacity-10"></div>
            </div>
            <h3 className="text-gray-800 font-black text-lg tracking-tight uppercase">Belum Ada Transaksi</h3>
            <p className="text-gray-500 text-[11px] font-bold uppercase tracking-widest mt-2 leading-relaxed max-w-[220px] opacity-60">
              {search 
                ? `Tidak ada hasil untuk "${search}". Coba kata kunci lain.` 
                : "Sepertinya Anda belum melakukan transaksi apapun hari ini."}
            </p>
            {!search && (
              <button 
                onClick={() => setScreen('transfer')}
                className="mt-8 px-8 py-3.5 bg-[#003A8F] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-100 active:scale-95 transition-all"
              >
                Transfer Sekarang
              </button>
            )}
          </motion.div>
        )}
      </div>
      <AnimatePresence>
        {selectedTx && (
          <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-5">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTx(null)}
              className="absolute inset-0 bg-[#003A8F]/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative z-10 w-full"
            >
              <ReceiptCard transaction={selectedTx} onClose={() => setSelectedTx(null)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const HistoryIcon: React.FC<{ size?: number; strokeWidth?: number }> = ({ size, strokeWidth }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </svg>
);

const TransactionItem: React.FC<{ tx: Transaction }> = ({ tx }) => {
  const isIncome = tx.type === 'income' || tx.type === 'topup';
  
  return (
    <Card className="flex items-center gap-4 p-3.5">
      <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
        isIncome ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
      }`}>
        {tx.type === 'transfer' && <Send size={20} />}
        {tx.type === 'income' && <PlusCircle size={20} />}
        {tx.type === 'topup' && <ArrowDownToLine size={20} />}
        {tx.type === 'payment' && <CreditCard size={20} />}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-sm text-gray-800 truncate">{tx.title}</h4>
        <div className="flex items-center gap-1.5 text-gray-400 text-[10px] mt-0.5">
          <span>{formatDate(tx.date)}</span>
          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          <span>{tx.category}</span>
        </div>
        <div className="text-[9px] text-gray-300 font-mono mt-1 opacity-80 uppercase tracking-wider">
          #{tx.id.toUpperCase()}
        </div>
      </div>
      <div className="text-right">
        <span className={`font-bold text-sm ${isIncome ? 'text-green-600' : 'text-gray-900'}`}>
          {isIncome ? '+' : '-'}{formatRupiah(tx.amount)}
        </span>
        <div className="text-[9px] font-bold text-green-500 bg-green-50 px-1.5 py-0.5 rounded ml-auto mt-1 w-fit uppercase">
          {tx.status}
        </div>
      </div>
    </Card>
  );
};
