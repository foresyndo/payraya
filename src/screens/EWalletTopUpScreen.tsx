import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Smartphone, 
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  Copy,
  Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, Button } from '../components/UI';
import { formatRupiah } from '../utils/format';
import confetti from 'canvas-confetti';

type WalletBrand = 'DANA' | 'OVO' | 'LinkAja' | 'GoPay';

export const EWalletTopUpScreen: React.FC = () => {
  const { user, setScreen, addTransaction } = useApp();
  const [step, setStep] = React.useState<'selection' | 'details' | 'confirm' | 'success'>('selection');
  const [selectedWallet, setSelectedWallet] = React.useState<WalletBrand | null>(null);
  const [phoneNumber, setPhoneNumber] = React.useState(user?.phone || '');
  const [amount, setAmount] = React.useState<number | null>(null);
  const [customAmount, setCustomAmount] = React.useState('');
  const [completedTx, setCompletedTx] = React.useState<any>(null);

  const wallets: { name: WalletBrand; color: string; bg: string; logo: React.ReactNode }[] = [
    { name: 'DANA', color: 'text-white', bg: 'bg-[#008FE3]', logo: <span className="text-sm">DANA</span> },
    { name: 'OVO', color: 'text-white', bg: 'bg-[#4C2A86]', logo: 'O' },
    { name: 'LinkAja', color: 'text-white', bg: 'bg-[#E1251B]', logo: 'L' },
    { name: 'GoPay', color: 'text-white', bg: 'bg-[#00AA13]', logo: 'G' },
  ];

  const amounts = [10000, 25000, 50000, 100000, 250000, 500000];

  const handleWalletSelect = (wallet: WalletBrand) => {
    setSelectedWallet(wallet);
    setStep('details');
  };

  const handleTopUpConfirm = async () => {
    const finalAmount = amount || parseInt(customAmount);
    if (!finalAmount || !selectedWallet || !phoneNumber) return;

    if (user && user.balance < finalAmount) {
      alert('Saldo tidak mencukupi!');
      return;
    }

    const tx = await addTransaction({
      type: 'payment',
      amount: finalAmount,
      title: `Top Up ${selectedWallet}`,
      category: 'E-Wallet',
      recipientName: `${selectedWallet} - ${phoneNumber}`,
      senderName: user?.name || 'User',
      accountNumber: phoneNumber,
      status: 'success',
      bankName: selectedWallet
    });

    setCompletedTx(tx);
    setStep('success');
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#003A8F', '#FBBF24', '#10B981']
    });
  };

  return (
    <div className="pb-24 pt-6 px-5 flex flex-col min-h-screen bg-[#f0f2f5]">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => {
            if (step === 'selection') setScreen('home');
            else if (step === 'details') setStep('selection');
            else if (step === 'confirm') setStep('details');
            else setScreen('home');
          }} 
          className="p-2 bg-white rounded-lg shadow-sm border border-[#f0f0f0]"
        >
          <ArrowLeft size={20} className="text-[#003A8F]" />
        </button>
        <h1 className="text-xl font-bold text-[#003A8F]">Top Up E-Wallet</h1>
      </div>

      <AnimatePresence mode="wait">
        {step === 'selection' && (
          <motion.div
            key="selection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col gap-4"
          >
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1">Pilih Provider</h3>
            <div className="grid gap-3">
              {wallets.map((wallet) => (
                <Card 
                  key={wallet.name}
                  onClick={() => handleWalletSelect(wallet.name)}
                  className="flex items-center gap-4 p-5 cursor-pointer hover:border-[#003A8F] transition-all group active:scale-95 shadow-sm"
                >
                  <div className={`w-12 h-12 ${wallet.bg} rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-inner group-hover:scale-110 transition-transform`}>
                    {wallet.logo}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-gray-800">{wallet.name}</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5 tracking-tight">Instan & Tanpa Biaya Admin</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'details' && selectedWallet && (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-6"
          >
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#f0f0f0]">
               <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 ${wallets.find(w => w.name === selectedWallet)?.bg} rounded-2xl flex items-center justify-center text-white font-black text-xl`}>
                    {wallets.find(w => w.name === selectedWallet)?.logo}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-800">{selectedWallet}</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Nomor HP Tujuan</p>
                  </div>
               </div>
               
               <div className="relative">
                 <Smartphone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                 <input 
                   type="tel"
                   value={phoneNumber}
                   onChange={(e) => setPhoneNumber(e.target.value)}
                   placeholder="Masukkan nomor HP"
                   className="w-full bg-[#f8f9fa] border-2 border-transparent focus:border-[#003A8F] focus:bg-white rounded-2xl py-4 pl-12 pr-4 font-black transition-all outline-none"
                 />
               </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1">Pilih Nominal</h3>
              <div className="grid grid-cols-2 gap-3">
                {amounts.map(amt => (
                  <button
                    key={amt}
                    onClick={() => {
                      setAmount(amt);
                      setCustomAmount('');
                    }}
                    className={`py-4 px-4 rounded-2xl font-black text-sm border-2 transition-all ${amount === amt ? 'bg-[#003A8F] border-[#003A8F] text-white shadow-lg shadow-blue-100' : 'bg-white border-white text-gray-700 shadow-sm'}`}
                  >
                    {formatRupiah(amt).replace('Rp', '').trim()}
                  </button>
                ))}
              </div>
              
              <div className="relative mt-2">
                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-black">Rp</div>
                 <input 
                   type="number"
                   value={customAmount}
                   onChange={(e) => {
                     setCustomAmount(e.target.value);
                     setAmount(null);
                   }}
                   placeholder="Nominal lainnya"
                   className={`w-full py-4 pl-12 pr-4 bg-white rounded-2xl font-black border-2 transition-all outline-none ${customAmount ? 'border-[#003A8F] bg-blue-50/10' : 'border-white focus:border-blue-100'}`}
                 />
              </div>
            </div>

            <Button 
              size="full" 
              className="mt-4"
              disabled={!phoneNumber || (!amount && (!customAmount || parseInt(customAmount) < 10000))}
              onClick={() => setStep('confirm')}
            >
              Lanjutkan
            </Button>
          </motion.div>
        )}

        {step === 'confirm' && selectedWallet && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col gap-6"
          >
            <Card className="p-8 border-none shadow-xl bg-white relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-full h-2 ${wallets.find(w => w.name === selectedWallet)?.bg}`}></div>
              <h3 className="text-center font-black text-gray-800 mb-8 uppercase tracking-[0.2em] text-xs">Konfirmasi Top Up</h3>
              
              <div className="space-y-6">
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 font-bold uppercase text-[10px]">Provider</span>
                    <span className="font-black text-gray-800">{selectedWallet}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 font-bold uppercase text-[10px]">Nomor HP</span>
                    <span className="font-black text-gray-800">{phoneNumber}</span>
                 </div>
                 <div className="w-full h-px bg-gray-50 border-t border-dashed"></div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 font-bold uppercase text-[10px]">Nominal</span>
                    <span className="font-black text-gray-800">{formatRupiah(amount || parseInt(customAmount))}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 font-bold uppercase text-[10px]">Biaya Admin</span>
                    <span className="font-black text-green-600">GRATIS</span>
                 </div>
                 <div className="w-full h-0.5 bg-gray-100"></div>
                 <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-black uppercase text-xs">Total</span>
                    <span className="font-black text-xl text-[#003A8F]">{formatRupiah(amount || parseInt(customAmount))}</span>
                 </div>
              </div>

              <div className="mt-8 flex items-start gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <ShieldCheck size={20} className="text-[#003A8F] shrink-0" />
                <p className="text-[10px] font-bold text-[#003A8F] leading-relaxed">
                  Semua transaksi di PayRaya dijamin aman dan dilindungi asuransi.
                </p>
              </div>
            </Card>

            <Button size="full" onClick={handleTopUpConfirm} className="shadow-lg shadow-blue-100">Bayar Sekarang</Button>
          </motion.div>
        )}

        {step === 'success' && completedTx && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-green-100 animate-bounce">
              <CheckCircle size={48} />
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-2">Transaki Berhasil!</h2>
            <p className="text-sm text-gray-500 px-10 leading-relaxed mb-10">
              Top up {selectedWallet} sebesar {formatRupiah(completedTx.amount)} ke nomor {phoneNumber} telah sukses.
            </p>
            
            <Card className="w-full p-6 mb-10 border-none shadow-md bg-white">
               <div className="flex justify-between items-center text-xs mb-4">
                  <span className="text-gray-400 font-bold">ID TRANSAKSI</span>
                  <span className="font-mono font-black text-gray-800">#{completedTx.id}</span>
               </div>
               <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-bold">WAKTU</span>
                  <span className="font-black text-gray-800">{new Date(completedTx.date).toLocaleString('id-ID')}</span>
               </div>
            </Card>

            <div className="w-full space-y-3">
              <Button size="full" onClick={() => setScreen('home')}>Kembali ke Beranda</Button>
              <Button size="full" variant="outline" className="flex items-center justify-center gap-2">
                <Copy size={16} /> Simpan Bukti
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
