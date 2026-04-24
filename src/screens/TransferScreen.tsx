import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Send, CheckCircle2, XCircle, Search, User as UserIcon, Building2, Zap, ChevronRight, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button, Input, Card } from '../components/UI';
import { formatRupiah } from '../utils/format';
import { ReceiptCard } from '../components/ReceiptCard';
import confetti from 'canvas-confetti';
import { Transaction } from '../types';

type TransferMethod = 'payraya' | 'bank' | 'bifast';

const BANKS = [
  { id: 'bca', name: 'BCA', code: '014', color: '#0060AF', initials: 'BCA' },
  { id: 'mandiri', name: 'Mandiri', code: '008', color: '#003A8F', initials: 'mandiri' },
  { id: 'bni', name: 'BNI', code: '009', color: '#FF6600', initials: 'BNI' },
  { id: 'bri', name: 'BRI', code: '002', color: '#00529C', initials: 'BRI' },
  { id: 'cimb', name: 'CIMB Niaga', code: '022', color: '#E31E24', initials: 'CIMB' },
  { id: 'permata', name: 'Permata Bank', code: '013', color: '#88B04B', initials: 'Permata' },
  { id: 'danamon', name: 'Danamon', code: '011', color: '#F37021', initials: 'Danamon' },
  { id: 'btpn', name: 'BTPN / Jenius', code: '213', color: '#00AEEF', initials: 'Jenius' },
];

