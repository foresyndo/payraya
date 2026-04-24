import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  PiggyBank, 
  Smartphone, 
  Clock, 
  PlusCircle, 
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Zap,
  Globe,
  Barcode,
  Store,
  MapPin
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, Button } from '../components/UI';
import { formatRupiah } from '../utils/format';
import Barcode1D from 'react-barcode';
import confetti from 'canvas-confetti';

const ScreenHeader: React.FC<{ title: string; onBack: () => void }> = ({ title, onBack }) => (
  <div className="flex items-center gap-4 mb-8">
    <button onClick={onBack} className="p-2 bg-white rounded-lg shadow-sm border border-[#f0f0f0]">
      <ArrowLeft size={20} className="text-[#003A8F]" />
    </button>
    <h1 className="text-xl font-bold text-[#003A8F]">{title}</h1>
  </div>
);

export const DepositoScreen: React.FC = () => {
  const { setScreen } = useApp();

  return (
    <div className="pb-24 pt-6 px-5 flex flex-col min-h-screen bg-[#f0f2f5]">
      <ScreenHeader title="Deposito" onBack={() => setScreen('home')} />
      
      <Card className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white border-none p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-white/70 text-xs font-bold uppercase tracking-widest">Suku Bunga Hingga</span>
            <h2 className="text-4xl font-black mt-1">6.0% <span className="text-lg font-medium">p.a</span></h2>
          </div>
          <PiggyBank size={40} className="text-white/30" />
        </div>
        <p className="text-xs text-white/80 mt-4 leading-relaxed font-medium">
          Simpanan masa depan dengan bunga kompetitif dan pencairan fleksibel.
        </p>
      </Card>

      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-bold text-[#333]">Pilihan Deposito</h3>
        {[
          { label: 'Deposito Berjangka 3 Bulan', rate: '4.5%', min: 1000000 },
          { label: 'Deposito Berjangka 6 Bulan', rate: '5.2%', min: 5000000 },
          { label: 'Deposito Berjangka 12 Bulan', rate: '6.0%', min: 10000000 },
        ].map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="flex items-center justify-between p-4">
              <div>
                <h4 className="text-sm font-bold text-gray-800">{item.label}</h4>
                <p className="text-xs text-gray-400 mt-1">Minimal {formatRupiah(item.min)}</p>
              </div>
              <div className="text-right">
                <span className="text-green-600 font-black text-sm">{item.rate}</span>
                <ChevronRight size={16} className="text-gray-300 ml-auto mt-1" />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Button size="full" className="mt-auto mb-4">Buka Deposito Baru</Button>
    </div>
  );
};

export const EMoneyScreen: React.FC = () => {
  const { setScreen } = useApp();
  const [activeTab, setActiveTab ] = React.useState<'kartu' | 'riwayat'>('kartu');
  const [scanState, setScanState] = React.useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = React.useState('');

  const cardHistory = [
    { id: '1', merchant: 'GTO Pondok Ranji', category: 'Tol', amount: 10500, time: 'Tadi, ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) },
    { id: '2', merchant: 'Alfamart', category: 'Retail', amount: 25400, time: 'Kemarin, 19:20' },
    { id: '3', merchant: 'MRT Jakarta', category: 'Transport', amount: 8000, time: '17 Apr, 17:10' },
  ];

  const handleScan = () => {
    setScanState('scanning');
    setErrorMessage('');
    
    // Simulate NFC Interaction
    setTimeout(() => {
      const isSuccess = Math.random() > 0.3; // 70% success rate
      if (isSuccess) {
        setScanState('success');
        // Visual haptic cue: Vibration API (if supported)
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          try { navigator.vibrate([100, 50, 100]); } catch (e) {}
        }
        setTimeout(() => setScanState('idle'), 2500);
      } else {
        setScanState('failed');
        const errors = [
          'Kartu tidak terbaca. Pastikan kartu menempel di area NFC ponsel Anda.',
          'Koneksi NFC terputus. Silakan tempelkan kartu kembali.',
          'Terdeteksi lebih dari satu kartu. Pastikan hanya satu kartu yang terbaca.'
        ];
        setErrorMessage(errors[Math.floor(Math.random() * errors.length)]);
        setTimeout(() => setScanState('idle'), 4000);
      }
    }, 2000);
  };

  return (
    <div className="pb-24 pt-6 px-5 flex flex-col min-h-screen bg-[#f0f2f5]">
      <ScreenHeader title="E-Money Reader" onBack={() => setScreen('home')} />
      
      <div className="flex flex-col gap-6">
        {/* NFC Card Visualization */}
        <motion.div
           initial={{ scale: 0.9, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="relative"
        >
          <Card className="p-0 overflow-hidden border-none shadow-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white min-h-[220px] relative group">
             <div className="absolute top-0 right-0 p-6 opacity-30 group-hover:scale-110 transition-transform duration-700">
                <Smartphone size={120} strokeWidth={1} />
             </div>
             
             <div className="p-6 relative z-10 flex flex-col h-full justify-between min-h-[220px]">
                <div className="flex justify-between items-start">
                   <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                         <div className="w-6 h-6 bg-white/20 rounded-md backdrop-blur-md flex items-center justify-center">
                            <Zap size={14} className="text-white" />
                         </div>
                         <span className="text-[10px] font-black tracking-widest text-white/90">E-MONEY</span>
                      </div>
                      <p className="text-[9px] font-bold text-white/60 mt-4 uppercase tracking-widest">Saldo Kartu</p>
                      <h2 className="text-3xl font-black mt-1">Rp 75.400</h2>
                   </div>
                   <div className="text-right">
                      <div className="bg-white/10 backdrop-blur-md px-2 py-1 rounded text-[8px] font-black border border-white/20">AKTIF</div>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-7 bg-gradient-to-br from-amber-200 to-amber-500 rounded-sm shadow-inner"></div>
                      <span className="text-sm font-mono tracking-widest text-white/80">6012 **** **** 9012</span>
                   </div>
                   <div className="flex justify-between items-end">
                      <div>
                         <p className="text-[8px] text-white/40 font-bold uppercase">Masa Berlaku</p>
                         <p className="text-xs font-bold">12/28</p>
                      </div>
                      <div className="flex -space-x-2">
                         <div className="w-6 h-6 bg-red-500 rounded-full opacity-80"></div>
                         <div className="w-6 h-6 bg-amber-500 rounded-full opacity-80"></div>
                      </div>
                   </div>
                </div>
             </div>

             {/* Scanning/Result Animation Overlay */}
             <AnimatePresence>
                {scanState !== 'idle' && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`absolute inset-0 z-20 flex flex-col items-center justify-center backdrop-blur-md transition-colors duration-500 ${
                      scanState === 'scanning' ? 'bg-blue-900/60' :
                      scanState === 'success' ? 'bg-green-600/80' :
                      'bg-red-600/80'
                    }`}
                  >
                     <motion.div 
                       initial={{ scale: 0.5, opacity: 0 }}
                       animate={{ 
                         scale: scanState === 'scanning' ? [1, 1.1, 1] : 1, 
                         opacity: 1,
                         x: scanState === 'failed' ? [0, -10, 10, -10, 10, 0] : 0
                       }}
                       transition={
                         scanState === 'scanning' ? { repeat: Infinity, duration: 1 } : 
                         scanState === 'failed' ? { duration: 0.4 } : 
                         { type: 'spring', damping: 10, stiffness: 100 }
                       }
                       className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 border-4 ${
                         scanState === 'scanning' ? 'border-cyan-400' : 'border-white'
                       }`}
                     >
                        {scanState === 'scanning' && <Zap size={40} className="text-cyan-400" />}
                        {scanState === 'success' && <CheckCircle size={48} className="text-white" />}
                        {scanState === 'failed' && <XCircle size={48} className="text-white" />}
                     </motion.div>
                     
                     <div className="text-center px-10">
                        <p className="text-sm font-black text-white tracking-[0.1em] uppercase mb-1 drop-shadow-md">
                          {scanState === 'scanning' && 'MEMBACA KARTU...'}
                          {scanState === 'success' && 'PEMBACAAN BERHASIL'}
                          {scanState === 'failed' && 'PEMBACAAN GAGAL'}
                        </p>
                        
                        {scanState === 'failed' && (
                          <motion.p 
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-[11px] text-white/90 font-bold leading-relaxed max-w-[200px] mx-auto drop-shadow-md"
                          >
                            {errorMessage}
                          </motion.p>
                        )}
                        
                        {scanState === 'success' && (
                           <motion.p 
                             initial={{ y: 10, opacity: 0 }}
                             animate={{ y: 0, opacity: 1 }}
                             className="text-white text-xs font-bold drop-shadow-md"
                           >
                              Saldo berhasil diperbarui
                           </motion.p>
                        )}
                     </div>
                  </motion.div>
                )}
             </AnimatePresence>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
           <button 
             onClick={handleScan}
             className="bg-white rounded-2xl p-4 shadow-btn border border-[#f0f0f0] flex flex-col items-center gap-3 active:scale-95 transition-all"
           >
              <div className="w-12 h-12 bg-cyan-50 text-cyan-500 rounded-2xl flex items-center justify-center shadow-inner">
                 <Smartphone size={24} />
              </div>
              <span className="text-xs font-bold text-gray-700">Scan kartu</span>
           </button>
           <button 
             onClick={() => setScreen('topup')}
             className="bg-white rounded-2xl p-4 shadow-btn border border-[#f0f0f0] flex flex-col items-center gap-3 active:scale-95 transition-all"
           >
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-inner">
                 <PlusCircle size={24} />
              </div>
              <span className="text-xs font-bold text-gray-700">Isi Saldo</span>
           </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-[#f0f0f0]">
           <button 
             onClick={() => setActiveTab('kartu')}
             className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${activeTab === 'kartu' ? 'bg-[#003A8F] text-white' : 'text-gray-400'}`}
           >
              KATEGORI
           </button>
           <button 
             onClick={() => setActiveTab('riwayat')}
             className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${activeTab === 'riwayat' ? 'bg-[#003A8F] text-white' : 'text-gray-400'}`}
           >
              RIWAYAT
           </button>
        </div>

        {activeTab === 'kartu' ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4"
          >
             <h3 className="text-sm font-bold text-[#333] px-1">Gunakan Di Mana Saja</h3>
             <div className="bg-white rounded-[24px] p-6 grid grid-cols-3 gap-6 shadow-btn border border-[#f0f0f0]">
                {[
                  { name: 'Tol', color: 'bg-blue-50 text-blue-600' },
                  { name: 'Parkir', color: 'bg-orange-50 text-orange-600' },
                  { name: 'Bus', color: 'bg-red-50 text-red-600' },
                  { name: 'MRT', color: 'bg-indigo-50 text-indigo-600' },
                  { name: 'Kantin', color: 'bg-green-50 text-green-600' },
                  { name: 'Retail', color: 'bg-yellow-50 text-yellow-600' },
                ].map(cat => (
                  <div key={cat.name} className="flex flex-col items-center gap-2 cursor-pointer group">
                     <div className={`w-14 h-14 ${cat.color} rounded-2xl flex items-center justify-center group-active:scale-90 transition-transform`}>
                        <span className="text-[10px] font-black">{cat.name.toUpperCase()}</span>
                     </div>
                  </div>
                ))}
             </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-3"
          >
             {cardHistory.map((item, idx) => (
               <motion.div
                 key={item.id}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: idx * 0.1 }}
               >
                 <Card className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-[#f4f6f9] rounded-xl flex items-center justify-center text-[#003A8F]">
                          <Smartphone size={20} />
                       </div>
                       <div>
                          <h4 className="text-sm font-bold text-gray-800">{item.merchant}</h4>
                          <span className="text-[10px] font-bold text-gray-400">{item.category} • {item.time}</span>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-black text-gray-800">-{formatRupiah(item.amount)}</p>
                       <span className="text-[9px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full mt-1 inline-block">BERHASIL</span>
                    </div>
                 </Card>
               </motion.div>
             ))}
             <div className="py-8 text-center opacity-20">
                <p className="text-[10px] font-bold italic">Geser ke bawah untuk melihat riwayat lengkap</p>
             </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export const PaylaterScreen: React.FC = () => {
  const { user, activatePaylater, setScreen } = useApp();
  const [activeTab, setActiveTab] = React.useState<'ringkasan' | 'transaksi'>('ringkasan');

  if (!user?.isPaylaterActive) {
    return (
      <div className="pb-24 pt-6 px-5 flex flex-col min-h-screen bg-[#f0f2f5]">
        <ScreenHeader title="Aktifkan Paylater" onBack={() => setScreen('home')} />
        
        <div className="flex flex-col gap-8 items-center justify-center flex-1 py-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mb-6"
          >
            <Zap size={48} className="text-amber-500" />
          </motion.div>
          
          <div className="text-center px-4">
            <h2 className="text-2xl font-black text-[#003A8F] mb-4">Aktifkan PayRaya Paylater Sekarang!</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Dapatkan limit hingga <span className="font-bold text-gray-800">Rp 15.000.000</span> untuk belanja apa saja. Beli sekarang, bayar nanti dengan bunga 0%!
            </p>
          </div>

          <div className="w-full space-y-4 mt-4">
            <Card className="flex items-center gap-4 p-4 border-amber-100 bg-amber-50/30">
               <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center shrink-0">
                  <Globe size={18} className="text-black" />
               </div>
               <p className="text-[11px] font-bold text-gray-700">Dapat digunakan di 1000+ Merchant Online & Offline</p>
            </Card>
            <Card className="flex items-center gap-4 p-4 border-blue-100 bg-blue-50/30">
               <div className="w-8 h-8 bg-[#003A8F] rounded-lg flex items-center justify-center shrink-0">
                  <ShieldCheck size={18} className="text-white" />
               </div>
               <p className="text-[11px] font-bold text-gray-700">Proses aktivasi aman & cepat hanya dalam 2 menit</p>
            </Card>
          </div>

          <Button 
            size="full" 
            variant="secondary" 
            className="mt-8 shadow-xl shadow-amber-200"
            onClick={activatePaylater}
          >
            Aktivasi Sekarang
          </Button>
          
          <p className="text-[10px] text-gray-400 text-center font-medium mt-4">
            Terdaftar & diawasi oleh Otoritas Jasa Keuangan (OJK)
          </p>
        </div>
      </div>
    );
  }

  const history = [
    { id: '1', store: 'Tiket.com', date: '18 Apr 2026', amount: 1250000, status: 'Cicilan 3x' },
    { id: '2', store: 'Tokopedia', date: '15 Apr 2026', amount: 450000, status: 'Lunas' },
    { id: '3', store: 'Indomaret', date: '12 Apr 2026', amount: 85000, status: 'Lunas' },
  ];

  return (
    <div className="pb-24 pt-6 px-5 flex flex-col min-h-screen bg-[#f0f2f5]">
      <ScreenHeader title="PayRaya Paylater" onBack={() => setScreen('home')} />
      
      <div className="flex flex-col gap-6">
        {/* Advanced Platinum Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <Card className="p-0 overflow-hidden border-none shadow-2xl bg-gradient-to-br from-[#1a1a1a] via-[#333] to-[#141414] text-white relative">
            <div className="absolute top-0 right-0 p-4 opacity-20">
               <Zap size={100} strokeWidth={1} />
            </div>
            <div className="p-6 relative z-10">
               <div className="flex justify-between items-start mb-10">
                  <div className="flex items-center gap-2">
                     <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center">
                        <Zap size={18} className="text-black" />
                     </div>
                     <span className="text-[11px] font-black tracking-widest text-amber-400">PAYLATER</span>
                  </div>
                  <div className="text-right">
                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Level Akun</span>
                     <p className="text-xs font-black text-amber-400">PLATINUM</p>
                  </div>
               </div>
               
               <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Limit Tersedia</span>
               <h2 className="text-3xl font-black mt-1 mb-6">Rp 15.000.000</h2>
               
               <div className="flex justify-between items-end">
                  <div className="space-y-1">
                     <p className="text-[9px] text-gray-500 font-bold uppercase">Nomor Akun</p>
                     <p className="text-sm font-mono tracking-widest underline decoration-amber-400/30 underline-offset-4">**** **** 8892</p>
                  </div>
                  <div className="w-12 h-8 bg-gradient-to-br from-amber-200 to-amber-500 rounded flex items-center justify-center">
                     <div className="w-4 h-4 bg-black/10 rounded-full"></div>
                  </div>
               </div>
            </div>
            <div className="h-1.5 w-full bg-white/5">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: '70%' }}
                 transition={{ duration: 1, delay: 0.5 }}
                 className="h-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]" 
               />
            </div>
          </Card>
        </motion.div>

        {/* Tab Selector */}
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-[#f0f0f0]">
           <button 
             onClick={() => setActiveTab('ringkasan')}
             className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${activeTab === 'ringkasan' ? 'bg-[#003A8F] text-white shadow-md' : 'text-gray-400'}`}
           >
              RINGKASAN
           </button>
           <button 
             onClick={() => setActiveTab('transaksi')}
             className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${activeTab === 'transaksi' ? 'bg-[#003A8F] text-white shadow-md' : 'text-gray-400'}`}
           >
              TRANSAKSI
           </button>
        </div>

        {activeTab === 'ringkasan' ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-6"
          >
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white rounded-2xl p-5 shadow-btn border border-[#f0f0f0] flex flex-col justify-between h-[100px]">
                  <h4 className="text-[10px] uppercase font-black text-gray-400">Tagihan April</h4>
                  <p className="text-lg font-black text-gray-800">Rp 450.000</p>
                  <span className="text-[9px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full w-fit">BELUM DIBAYAR</span>
               </div>
               <div className="bg-white rounded-2xl p-5 shadow-btn border border-[#f0f0f0] flex flex-col justify-between h-[100px]">
                  <h4 className="text-[10px] uppercase font-black text-gray-400">Jatuh Tempo</h4>
                  <p className="text-lg font-black text-[#003A8F]">25 Apr</p>
                  <div className="flex items-center gap-1 text-[9px] font-bold text-gray-400">
                     <Clock size={10} /> <span>6 Hari Lagi</span>
                  </div>
               </div>
            </div>

            <div className="flex flex-col gap-3">
               <div className="flex justify-between items-center px-1">
                  <h3 className="text-sm font-bold text-[#333]">Keuntungan Anda</h3>
                  <button className="text-[11px] font-bold text-[#003A8F]">Lihat Semua</button>
               </div>
               <Card className="flex items-start gap-4 p-5 hover:border-[#003A8F] transition-colors cursor-pointer group">
                  <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-amber-400 group-hover:text-black transition-colors">
                     <Zap size={20} />
                  </div>
                  <div className="flex-1">
                     <h4 className="text-sm font-bold text-gray-800">Cicilan 0% Merchant Pilihan</h4>
                     <p className="text-xs text-gray-400 mt-1">Belanja di Tokopedia, Shopee, & Traveloka tanpa bunga.</p>
                  </div>
               </Card>
               <Card className="flex items-start gap-4 p-5 hover:border-[#003A8F] transition-colors cursor-pointer group">
                  <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-green-500 group-hover:text-white transition-colors">
                     <ShieldCheck size={20} />
                  </div>
                  <div className="flex-1">
                     <h4 className="text-sm font-bold text-gray-800">Proteksi Tagihan Gratis</h4>
                     <p className="text-xs text-gray-400 mt-1">Asuransi jiwa gratis untuk setiap penggunaan Paylater.</p>
                  </div>
               </Card>
            </div>

            <Button size="full" variant="secondary" className="shadow-lg shadow-amber-200">Bayar Tagihan Sekarang</Button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-4"
          >
             <h3 className="text-sm font-bold text-[#333] px-1">Riwayat Penggunaan</h3>
             <div className="flex flex-col gap-3">
                {history.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="flex items-center justify-between p-4">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-[#f4f6f9] rounded-xl flex items-center justify-center text-[#003A8F]">
                             <Smartphone size={20} />
                          </div>
                          <div>
                             <h4 className="text-sm font-bold text-gray-800">{item.store}</h4>
                             <p className="text-[10px] text-gray-400 mt-0.5">{item.date}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-sm font-black text-gray-800">{formatRupiah(item.amount)}</p>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full mt-1 inline-block ${item.status === 'Lunas' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                             {item.status.toUpperCase()}
                          </span>
                       </div>
                    </Card>
                  </motion.div>
                ))}
             </div>
             <div className="p-8 text-center opacity-20 flex flex-col items-center">
                <Clock size={48} strokeWidth={1} />
                <p className="text-xs font-bold mt-4">Menampilkan riwayat 30 hari terakhir</p>
             </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export const LoanScreen: React.FC = () => {
  const { setScreen } = useApp();
  const [step, setStep] = React.useState<'intro' | 'form' | 'confirm' | 'success'>('intro');
  const [loanAmount, setLoanAmount] = React.useState(5000000);
  const [tenure, setTenure] = React.useState(12); // months

  const quickLoanLimits = [
    5000000, 10000000, 25000000, 50000000
  ];

  const tenures = [3, 6, 12, 24];

  const calculateMonthly = () => {
    const interest = 0.015; // 1.5% per month
    const total = loanAmount + (loanAmount * interest * tenure);
    return Math.round(total / tenure);
  };

  const handleApply = () => {
    setStep('success');
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#EF4444', '#FBBF24', '#10B981']
    });
  };

  return (
    <div className="pb-24 pt-6 px-5 flex flex-col min-h-screen bg-[#f0f2f5]">
      <ScreenHeader 
        title={step === 'intro' ? "Pinjaman" : step === 'form' ? "Pengajuan Kilat" : step === 'confirm' ? "Konfirmasi" : "Berhasil!"} 
        onBack={() => {
          if (step === 'intro') setScreen('home');
          else if (step === 'form') setStep('intro');
          else if (step === 'confirm') setStep('form');
          else setScreen('home');
        }} 
      />
      
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div 
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col gap-6"
          >
            <Card className="p-6 bg-gradient-to-r from-red-600 to-rose-700 text-white border-none relative overflow-hidden">
               <div className="relative z-10">
                  <h3 className="text-sm font-bold opacity-80 uppercase tracking-widest">Pinjaman Instan</h3>
                  <h2 className="text-2xl font-black mt-1">Hingga Rp 100 Juta</h2>
                  <p className="text-xs mt-4 text-white/70 leading-relaxed">
                     Cair kilat dalam 5 menit langsung ke rekening Anda tanpa jaminan. Suku bunga rendah mulai dari 1.5%.
                  </p>
                  <Button variant="secondary" size="sm" className="mt-6" onClick={() => setStep('form')}>Ajukan Sekarang</Button>
               </div>
               <TrendingUp size={120} className="absolute -right-6 -bottom-6 text-white/10" />
            </Card>

            <div className="flex flex-col gap-3">
               <h3 className="text-sm font-bold text-[#333] px-1">Riwayat Pinjaman</h3>
               <div className="flex flex-col items-center justify-center py-12 opacity-30">
                  <PlusCircle size={48} strokeWidth={1.5} />
                  <p className="mt-3 text-sm font-medium">Belum ada pinjaman aktif</p>
               </div>
            </div>

            <Card className="bg-white border-dashed border-2 border-gray-100 flex flex-col gap-2 p-6">
               <h4 className="text-xs font-bold text-gray-400">Simulasi Cicilan</h4>
               <p className="text-[10px] text-gray-500 italic">Gunakan kalkulator kami untuk menghitung perkiraan angsuran bulanan Anda.</p>
               <button onClick={() => setStep('form')} className="text-[#003A8F] text-xs font-black mt-2 flex items-center gap-1">
                  Buka Kalkulator <ChevronRight size={14} />
               </button>
            </Card>
          </motion.div>
        )}

        {step === 'form' && (
          <motion.div 
            key="form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-6"
          >
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest px-1">Pilih Nominal</h3>
              <div className="grid grid-cols-2 gap-3">
                {quickLoanLimits.map(amount => (
                  <button
                    key={amount}
                    onClick={() => setLoanAmount(amount)}
                    className={`py-4 px-4 rounded-2xl font-black text-sm border-2 transition-all ${loanAmount === amount ? 'bg-[#003A8F] border-[#003A8F] text-white shadow-lg shadow-blue-100' : 'bg-white border-white text-gray-700 shadow-sm'}`}
                  >
                    {formatRupiah(amount).replace('Rp', '').trim()}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest px-1">Tenor (Bulan)</h3>
              <div className="flex bg-white p-1 rounded-xl shadow-sm border border-[#f0f0f0]">
                {tenures.map(t => (
                  <button
                    key={t}
                    onClick={() => setTenure(t)}
                    className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${tenure === t ? 'bg-[#003A8F] text-white' : 'text-gray-400'}`}
                  >
                    {t} Bln
                  </button>
                ))}
              </div>
            </div>

            <Card className="bg-blue-50 border-blue-100 p-6 flex flex-col gap-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Estimasi Angsuran</span>
                <span className="font-black text-xl text-[#003A8F]">{formatRupiah(calculateMonthly())}/bln</span>
              </div>
              <div className="w-full h-px bg-blue-100"></div>
              <p className="text-[10px] text-blue-400 leading-relaxed italic">
                * Estimasi sudah termasuk bunga 1.5% per bulan. Sifat simulasi tidak mengikat.
              </p>
            </Card>

            <Button size="full" onClick={() => setStep('confirm')} className="mt-4">Lanjutkan Ke Konfirmasi</Button>
          </motion.div>
        )}

        {step === 'confirm' && (
          <motion.div 
            key="confirm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-6"
          >
            <Card className="p-8 border-none shadow-xl bg-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>
              <h3 className="text-center font-black text-gray-800 text-lg mb-8 uppercase tracking-[0.2em]">Ringkasan Pinjaman</h3>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-bold uppercase text-[10px]">Tipe Pinjaman</span>
                  <span className="font-bold text-red-600">PINJAMAN KILAT</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-bold uppercase text-[10px]">Nominal Cair</span>
                  <span className="font-black text-gray-800">{formatRupiah(loanAmount)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-bold uppercase text-[10px]">Tenor</span>
                  <span className="font-bold text-gray-800">{tenure} Bulan</span>
                </div>
                <div className="w-full h-px bg-gray-100 border-dashed border-t"></div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-bold uppercase text-[10px]">Total Angsuran</span>
                  <span className="font-black text-xl text-red-600">{formatRupiah(calculateMonthly())}</span>
                </div>
              </div>

              <div className="mt-10 p-4 bg-gray-50 rounded-xl border border-gray-100 italic text-[10px] text-gray-400 leading-relaxed">
                Dengan menekan tombol setuju, saya menyetujui syarat dan ketentuan yang berlaku mengenai pengajuan pinjaman PayRaya.
              </div>
            </Card>

            <Button size="full" className="bg-red-600 shadow-lg shadow-red-100" onClick={handleApply}>Setujui & Ajukan</Button>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-green-100 animate-bounce">
              <CheckCircle size={48} />
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-2">Pengajuan Berhasil!</h2>
            <p className="text-sm text-gray-500 px-10 leading-relaxed mb-10">
              Tim analis kami sedang memverifikasi data Anda. Dana akan cair maksimal dalam 15 menit ke saldo utama.
            </p>
            <div className="w-full space-y-3">
              <Button size="full" onClick={() => setScreen('home')}>Kembali ke Beranda</Button>
              <Button size="full" variant="outline" onClick={() => setScreen('history')}>Lihat Status Pengajuan</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const WithdrawScreen: React.FC = () => {
  const { user, setScreen, addTransaction } = useApp();
  const [step, setStep] = React.useState<'method' | 'amount' | 'token'>('method');
  const [method, setMethod] = React.useState<'atm' | 'retail'>('atm');
  const [amount, setAmount] = React.useState(0);
  const [token, setToken] = React.useState('');
  const [timer, setTimer] = React.useState(300); // 5 minutes

  const amounts = [50000, 100000, 200000, 500000, 1000000, 1250000];

  React.useEffect(() => {
    let interval: any;
    if (step === 'token' && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    } else if (timer === 0) {
      setStep('method');
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const generateToken = () => {
    if (user && user.balance < amount) {
      alert('Saldo tidak mencukupi!');
      return;
    }
    
    const newToken = Math.floor(100000 + Math.random() * 900000).toString();
    setToken(newToken);
    setStep('token');
    setTimer(300);

    // Create a pending transaction
    addTransaction({
      type: 'payment', // Or add 'withdraw' type if needed, using payment for now
      amount: amount,
      title: `Tarik Tunai ${method === 'atm' ? 'ATM' : 'Retail'}`,
      category: 'Withdrawal',
      recipientName: method === 'atm' ? 'ATM PayRaya' : 'Kasir Retail',
      senderName: user?.name || 'User Handal',
      senderAccountNumber: user?.phone || '',
      accountNumber: newToken,
      status: 'pending',
      note: `Token: ${newToken}`
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="pb-24 pt-6 px-5 flex flex-col min-h-screen bg-[#f0f2f5]">
      <ScreenHeader 
        title={step === 'method' ? 'Tarik Tunai' : step === 'amount' ? 'Pilih Nominal' : 'Kode Penarikan'} 
        onBack={() => {
          if (step === 'token') setStep('method');
          else if (step === 'amount') setStep('method');
          else setScreen('home');
        }} 
      />

      <AnimatePresence mode="wait">
        {step === 'method' && (
          <motion.div 
            key="method"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col gap-4"
          >
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1">Pilih Metode Penarikan</h3>
            <div className="grid gap-4">
               <Card 
                 className={`flex items-center gap-4 p-5 cursor-pointer transition-all border-2 ${method === 'atm' ? 'border-[#003A8F] bg-blue-50/30' : 'border-transparent'}`}
                 onClick={() => setMethod('atm')}
               >
                  <div className="w-12 h-12 bg-[#003A8F] text-white rounded-2xl flex items-center justify-center">
                    <Smartphone size={24} />
                  </div>
                  <div className="flex-1">
                     <h4 className="font-black text-gray-800">ATM PayRaya</h4>
                     <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">Tarik tunai tanpa kartu di ATM</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-300" />
               </Card>
               <Card 
                 className={`flex items-center gap-4 p-5 cursor-pointer transition-all border-2 ${method === 'retail' ? 'border-[#003A8F] bg-blue-50/30' : 'border-transparent'}`}
                 onClick={() => setMethod('retail')}
               >
                  <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center">
                    <Store size={24} />
                  </div>
                  <div className="flex-1">
                     <h4 className="font-black text-gray-800">Indomaret</h4>
                     <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">Penarikan melalui kasir gerai Indomaret</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-300" />
               </Card>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-4 items-start">
               <ShieldCheck size={20} className="text-[#003A8F] shrink-0" />
               <p className="text-[10px] text-[#003A8F] font-bold leading-relaxed">
                  Penarikan tunai diproses secara aman menggunakan token sekali pakai yang berlaku selama 5 menit.
               </p>
            </div>

            <Button className="mt-8" size="full" onClick={() => setStep('amount')}>Lanjutkan</Button>
          </motion.div>
        )}

        {step === 'amount' && (
          <motion.div 
            key="amount"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col gap-6"
          >
            <div className="grid grid-cols-2 gap-4">
               {amounts.map(amt => (
                 <motion.div
                   key={amt}
                   whileTap={{ scale: 0.95 }}
                   onClick={() => setAmount(amt)}
                   className={`p-6 rounded-3xl border-2 transition-all text-center cursor-pointer ${amount === amt ? 'bg-[#003A8F] border-[#003A8F] text-white shadow-xl shadow-blue-200' : 'bg-white border-gray-100 text-gray-700'}`}
                 >
                    <span className="text-lg font-black">{formatRupiah(amt).replace('Rp', '').trim()}</span>
                 </motion.div>
               ))}
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100">
               <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-gray-400 uppercase">Input Nominal Lain</span>
               </div>
               <div className="flex items-center gap-2 border-b-2 border-gray-100 py-2 focus-within:border-[#003A8F] transition-colors">
                  <span className="text-xl font-black text-[#003A8F]">Rp</span>
                  <input 
                    type="number" 
                    placeholder="Minimal 50.000"
                    className="bg-transparent text-xl font-black outline-none w-full"
                    onChange={(e) => setAmount(Number(e.target.value))}
                  />
               </div>
            </div>

            <div className="mt-auto">
               <div className="flex justify-between items-center mb-4 px-2">
                  <span className="text-xs font-bold text-gray-400">Biaya Admin</span>
                  <span className="text-xs font-black text-gray-800">Gratis</span>
               </div>
               <Button 
                size="full" 
                onClick={generateToken} 
                className="shadow-xl"
                disabled={amount < 50000}
               >
                 Dapatkan Kode
               </Button>
            </div>
          </motion.div>
        )}

        {step === 'token' && (
          <motion.div 
            key="token"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-8 py-4"
          >
            <div className="text-center">
               <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Gunakan Kode Di {method === 'atm' ? 'ATM' : 'Kasir'}</h3>
               <p className="text-xs text-gray-500 font-medium max-w-[200px] mx-auto">Tunjukkan kode ini untuk menyelesaikan penarikan Anda</p>
            </div>

            <Card className="w-full flex flex-col items-center py-10 px-8 border-none shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-amber-400"></div>
               
               <div className="flex flex-col items-center gap-6 mb-8">
                  <div className="flex gap-4">
                     {token.split('').map((char, i) => (
                       <motion.div 
                        key={i}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 * i }}
                        className="w-10 h-14 bg-gray-50 border-2 border-gray-100 rounded-xl flex items-center justify-center text-2xl font-black text-[#003A8F]"
                       >
                         {char}
                       </motion.div>
                     ))}
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
                     <Clock size={14} className="text-[#003A8F]" />
                     <span className="text-xs font-black text-[#003A8F]">Berlaku {formatTime(timer)}</span>
                  </div>
               </div>

               <div className="w-full border-t border-dashed border-gray-200 pt-8 flex flex-col items-center">
                  <div className="bg-white p-2 rounded-lg scale-90 sm:scale-100">
                    <Barcode1D 
                      value={token} 
                      width={1.5} 
                      height={60} 
                      displayValue={false} 
                      background="transparent"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-gray-300 tracking-[0.5em] mt-2">{token} - {user?.id.slice(0, 4).toUpperCase()}</span>
               </div>
            </Card>

            <div className="flex flex-col gap-4 w-full">
               <Button variant="outline" size="full" onClick={() => setStep('method')}>Batalkan</Button>
               <Button variant="ghost" size="full" onClick={() => setScreen('home')}>Selesai & Kembali</Button>
            </div>

            <div className="flex items-center gap-3 mt-4 text-center">
               <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm">
                  <MapPin size={16} className="text-blue-500" />
               </div>
               <span className="text-[10px] font-bold text-blue-500 underline">Cari Lokasi ATM/Gerai Terdekat</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
