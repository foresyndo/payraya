import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Send, 
  Wallet, 
  CreditCard, 
  ArrowDownToLine, 
  Smartphone, 
  Lightbulb, 
  Globe, 
  ChevronRight,
  PlusCircle,
  PiggyBank,
  History as HistoryIcon,
  User as UserIcon,
  QrCode,
  Eye,
  EyeOff,
  Zap,
  TrainFront,
  Gift,
  Ticket,
  Store,
  Newspaper,
  Trophy,
  ArrowUpRight,
  TrendingUp,
  Receipt,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, Button } from '../components/UI';
import { formatRupiah, formatDate } from '../utils/format';
import { Transaction } from '../types';
import { Logo } from '../components/Logo';

export const Dashboard: React.FC = () => {
  const { user, transactions, setScreen, unreadCount, addTransaction, setSelectedEWallet } = useApp();
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const [showBalance, setShowBalance] = React.useState(() => {
    const saved = localStorage.getItem('payraya_show_balance');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [showManualTx, setShowManualTx] = React.useState(false);
  const [manualTxType, setManualTxType] = React.useState<'income' | 'expense'>('expense');
  const [manualAmount, setManualAmount] = React.useState('');
  const [manualTitle, setManualTitle] = React.useState('');

  React.useEffect(() => {
    localStorage.setItem('payraya_show_balance', JSON.stringify(showBalance));
  }, [showBalance]);

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const formattedTime = currentTime.toLocaleTimeString('id-ID', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });

  const recentTransactions = transactions.slice(0, 3);

  const handleManualAdd = async () => {
    if (!manualAmount || !manualTitle) return;
    const amountNum = parseInt(manualAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    await addTransaction({
      type: manualTxType === 'income' ? 'income' : 'payment',
      title: manualTitle,
      amount: amountNum,
      category: manualTxType === 'income' ? 'Income' : 'Manual',
      status: 'success'
    });

    setManualAmount('');
    setManualTitle('');
    setShowManualTx(false);
  };

  const quickActions = [
    { icon: Send, label: 'Transfer', screen: 'transfer', color: 'bg-blue-50 text-blue-600' },
    { icon: ArrowDownToLine, label: 'Top Up', screen: 'topup', color: 'bg-amber-50 text-amber-600' },
    { icon: CreditCard, label: 'Bayar', screen: 'payment', color: 'bg-green-50 text-green-600' },
    { icon: Wallet, label: 'Tarik Tunai', screen: 'withdraw', color: 'bg-orange-50 text-orange-600' },
    { icon: PiggyBank, label: 'Deposito', screen: 'deposito', color: 'bg-indigo-50 text-indigo-600' },
    { icon: Smartphone, label: 'E-Money', screen: 'emoney', color: 'bg-cyan-50 text-cyan-600' },
    { icon: PlusCircle, label: 'Pinjaman', screen: 'loan', color: 'bg-red-50 text-red-600', badge: 'BARU' },
    { icon: Globe, label: 'Paylater', screen: 'paylater', color: 'bg-purple-50 text-purple-600', badge: !user?.isPaylaterActive ? 'AKTIFKAN' : undefined },
  ];

  return (
    <div className="pb-24 pt-6 px-5 flex flex-col gap-6 overflow-x-hidden max-w-md mx-auto bg-[#f0f2f5] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-3">
          <Logo size={40} showText={false} />
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-[#003A8F] leading-tight">Halo, {user?.name}</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <h2 className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">{getGreeting()}</h2>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span className="text-gray-400 text-[10px] font-mono font-bold tracking-tighter">{formattedTime}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setScreen('qr')}
            className="w-10 h-10 bg-[#F4F6F9] rounded-full flex items-center justify-center text-[#003A8F] shadow-btn border border-white/50"
            title="QR Saya"
          >
            <QrCode size={20} />
          </button>
          <button 
            onClick={() => setScreen('notifications')}
            className="w-10 h-10 bg-[#F4F6F9] rounded-full flex items-center justify-center text-[#003A8F] shadow-btn border border-white/50 relative active:scale-90 transition-transform"
            title="Notifikasi"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] bg-[#FF3B30] text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#f0f2f5] shadow-sm px-1 animate-in zoom-in duration-300">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Balance Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="bg-gradient-to-br from-[#003A8F] to-[#0056D2] rounded-[20px] p-6 text-white shadow-card relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-start">
               <span className="text-white/80 text-[12px] opacity-80">Saldo Aktif</span>
               <button 
                 onClick={() => setShowBalance(!showBalance)}
                 className="p-1 px-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 active:scale-90 transition-transform"
               >
                 {showBalance ? <EyeOff size={14} /> : <Eye size={14} />}
               </button>
            </div>
            <div className="flex justify-between items-end mt-1 mb-1">
              <h2 className="text-2xl font-black tracking-tight h-8">
                {showBalance ? formatRupiah(user?.balance || 0) : '••••••••'}
              </h2>
              <button 
                onClick={() => setScreen('topup')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-md border border-white/30 transition-all active:scale-95 mb-1"
              >
                <PlusCircle size={14} />
                <span className="text-[10px] font-black uppercase tracking-wider">Top Up</span>
              </button>
            </div>
            <div className="text-white/70 text-[11px] opacity-70">
              PayRaya ID: {user?.phone}
            </div>
            <div className="absolute right-0 bottom-0 text-white/30 font-black italic text-2xl tracking-tighter opacity-30">
              VISA
            </div>
          </div>
          {/* Abstract pattern decor */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute left-10 bottom-0 w-24 h-24 bg-blue-400/20 rounded-full blur-2xl"></div>
        </div>
      </motion.div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-4 gap-y-6 bg-white rounded-[20px] p-6 shadow-btn border border-[#f0f0f0]">
        {quickActions.map((action, idx) => (
          <motion.button
            key={action.label}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 + idx * 0.05 }}
            onClick={() => setScreen(action.screen as any)}
            className="flex flex-col items-center gap-2 group"
          >
            <div className={`relative w-14 h-14 ${action.color || 'bg-white'} rounded-[16px] flex items-center justify-center shadow-btn border border-[#f0f0f0] group-active:scale-95 transition-transform`}>
              <action.icon size={26} strokeWidth={2.2} />
              {action.badge && (
                <span className="absolute -top-1 -right-1 bg-[#FFC107] text-[#003A8F] text-[9px] font-extrabold px-1.5 py-0.5 rounded-lg shadow-sm border border-white">
                  {action.badge}
                </span>
              )}
            </div>
            <span className="text-[11px] font-bold text-gray-600">{action.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Promo Carousel */}
      <PromoCarousel />

      {/* E-Wallet & Extra Sections */}
      <div className="flex flex-col gap-5">
        {/* E-Wallet Grid */}
        <div className="bg-white rounded-[20px] p-5 shadow-btn border border-[#f0f0f0]">
          <div className="flex justify-between items-center mb-4 px-1">
            <h3 className="text-[13px] font-black text-gray-800 uppercase tracking-widest">Top Up E-Wallet</h3>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[
              { name: 'DANA', color: '#008FE3', logo: <div className="flex flex-col items-center"><span className="text-[9px] font-black tracking-tighter leading-none mb-0.5">DANA</span><div className="w-5 h-1 bg-white/40 rounded-full"></div></div>, brand: 'dana' },
              { name: 'OVO', color: '#4C2A86', logo: <div className="flex flex-col items-center"><div className="w-6 h-6 rounded-full border-4 border-white flex items-center justify-center"></div><span className="text-[8px] font-black tracking-widest mt-0.5">OVO</span></div>, brand: 'ovo' },
              { name: 'LinkAja', color: '#E1251B', logo: <div className="flex flex-col items-center"><div className="bg-white px-1.5 py-0.5 rounded-full"><span className="text-[8px] font-black text-[#E1251B] italic">Link</span></div></div>, brand: 'linkaja' },
              { name: 'GoPay', color: '#00AED6', logo: <div className="flex flex-col items-center"><div className="w-6 h-5 bg-white rounded-md relative overflow-hidden"><div className="absolute top-1 left-1 w-2 h-1 bg-[#00AED6] rounded-full"></div></div><span className="text-[7px] font-black mt-0.5 text-white">gopay</span></div>, brand: 'gopay' },
            ].map((wallet) => (
              <motion.button
                key={wallet.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-2"
                onClick={() => {
                  setSelectedEWallet(wallet.name);
                  setScreen('ewallet');
                }}
              >
                <div 
                  style={{ backgroundColor: wallet.color }}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-900/5 relative overflow-hidden group"
                >
                  <div className="relative z-10 font-black tracking-tighter">
                    {wallet.logo}
                  </div>
                  {/* Real-logo simulation decor */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent opacity-50"></div>
                  <div className="absolute -right-2 -top-2 w-8 h-8 bg-white/20 rounded-full blur-md"></div>
                </div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">{wallet.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Triple Action Cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Toko PayRaya', icon: Store, color: 'bg-amber-100 text-amber-600', screen: 'payment' },
            { label: 'Pusat Berita', icon: Newspaper, color: 'bg-blue-100 text-blue-600', screen: 'notifications' },
            { label: 'PayRaya Goals', icon: Trophy, color: 'bg-indigo-100 text-[#003A8F]', screen: 'goals' }
          ].map((item) => (
            <motion.button
              key={item.label}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setScreen(item.screen as any)}
              className="bg-white rounded-[20px] p-4 shadow-btn border border-[#f0f0f0] flex flex-col items-center gap-2 group"
            >
              <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <item.icon size={20} />
              </div>
              <span className="text-[10px] font-black text-gray-700 text-center leading-tight">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-2">
            <h3 className="text-[15px] font-bold text-[#333]">Transaksi Terakhir</h3>
            <button 
              onClick={() => setShowManualTx(true)}
              className="p-1 px-2.5 bg-blue-50 text-[#003A8F] text-[10px] font-black rounded-lg border border-blue-100 flex items-center gap-1 active:scale-95 transition-transform"
            >
              <PlusCircle size={12} />
              CATAT
            </button>
          </div>
          <button 
            onClick={() => setScreen('history')}
            className="text-[#003A8F] text-xs font-bold"
          >
            Lihat Semua
          </button>
        </div>
        
        <div className="flex flex-col gap-3">
          {recentTransactions.map((tx) => (
            <TransactionCard key={tx.id} tx={tx} />
          ))}
          {recentTransactions.length === 0 && (
            <div className="py-10 text-center text-gray-400 text-sm italic">
              Belum ada transaksi
            </div>
          )}
        </div>
      </div>

      {/* Manual Tx Modal */}
      <AnimatePresence>
        {showManualTx && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-5">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowManualTx(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[32px] p-8 relative z-10 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black text-[#003A8F]">Catat Keuangan</h3>
                <button onClick={() => setShowManualTx(false)} className="p-2 bg-gray-50 rounded-full text-gray-400">
                  <X size={20} />
                </button>
              </div>

              <div className="flex gap-4 mb-8">
                <button 
                  onClick={() => setManualTxType('expense')}
                  className={`flex-1 py-4 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all ${manualTxType === 'expense' ? 'border-red-500 bg-red-50' : 'border-gray-50 bg-white'}`}
                >
                  <TrendingUp size={24} className={`transform rotate-180 ${manualTxType === 'expense' ? 'text-red-500' : 'text-gray-300'}`} />
                  <span className={`text-xs font-black uppercase tracking-widest ${manualTxType === 'expense' ? 'text-red-600' : 'text-gray-400'}`}>Pengeluaran</span>
                </button>
                <button 
                  onClick={() => setManualTxType('income')}
                  className={`flex-1 py-4 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all ${manualTxType === 'income' ? 'border-green-500 bg-green-50' : 'border-gray-50 bg-white'}`}
                >
                  <TrendingUp size={24} className={manualTxType === 'income' ? 'text-green-500' : 'text-gray-300'} />
                  <span className={`text-xs font-black uppercase tracking-widest ${manualTxType === 'income' ? 'text-green-600' : 'text-gray-400'}`}>Pemasukan</span>
                </button>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Keterangan / Nama Toko</label>
                  <div className="relative">
                    <Receipt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text"
                      placeholder="Contoh: Makan Siang, Gaji..."
                      value={manualTitle}
                      onChange={(e) => setManualTitle(e.target.value)}
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-gray-800 placeholder:text-gray-300 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Nominal (Rp)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-black text-xs">Rp</span>
                    <input 
                      type="number"
                      placeholder="0"
                      value={manualAmount}
                      onChange={(e) => setManualAmount(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-xl font-black text-[#003A8F] placeholder:text-gray-300 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={handleManualAdd}
                className={`w-full mt-10 py-5 rounded-2xl text-white font-black uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all ${manualTxType === 'income' ? 'bg-green-600 shadow-green-100' : 'bg-red-600 shadow-red-100'}`}
              >
                Simpan Catatan
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PromoCarousel: React.FC = () => {
  const { setScreen } = useApp();
  const promos = [
    {
      id: 1,
      title: 'Cashback 50% PLN',
      desc: 'Bayar tagihan listrik pertama bulan ini.',
      icon: Zap,
      color: 'bg-[#FFC107]',
      textColor: 'text-[#003A8F]',
      badge: 'PROMO PLN',
      screen: 'payment'
    },
    {
      id: 2,
      title: 'Diskon 20rb KAI',
      desc: 'Liburan makin hemat dengan PayRaya.',
      icon: TrainFront,
      color: 'bg-indigo-600',
      textColor: 'text-white',
      badge: 'LIBURAN',
      screen: 'payment'
    },
    {
      id: 3,
      title: 'Bonus Saldo 10%',
      desc: 'Top up minimal 100rb pake Virtual Account.',
      icon: Gift,
      color: 'bg-green-600',
      textColor: 'text-white',
      badge: 'TOP UP',
      screen: 'topup'
    },
    {
      id: 4,
      title: 'Bebas Admin Bank',
      desc: 'Transfer ke bank mana saja gratis 5x/bulan.',
      icon: Ticket,
      color: 'bg-[#003A8F]',
      textColor: 'text-white',
      badge: 'TRANSFER',
      screen: 'transfer'
    },
    {
      id: 5,
      title: 'Bonus OVO 5.000',
      desc: 'Top up OVO minimal 50rb pake PayRaya.',
      icon: Ticket,
      color: 'bg-[#4C2A86]',
      textColor: 'text-white',
      badge: 'PROMO OVO',
      screen: 'ewallet'
    }
  ];

  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promos.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [promos.length]);

  return (
    <div className="relative h-[110px] mx-1 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          onClick={() => setScreen(promos[currentIndex].screen as any)}
          className={`absolute inset-0 ${promos[currentIndex].color} rounded-[20px] p-5 flex items-center justify-between shadow-md border border-white/10 cursor-pointer active:scale-95 transition-transform`}
        >
          <div className="flex-1 z-10">
            <span className={`text-[8px] font-black px-2 py-0.5 rounded-full mb-2 inline-block bg-white/20 ${promos[currentIndex].textColor} tracking-[0.2em]`}>
              {promos[currentIndex].badge}
            </span>
            <h3 className={`text-[15px] font-black ${promos[currentIndex].textColor} leading-tight`}>
              {promos[currentIndex].title}
            </h3>
            <p className={`text-[10px] ${promos[currentIndex].textColor} opacity-80 font-bold mt-0.5`}>
              {promos[currentIndex].desc}
            </p>
          </div>
          
          <div className="relative">
             <div className="w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center transform rotate-12">
               {React.createElement(promos[currentIndex].icon, { 
                 size: 32, 
                 className: promos[currentIndex].textColor 
               })}
             </div>
             {/* Decorative circles */}
             <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-white/5 rounded-full blur-xl"></div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        {promos.map((_, idx) => (
          <div 
            key={idx}
            className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-4 bg-white' : 'w-1 bg-white/30'}`}
          />
        ))}
      </div>
    </div>
  );
};

const TransactionCard: React.FC<{ tx: Transaction }> = ({ tx }) => {
  const isIncome = tx.type === 'income' || tx.type === 'topup';
  
  return (
    <div className="flex items-center gap-4 py-2 border-b border-gray-100 last:border-none px-1">
      <div className={`w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0 bg-[#F4F6F9] text-[#003A8F]`}>
        {tx.type === 'transfer' && <Send size={20} />}
        {tx.type === 'income' && <PlusCircle size={20} />}
        {tx.type === 'topup' && <ArrowDownToLine size={20} />}
        {tx.type === 'payment' && <CreditCard size={20} />}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-[14px] text-[#333] truncate">{tx.title}</h4>
        <div className="flex items-center gap-1.5 text-[#999] text-[11px] mt-0.5">
          <span>{formatDate(tx.date)}</span>
          <span className="text-[10px] opacity-70 font-mono font-bold tracking-tight">#{tx.id}</span>
        </div>
      </div>
      <div className="text-right">
        <span className={`font-bold text-[14px] ${isIncome ? 'text-[#43A047]' : 'text-[#E53935]'}`}>
          {isIncome ? '+' : '-'}{formatRupiah(tx.amount)}
        </span>
      </div>
    </div>
  );
};