export const TransferScreen: React.FC = () => {
  const { user, setScreen, addTransaction, transferPayRaya, findUserByPhone } = useApp();
  const [step, setStep] = useState<'method' | 'bank_select' | 'input' | 'confirm' | 'pin' | 'success' | 'failed'>('method');
  const [method, setMethod] = useState<TransferMethod>('payraya');
  const [selectedBank, setSelectedBank] = useState<typeof BANKS[0] | null>(null);
  const [recipient, setRecipient] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [completedTransaction, setCompletedTransaction] = useState<Transaction | null>(null);
  const [bankSearch, setBankSearch] = useState('');

  const handleNext = () => {
    if (!recipient || !amount || (method !== 'payraya' && !recipientName)) {
      setError('Mohon isi semua data yang diperlukan');
      return;
    }
    const numAmount = parseInt(amount);
    if (isNaN(numAmount) || numAmount <= 10000) {
      setError('Nominal minimal Rp 10.000');
      return;
    }
    
    // Calculate total including fee
    const fee = method === 'bank' ? 6500 : (method === 'bifast' ? 2500 : 0);
    const total = numAmount + fee;

    if (total > (user?.balance || 0)) {
      setStep('failed');
      return;
    }

    if (method === 'payraya') {
      const foundUser = findUserByPhone(recipient);
      if (foundUser) {
        setRecipientName(foundUser.name);
      } else {
        setRecipientName(''); // Reset if invalid or not found to avoid carryover
      }
    }

    setError('');
    setStep('confirm');
  };

  const handleConfirm = () => {
    setStep('pin');
  };

  const handlePinSubmit = async () => {
    if (pin === (user?.pin || '123456')) {
      const fee = method === 'bank' ? 6500 : (method === 'bifast' ? 2500 : 0);
      const totalAmount = parseInt(amount);
      
      let tx: Transaction;
      
      if (method === 'payraya') {
        tx = await transferPayRaya(recipient, totalAmount, note);
      } else {
        tx = await addTransaction({
          type: 'transfer',
          amount: totalAmount + fee,
          title: `Transfer ${method.toUpperCase()} ke ${selectedBank?.name} - ${recipient}`,
          category: 'Transfer',
          bankName: selectedBank?.name,
          accountNumber: recipient,
          recipientName: recipientName,
          senderName: user?.name || 'User Handal',
          senderAccountNumber: user?.phone || '887654321098',
          status: 'success',
          note
        });
      }
      
      setCompletedTransaction(tx);
      setStep('success');
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#003A8F', '#FBBF24', '#10B981']
      });
    } else {
      setError('PIN Salah, silakan coba lagi');
      setPin('');
    }
  };

  const transferMethods = [
    { id: 'payraya', title: 'Sesama PayRaya', icon: UserIcon, desc: 'Bebas biaya admin & instan', color: 'bg-blue-50 text-blue-600' },
    { id: 'bifast', title: 'BI-FAST', icon: Zap, desc: 'Hanya Rp 2.500, semua bank', color: 'bg-yellow-50 text-yellow-600' },
    { id: 'bank', title: 'Antar Bank', icon: Building2, desc: 'Rp 6.500, real-time online', color: 'bg-indigo-50 text-indigo-600' },
  ];

  const adminFee = method === 'bank' ? 6500 : (method === 'bifast' ? 2500 : 0);

  return (
    <div className="pb-24 pt-6 px-5 flex flex-col min-h-screen bg-[#F5F7FA]">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => {
            if (step === 'method') setScreen('home');
            else if (step === 'bank_select') setStep('method');
            else if (step === 'input') setStep(method === 'payraya' ? 'method' : 'bank_select');
            else if (step === 'confirm') setStep('input');
            else setScreen('home');
          }} 
          className="p-2 bg-white rounded-lg shadow-sm"
        >
          <ArrowLeft size={20} className="text-[#003A8F]" />
        </button>
        <h1 className="text-xl font-bold text-[#003A8F]">
          {step === 'method' ? 'Pilih Metode Transfer' : 'Transfer'}
        </h1>
      </div>

      <AnimatePresence mode="wait">
        {step === 'method' && (
          <motion.div
            key="method"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col gap-4"
          >
            {transferMethods.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setMethod(m.id as TransferMethod);
                  if (m.id === 'payraya') {
                    setSelectedBank(null);
                    setStep('input');
                  } else {
                    setStep('bank_select');
                  }
                }}
                className="group bg-white p-5 rounded-[24px] shadow-sm border-2 border-transparent hover:border-blue-100 hover:shadow-md flex items-center gap-4 text-left active:scale-[0.98] transition-all"
              >
                <div className={`w-14 h-14 ${m.color} rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform`}>
                  <m.icon size={28} strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-[15px] text-gray-800 tracking-tight">{m.title}</h4>
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wide mt-0.5">{m.desc}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#003A8F] group-hover:text-white transition-colors">
                  <ChevronRight size={20} className="transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>
            ))}

            {/* Admin Fee Information Section */}
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.3 }}
               className="mt-4 p-5 bg-blue-50/50 rounded-2xl border border-blue-100/50"
            >
               <div className="flex items-center gap-2 mb-4">
                  <Info size={18} className="text-[#003A8F]" />
                  <h3 className="text-sm font-bold text-[#003A8F]">Informasi Biaya & Limit</h3>
               </div>
               <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs">
                     <span className="text-gray-500 font-medium">Sesama PayRaya</span>
                     <div className="text-right">
                        <span className="text-green-600 font-black block uppercase">Gratis</span>
                        <span className="text-[10px] text-gray-400">Instan • Limit 50jt/hari</span>
                     </div>
                  </div>
                  <div className="w-full h-px bg-gray-100"></div>
                  <div className="flex justify-between items-center text-xs">
                     <span className="text-gray-500 font-medium">BI-FAST</span>
                     <div className="text-right">
                        <span className="text-gray-700 font-black block">Rp 2.500</span>
                        <span className="text-[10px] text-gray-400">1-5 Menit • Limit 250jt/hari</span>
                     </div>
                  </div>
                  <div className="w-full h-px bg-gray-100"></div>
                  <div className="flex justify-between items-center text-xs">
                     <span className="text-gray-500 font-medium">Real-time Online</span>
                     <div className="text-right">
                        <span className="text-gray-700 font-black block">Rp 6.500</span>
                        <span className="text-[10px] text-gray-400">Instan • Limit 25jt/transaksi</span>
                     </div>
                  </div>
               </div>
               <div className="mt-5 p-3 bg-white/50 rounded-xl">
                  <p className="text-[10px] text-gray-400 leading-relaxed italic">
                     * Biaya administrasi akan langsung memotong saldo utama Anda. Pastikan saldo mencukupi sebelum melakukan konfirmasi transfer.
                  </p>
               </div>
            </motion.div>
          </motion.div>
        )}

        {step === 'bank_select' && (
           <motion.div
             key="bank_select"
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: -20 }}
             className="flex flex-col gap-4"
           >
              <div className="flex flex-col gap-4 px-1">
                <h3 className="text-sm font-bold text-gray-500">Pilih Bank Tujuan</h3>
                <div className="relative">
                  <Input
                    placeholder="Cari nama bank..."
                    value={bankSearch}
                    onChange={(e) => setBankSearch(e.target.value)}
                    icon={<Search size={18} className="text-gray-400" />}
                    className="bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                 {BANKS.filter(bank => 
                   bank.name.toLowerCase().includes(bankSearch.toLowerCase())
                 ).map(bank => (
                   <button
                     key={bank.id}
                     onClick={() => {
                       setSelectedBank(bank);
                       setStep('input');
                       setBankSearch('');
                     }}
                     className="bg-white p-5 rounded-[24px] shadow-sm border-2 border-transparent hover:border-blue-100 hover:shadow-md flex items-center justify-between active:scale-[0.99] transition-all group overflow-hidden"
                   >
                     <div className="flex items-center gap-4">
                        <div 
                          style={{ backgroundColor: bank.color }}
                          className="w-12 h-12 rounded-[14px] flex items-center justify-center font-black text-white text-[11px] shadow-sm italic tracking-tighter group-hover:scale-110 transition-transform"
                        >
                           {bank.initials}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-gray-800 tracking-tight">{bank.name}</span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Bank Tujuan</span>
                        </div>
                     </div>
                     <div className="flex flex-col items-end">
                       <ChevronRight size={18} className="text-gray-300 group-hover:text-[#003A8F] group-hover:translate-x-1 transition-all" />
                       <span className="text-[9px] font-black text-gray-300 mt-1 uppercase tracking-tighter">KODE: {bank.code}</span>
                     </div>
                   </button>
                 ))}
                 {BANKS.filter(bank => 
                   bank.name.toLowerCase().includes(bankSearch.toLowerCase())
                 ).length === 0 && (
                   <div className="text-center py-10">
                     <p className="text-sm text-gray-400 font-medium">Bank tidak ditemukan</p>
                   </div>
                 )}
              </div>
           </motion.div>
        )}

        {step === 'input' && (
          <motion.div
            key="input"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="flex flex-col gap-6"
          >
            <Card>
               {selectedBank && (
                 <div className="flex items-center gap-3 mb-6 p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <div 
                      style={{ backgroundColor: selectedBank.color }}
                      className="w-8 h-8 rounded flex items-center justify-center font-bold text-white text-[8px] italic"
                    >
                      {selectedBank.initials}
                    </div>
                    <span className="text-sm font-bold text-[#003A8F]">Bank {selectedBank.name}</span>
                 </div>
               )}
               <Input
                  label={method === 'payraya' ? "Nomor Handphone Terdaftar" : (method === 'bifast' ? "Proxy ID (HP/Email) / No. Rek" : "Nomor Rekening")}
                  placeholder={method === 'payraya' ? "Contoh: 08123456789" : "Masukkan nomor tujuan"}
                  icon={<Search size={20} />}
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  error={error && !recipient ? error : ''}
               />
               
               {method !== 'payraya' && (
                 <motion.div
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: 'auto' }}
                   className="mt-4"
                 >
                   <Input
                      label="Nama Penerima"
                      placeholder="Masukkan nama lengkap penerima"
                      icon={<UserIcon size={20} />}
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      error={error && !recipientName ? 'Nama penerima wajib diisi' : ''}
                   />
                 </motion.div>
               )}

               <div className="mt-4">
                  <Input
                    label="Nominal Transfer"
                    type="number"
                    placeholder="Minimal Rp 10.000"
                    icon={<Send size={20} />}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
                    error={error && amount ? error : ''}
                  />
                  <div className="flex gap-2 mt-3">
                    {[50000, 100000, 500000].map(val => (
                      <button 
                        key={val}
                        onClick={() => setAmount(val.toString())}
                        className="px-4 py-2 bg-blue-50 text-[#003A8F] text-[11px] font-bold rounded-xl border border-blue-100"
                      >
                        {val/1000}rb
                      </button>
                    ))}
                  </div>
               </div>
               <Input
                  label="Catatan (Opsional)"
                  placeholder="Keterangan transaksi"
                  className="mt-6"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
               />
            </Card>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#f0f0f0] mt-2">
               <div className="flex justify-between items-center text-sm font-bold text-gray-500 mb-2">
                  <span>Saldo Tersedia</span>
                  <span className="text-[#003A8F]">{formatRupiah(user?.balance || 0)}</span>
               </div>
               <div className="flex justify-between items-center text-xs font-medium text-gray-400">
                  <span>Estimasi Biaya Admin</span>
                  <span>{adminFee === 0 ? 'GRATIS' : formatRupiah(adminFee)}</span>
               </div>
            </div>

            <Button size="full" onClick={handleNext} className="mt-4">
               Lanjutkan
            </Button>
          </motion.div>
        )}

        {step === 'confirm' && (
          <motion.div
            key="confirm"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="flex flex-col gap-6"
          >
            <div className="text-center mb-2">
               <h2 className="text-xl font-black text-[#003A8F]">Konfirmasi Transfer</h2>
               <p className="text-xs text-gray-500 font-medium">Periksa kembali detail transaksi Anda</p>
            </div>

            <Card className="flex flex-col items-center py-8">
               <div className="w-16 h-16 bg-blue-50 text-[#003A8F] rounded-full flex items-center justify-center mb-4">
                  {selectedBank ? <Building2 size={32} /> : <UserIcon size={32} />}
               </div>
               
               <h3 className="font-black text-lg text-gray-800 text-center uppercase tracking-tight">
                 {method === 'payraya' ? (recipientName || 'Nasabah PayRaya') : recipientName}
               </h3>
               <p className="text-[#003A8F] text-sm font-mono font-bold mt-1">
                 {recipient}
               </p>
               <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-2">
                 {selectedBank ? selectedBank.name : 'PayRaya Wallet'}
               </span>
               
               <div className="w-full h-px bg-gray-100 my-8"></div>
               
               <div className="w-full flex flex-col gap-5">
                  <div className="flex justify-between text-sm items-center border-b border-dashed border-gray-100 pb-4 mb-1">
                    <span className="text-gray-400 font-bold uppercase text-[10px]">Dari</span>
                    <div className="text-right">
                       <p className="font-bold text-gray-800">{user?.name}</p>
                       <p className="text-[10px] text-gray-400 font-mono">{user?.phone}</p>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-gray-400 font-bold uppercase text-[10px]">Tujuan</span>
                    <span className="font-bold text-gray-700">{method === 'payraya' ? 'Saluran PayRaya' : (method === 'bifast' ? 'BI-FAST Transfer' : 'Online Transfer')}</span>
                  </div>
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-gray-400 font-bold uppercase text-[10px]">Nominal Transfer</span>
                    <span className="font-black text-gray-800">{formatRupiah(parseInt(amount))}</span>
                  </div>
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-gray-400 font-bold uppercase text-[10px]">Biaya Admin</span>
                    <span className={`font-black ${adminFee === 0 ? 'text-green-600' : 'text-gray-800'}`}>
                      {adminFee === 0 ? 'GRATIS' : formatRupiah(adminFee)}
                    </span>
                  </div>
                  {note && (
                    <div className="flex justify-between text-sm items-start border-t border-dashed border-gray-100 pt-4">
                      <span className="text-gray-400 font-bold uppercase text-[10px]">Catatan</span>
                      <span className="text-gray-700 font-medium italic text-right max-w-[150px]">{note}</span>
                    </div>
                  )}
               </div>

               <div className="w-full h-px bg-gray-100 my-8"></div>

               <div className="w-full flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                  <span className="font-bold text-gray-400 uppercase text-[11px]">Total Bayar</span>
                  <span className="font-black text-2xl text-[#003A8F]">{formatRupiah(parseInt(amount) + adminFee)}</span>
               </div>
            </Card>

            <div className="flex flex-col gap-3 mt-2">
               <Button size="full" onClick={handleConfirm} className="bg-[#003A8F] h-14 text-base">
                 Konfirmasi Transfer
               </Button>
               <Button variant="ghost" size="full" onClick={() => setStep('input')} className="text-gray-400 font-bold h-12">
                 Batalkan
               </Button>
            </div>
          </motion.div>
        )}

        {step === 'pin' && (
           <motion.div
             key="pin"
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="flex flex-col items-center pt-10"
           >
              <h2 className="text-xl font-bold text-[#003A8F] mb-2 text-center">Konfirmasi PIN</h2>
              <p className="text-gray-500 text-sm mb-10 text-center">Masukkan 6 digit PIN untuk keamanan transaksi</p>
              
              <div className="flex gap-3 mb-10">
                 {[...Array(6)].map((_, i) => (
                   <div key={i} className={`w-12 h-14 border-2 rounded-xl flex items-center justify-center text-2xl font-bold ${
                     pin.length > i ? 'border-[#003A8F] bg-blue-50 text-[#003A8F]' : 'border-gray-200'
                   }`}>
                      {pin.length > i ? '•' : ''}
                   </div>
                 ))}
              </div>

              {error && <p className="text-sm text-red-500 font-bold mb-6">{error}</p>}

              <div className="grid grid-cols-3 gap-x-12 gap-y-6 w-full max-w-[280px]">
                 {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, 'OK'].map(num => (
                   <button
                     key={num}
                     onClick={() => {
                       if (num === 'C') setPin(pin.slice(0, -1));
                       else if (num === 'OK') handlePinSubmit();
                       else if (pin.length < 6) setPin(pin + num);
                     }}
                     className="w-14 h-14 rounded-full flex items-center justify-center font-black text-xl text-[#003A8F] hover:bg-blue-50 active:scale-90 transition-all font-sans"
                   >
                      {num}
                   </button>
                 ))}
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
                 <Button size="full" variant="outline" onClick={() => {
                    setRecipient('');
                    setAmount('');
                    setNote('');
                    setPin('');
                    setStep('method');
                 }}>Transfer Baru</Button>
              </div>
           </motion.div>
        )}

        {step === 'failed' && (
           <motion.div
             key="failed"
             initial={{ scale: 0.5, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="flex flex-col items-center py-10"
           >
              <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                 <XCircle size={64} />
              </div>
              <h1 className="text-2xl font-black text-red-600 mb-2 text-center">Saldo Tidak Cukup</h1>
              <p className="text-gray-500 text-center mb-10 font-medium">Dana di rekening Anda tidak memadai untuk transaksi ini (termasuk biaya admin).</p>
              
              <Card className="w-full flex justify-between items-center py-5">
                 <span className="text-gray-500 font-bold">Saldo Anda</span>
                 <span className="font-black text-red-600">{formatRupiah(user?.balance || 0)}</span>
              </Card>

              <div className="flex flex-col gap-4 w-full mt-10">
                 <Button size="full" onClick={() => setStep('method')}>Ganti Metode/Nominal</Button>
                 <Button size="full" variant="outline" onClick={() => setScreen('topup')}>Top Up Saldo</Button>
              </div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

