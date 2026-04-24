import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowDownToLine, CheckCircle2, Copy, Store, Users, Landmark, ChevronRight, Clock, Barcode } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button, Card } from '../components/UI';
import { formatRupiah } from '../utils/format';
import { ReceiptCard } from '../components/ReceiptCard';
import confetti from 'canvas-confetti';
import { Transaction } from '../types';
import Barcode1D from 'react-barcode';

export const TopUpScreen: React.FC = () => {
  const { user, setScreen, addTransaction } = useApp();
  const [step, setStep] = useState<'method' | 'selection' | 'agent-token' | 'va-code' | 'success'>('method');
  const [method, setMethod] = useState<'va' | 'mitra' | 'agen'>('va');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const [selectedBank, setSelectedBank] = useState<{name: string, code: string} | null>(null);
  const [completedTransaction, setCompletedTransaction] = useState<Transaction | null>(null);
  const [token, setToken] = useState('');
  const [timer, setTimer] = useState(1800); // 30 minutes 

  const amounts = [50000, 100000, 250000, 500000, 1000000, 2000000];
  const banks = [
    { name: 'BCA', code: '8801' },
    { name: 'Mandiri', code: '9012' },
    { name: 'BNI', code: '4452' },
    { name: 'BRI', code: '1002' }
  ];

  useEffect(() => {
    let interval: any;
    if ((step === 'agent-token' || step === 'va-code') && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleTopUp = async () => {
    const amount = selectedAmount || parseInt(customAmount);
    if (!amount || amount < 10000) return;

    if (method === 'mitra' || method === 'agen') {
      const newToken = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      setToken(newToken);
      setStep('agent-token');
      setTimer(1800);
      return;
    }

    if (method === 'va') {
      if (!selectedBank) return;
      const vaNumber = selectedBank.code + (user?.phone || '081234567890').slice(-8);
      setToken(vaNumber);
      setStep('va-code');
      setTimer(1800);
      return;
    }
  };

  const confirmTopUp = async (source: 'va' | 'agent') => {
    const amount = selectedAmount || parseInt(customAmount);
    if (!amount) return;
    
    const title = source === 'va' 
      ? `Top Up Saldo via VA ${selectedBank?.name}` 
      : `Top Up Saldo via ${method === 'mitra' ? 'Mitra/Indomaret' : 'Agen Perorangan'}`;
      
    const bankName = source === 'va' 
      ? `Virtual Account ${selectedBank?.name}` 
      : (method === 'mitra' ? 'Mitra PayRaya' : 'Agen Individual');

    const tx = await addTransaction({
      type: 'topup',
      amount: amount,
      title: title,
      category: 'Top Up',
      bankName: bankName,
      accountNumber: token,
      recipientName: user?.name || 'User Handal',
      senderName: source === 'va' ? 'Bank Transfer' : 'Mitra Pembayaran',
      status: 'success'
    });
    setCompletedTransaction(tx);
    setStep('success');
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#003A8F', '#FBBF24', '#10B981']
    });
  };

  return (
    <div className="pb-24 pt-6 px-5 flex flex-col min-h-screen bg-[#F5F7FA]">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => {
          if (step === 'method') setScreen('home');
          else if (step === 'selection') setStep('method');
          else if (step === 'agent-token' || step === 'va-code') setStep('selection');
          else setScreen('home');
        }} className="p-2 bg-white rounded-lg shadow-sm">
          <ArrowLeft size={20} className="text-[#003A8F]" />
        </button>
        <h1 className="text-xl font-bold text-[#003A8F]">
          {step === 'method' ? 'Metode Top Up' : (step === 'selection' ? 'Isi Saldo' : (step === 'va-code' ? 'Kode VA' : 'Konfirmasi Agen'))}
        </h1>
      </div>

      <AnimatePresence mode="wait">
        {step === 'method' && (
          <motion.div
            key="method"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 20, opacity: 0 }}
            className="flex flex-col gap-4"
          >
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest px-1">Pilih Metode Pembayaran</h3>
            <div className="flex flex-col gap-4">
              <Card 
                className="flex items-center gap-4 p-5 cursor-pointer hover:border-[#003A8F] transition-all"
                onClick={() => { setMethod('va'); setStep('selection'); }}
              >
                <div className="w-12 h-12 bg-blue-50 text-[#003A8F] rounded-2xl flex items-center justify-center">
                  <Landmark size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-gray-800">Virtual Account</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">Transfer Bank (BCA, Mandiri, BRI, dll)</p>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
              </Card>

              <Card 
                className="flex items-center gap-4 p-5 cursor-pointer hover:border-[#003A8F] transition-all"
                onClick={() => { setMethod('mitra'); setStep('selection'); }}
              >
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                  <Store size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-gray-800">Agen / Mitra PayRaya</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">Top up tunai melalui Mitra & Indomaret</p>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
              </Card>

              <Card 
                className="flex items-center gap-4 p-5 cursor-pointer hover:border-[#003A8F] transition-all"
                onClick={() => { setMethod('agen'); setStep('selection'); }}
              >
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                  <Users size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-gray-800">Agen Perorangan</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">Top up melalui tetangga atau agen terdekat</p>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
              </Card>
            </div>
          </motion.div>
        )}

        {step === 'selection' && (
          <motion.div
            key="selection"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Metode Pembayaran</h3>
                <button 
                  onClick={() => setStep('method')} 
                  className="text-[11px] font-bold text-[#003A8F] bg-blue-50 px-2 py-1 rounded-lg"
                >
                  Ubah
                </button>
              </div>
              {method === 'va' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-3">
                    {banks.map(bank => (
                      <button
                        key={bank.name}
                        onClick={() => setSelectedBank(bank)}
                        className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${selectedBank?.name === bank.name ? 'border-[#003A8F] bg-blue-50 text-[#003A8F]' : 'border-gray-50 bg-white text-gray-400'}`}
                      >
                        <Landmark size={20} />
                        <span className="text-[10px] font-black">{bank.name}</span>
                      </button>
                    ))}
                  </div>
                  {selectedBank && (
                    <Card className="bg-gradient-to-br from-[#003A8F] to-blue-700 text-white border-none p-5 relative overflow-hidden group">
                        <div className="relative z-10">
                          <div className="flex items-center gap-3">
                            <Landmark size={20} className="text-blue-200" />
                            <span className="text-blue-100 text-[10px] font-bold uppercase tracking-widest leading-none">Pilihan: Virtual Account {selectedBank.name}</span>
                          </div>
                          <div className="flex justify-between items-center mt-3">
                             <h2 className="text-xl font-black tracking-wider">{selectedBank.code}{user?.phone?.slice(-8).replace(/\d{4}$/, '****')}</h2>
                          </div>
                        </div>
                        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                    </Card>
                  )}
                </div>
              ) : (
                <Card 
                  className="bg-white border-blue-50 p-4 flex items-center gap-4 cursor-pointer hover:border-[#003A8F] transition-all group shadow-sm"
                  onClick={() => setStep('method')}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${method === 'mitra' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'}`}>
                    {method === 'mitra' ? <Store size={22} /> : <Users size={22} />}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[13px] font-black text-gray-800">
                      {method === 'mitra' ? 'Mitra & Indomaret' : 'Agen Perorangan'}
                    </h3>
                    <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5 tracking-tight">Klik untuk ganti metode pembayaran</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
                </Card>
              )}
            </div>

            <div className="flex flex-col gap-4">
               <div className="flex justify-between items-center px-1">
                 <h3 className="font-bold text-gray-800 uppercase text-[11px] tracking-widest opacity-60">Nominal Isi Saldo</h3>
                 {selectedAmount && (
                   <button 
                     onClick={() => setSelectedAmount(null)}
                     className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded-lg"
                   >
                     Reset
                   </button>
                 )}
               </div>
               
               {/* Custom Amount Input */}
               <div className="relative group">
                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-black text-lg group-focus-within:text-[#003A8F] transition-colors">Rp</div>
                 <input 
                   type="number"
                   placeholder="Masukkan nominal lainnya"
                   value={customAmount}
                   onChange={(e) => {
                     setCustomAmount(e.target.value);
                     setSelectedAmount(null);
                   }}
                   className={`
                     w-full pl-12 pr-4 py-5 bg-white rounded-2xl text-xl font-black border-2 transition-all outline-none
                     ${customAmount ? 'border-[#003A8F] shadow-lg shadow-blue-100 text-[#003A8F]' : 'border-white shadow-sm text-gray-800 focus:border-blue-100'}
                   `}
                 />
                 {customAmount && (
                   <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#003A8F] bg-blue-50 px-2 py-1 rounded-lg uppercase">Manual</div>
                 )}
               </div>

               <div className="grid grid-cols-2 gap-4">
                  {amounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => {
                        setSelectedAmount(amount);
                        setCustomAmount('');
                      }}
                      className={`
                        py-4 px-4 rounded-2xl font-black text-sm border-2 transition-all
                        ${selectedAmount === amount 
                          ? 'border-[#003A8F] bg-[#003A8F] text-white shadow-lg shadow-blue-100' 
                          : 'border-white bg-white text-gray-700 shadow-sm'}
                      `}
                    >
                      {formatRupiah(amount).replace('Rp', '').trim()}
                    </button>
                  ))}
               </div>
            </div>

               <Button 
                size="full" 
                onClick={handleTopUp} 
                disabled={!(selectedAmount || parseInt(customAmount) >= 10000) || (method === 'va' && !selectedBank)}
                className="mt-6"
              >
                 {method === 'va' ? 'Dapatkan Nomor VA' : (method === 'mitra' || method === 'agen' ? 'Dapatkan Token Agen' : 'Top Up Sekarang')}
              </Button>
              {parseInt(customAmount) > 0 && parseInt(customAmount) < 10000 && (
                <p className="text-center text-[10px] font-bold text-red-500 mt-2">Minimal top up Rp 10.000</p>
              )}
          </motion.div>
        )}

        {step === 'agent-token' && (
          <motion.div
            key="agent-token"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <Card className="w-full flex flex-col items-center py-10 px-8 border-none shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-amber-400"></div>
               
               <div className="text-center mb-8">
                  <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-1">Token Top Up</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Berikan nomor ini kepada agen</p>
               </div>

               <div className="flex flex-col items-center gap-6 mb-8 w-full">
                  <div className="bg-white p-3 rounded-2xl shadow-inner border-2 border-gray-50 mb-2 relative group cursor-pointer active:scale-95 transition-transform" onClick={() => handleCopy(token)}>
                    <Barcode1D 
                      value={token} 
                      width={1.8} 
                      height={70} 
                      displayValue={false} 
                      background="transparent"
                    />
                    {copied && (
                      <div className="absolute top-0 right-0 bg-green-500 text-white text-[8px] font-black px-2 py-1 rounded-full animate-bounce">DI SALIN!</div>
                    )}
                  </div>
                  <h4 className="text-2xl font-black text-[#003A8F] tracking-[0.2em] font-mono flex items-center gap-2 cursor-pointer" onClick={() => handleCopy(token)}>
                    {token.match(/.{1,4}/g)?.join(' ')}
                    <Copy size={16} className={copied ? "text-green-500" : "text-gray-400"} />
                  </h4>
                  
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
                     <Clock size={14} className="text-[#003A8F]" />
                     <span className="text-xs font-black text-[#003A8F]">Berlaku {formatTime(timer)}</span>
                  </div>
               </div>

               <div className="w-full border-t border-dashed border-gray-100 pt-6 space-y-3">
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-bold uppercase tracking-tighter">Nominal Top Up</span>
                    <span className="font-black text-gray-800">{formatRupiah(selectedAmount || 0)}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-bold uppercase tracking-tighter">Biaya Layanan</span>
                    <span className="font-black text-green-600">GRATIS</span>
                 </div>
               </div>
            </Card>

            <div className="flex flex-col gap-3 w-full">
               <Button size="full" onClick={() => confirmTopUp('agent')}>Simulasi Agen Telah Dibayar</Button>
               <Button variant="outline" size="full" onClick={() => setStep('selection')}>Ubah Nominal</Button>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-2xl flex gap-3 text-left">
              <Clock size={20} className="text-[#003A8F] shrink-0" />
              <p className="text-[10px] text-[#003A8F] font-bold leading-relaxed">
                Silakan datang ke agen terdekat dan tunjukkan kode di atas. Saldo akan otomatis bertambah setelah agen memproses pembayaran Anda.
              </p>
            </div>
          </motion.div>
        )}

        {step === 'va-code' && (
          <motion.div
            key="va-code"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <Card className="w-full flex flex-col items-center py-10 px-8 border-none shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-[#003A8F]"></div>
               
               <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Landmark size={20} className="text-[#003A8F]" />
                    <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">{selectedBank?.name} Virtual Account</h3>
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Transfer ke nomor VA di bawah ini</p>
               </div>

               <div className="flex flex-col items-center gap-4 mb-8 w-full">
                    <div className="w-full bg-[#F4F6F9] p-6 rounded-2xl flex flex-col items-center gap-3 border border-gray-100 relative group active:scale-95 transition-transform" onClick={() => handleCopy(token)}>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nomor Virtual Account</span>
                      <h4 className="text-2xl font-black text-[#003A8F] tracking-[0.1em] font-mono select-all cursor-pointer flex items-center gap-2">
                        {token}
                        <Copy size={16} className={copied ? "text-green-500" : "text-gray-300"} />
                      </h4>
                      {copied && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white text-[8px] font-black px-2 py-1 rounded-full animate-bounce">DI SALIN!</div>
                      )}
                    </div>
                  
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
                     <Clock size={14} className="text-[#003A8F]" />
                     <span className="text-xs font-black text-[#003A8F]">Selesaikan sebelum {formatTime(timer)}</span>
                  </div>
               </div>

               <div className="w-full border-t border-dashed border-gray-100 pt-6 space-y-3">
                 <div className="flex justify-between items-center text-sm font-black">
                    <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Total Pembayaran</span>
                    <span className="text-[#003A8F]">{formatRupiah(selectedAmount || 0)}</span>
                 </div>
               </div>
            </Card>

            <div className="flex flex-col gap-3 w-full">
               <Button size="full" onClick={() => confirmTopUp('va')}>Saya Sudah Bayar (Simulasi)</Button>
               <Button variant="outline" size="full" onClick={() => setStep('selection')}>Ganti Metode/Nominal</Button>
            </div>
            
            <div className="p-4 bg-white border border-gray-100 rounded-2xl w-full">
              <h4 className="text-[10px] font-black text-gray-400 uppercase mb-3 tracking-widest">Cara Pembayaran</h4>
              <ul className="space-y-2">
                {[
                  "Pilih menu Transfer > Virtual Account.",
                  `Masukkan nomor VA: ${token}`,
                  "Konfirmasi nominal pembayaran.",
                  "Minimal top up adalah Rp 10.000.",
                  "Selesai! Saldo akan bertambah otomatis."
                ].map((text, i) => (
                  <li key={i} className="flex gap-3 text-[10px] font-bold text-gray-600">
                    <span className="text-[#003A8F]">{i+1}.</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        {step === 'success' && completedTransaction && (
           <motion.div
             key="success"
             initial={{ scale: 0.5, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="flex flex-col items-center py-6"
           >
              <div className="mb-6 w-full">
                <ReceiptCard 
                  transaction={completedTransaction} 
                />
              </div>

              <div className="flex flex-col gap-3 w-full mt-4">
                 <Button size="full" onClick={() => setScreen('home')}>Kembali ke Beranda</Button>
                 <Button size="full" variant="outline" onClick={() => setStep('selection')}>Isi Saldo Lagi</Button>
              </div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
