import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User as UserIcon, 
  Settings, 
  Shield, 
  CreditCard, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  Bell,
  Lock,
  Smartphone,
  CheckCircle2,
  Camera,
  Star,
  Globe,
  Wallet,
  FileText,
  Heart,
  Fingerprint,
  ArrowLeft,
  QrCode
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/UI';

export const ProfileScreen: React.FC = () => {
  const { user, logout, toggleBiometric, setScreen, showPush, updateBalance } = useApp();
  const [mode, setMode] = React.useState<'menu' | 'personal_info' | 'security' | 'preferences'>('menu');

  const handleSimulateIncome = () => {
    const amount = 50000 + Math.floor(Math.random() * 950000);
    showPush({
      title: 'Dana Masuk',
      message: 'Transfer dari Bank Central Asia (BCA) berhasil masuk ke rekening kamu.',
      type: 'incoming',
      amount: amount
    });
    updateBalance(amount);
  };

  const handleBiometricToggle = () => {
    if (!user) return;
    toggleBiometric(!user.isBiometricEnabled);
  };

  const handleMenuClick = (item: any) => {
    if (item.label === 'Notifikasi') {
      setScreen('notifications');
    } else if (item.label === 'Informasi Pribadi') {
      setMode('personal_info');
    } else if (item.label === 'Ubah PIN & Password' || item.label === 'Layanan Keamanan') {
      setMode('security');
    } else {
      alert(`${item.label} akan segera hadir!`);
    }
  };

  const PersonalInfoView = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="px-5 py-6"
    >
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => setMode('menu')}
          className="p-2 bg-white rounded-lg shadow-sm border border-gray-100"
        >
          <ArrowLeft size={20} className="text-[#003A8F]" />
        </button>
        <h1 className="text-xl font-bold text-[#003A8F]">Informasi Pribadi</h1>
      </div>

      <Card className="flex flex-col gap-6 p-6">
        <div className="flex flex-col items-center mb-4">
          <div className="w-24 h-24 bg-[#003A8F] rounded-full flex items-center justify-center text-white text-3xl font-black mb-3 border-4 border-blue-50 shadow-inner">
            {user?.name?.charAt(0)}
          </div>
          <button className="text-[#003A8F] text-[10px] font-black uppercase tracking-widest bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
            Ubah Foto Profil
          </button>
        </div>

        <div className="space-y-5">
          {[
            { label: 'Nama Lengkap', value: user?.name, type: 'text' },
            { label: 'Alamat Email', value: user?.email, type: 'email' },
            { label: 'Nomor Handphone', value: user?.phone, type: 'tel' },
            { label: 'NIK / Nomor Identitas', value: '3273************', type: 'text' },
            { label: 'Alamat Domisili', value: 'Jl. Sudirman No. 123, Jakarta', type: 'text' },
          ].map((field) => (
            <div key={field.label} className="group cursor-pointer">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{field.label}</label>
              <div className="flex items-center justify-between mt-1 pb-3 border-b border-gray-50 group-hover:border-blue-100 transition-colors">
                <span className="font-bold text-gray-800">{field.value}</span>
                <ChevronRight size={14} className="text-gray-300" />
              </div>
            </div>
          ))}
        </div>

        <button className="w-full mt-6 py-4 bg-[#003A8F] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100 active:scale-95 transition-all">
          Simpan Perubahan
        </button>
      </Card>

      <div className="mt-8 flex items-center gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
        <Shield size={20} className="text-amber-600 shrink-0" />
        <p className="text-[10px] font-bold text-amber-900 leading-relaxed">
          Beberapa informasi tidak dapat diubah secara langsung demi keamanan akun kamu. Hubungi Customer Service jika diperlukan.
        </p>
      </div>
    </motion.div>
  );

  const SecurityView = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="px-5 py-6"
    >
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => setMode('menu')}
          className="p-2 bg-white rounded-lg shadow-sm border border-gray-100"
        >
          <ArrowLeft size={20} className="text-[#003A8F]" />
        </button>
        <h1 className="text-xl font-bold text-[#003A8F]">Pusat Keamanan</h1>
      </div>

      <div className="flex flex-col gap-4">
        {[
          { icon: Lock, label: 'Ubah PIN', sub: 'Ganti 6 digit PIN transaksi kamu', color: 'bg-blue-50 text-blue-600' },
          { icon: Shield, label: 'Password', sub: 'Terakhir diubah 2 bulan lalu', color: 'bg-indigo-50 text-indigo-600' },
          { icon: Smartphone, label: 'Perangkat Terdaftar', sub: '1 Perangkat Aktif (iPhone 15 Pro)', color: 'bg-cyan-50 text-cyan-600' },
          { icon: Fingerprint, label: 'Biometrik', sub: 'Fingerprint & Face ID Aktif', color: 'bg-pink-50 text-pink-600' },
        ].map((item, idx) => (
          <Card key={item.label} className="flex items-center gap-4 py-4 px-5 active:scale-[0.98] transition-all cursor-pointer group">
            <div className={`w-11 h-11 ${item.color} rounded-[14px] flex items-center justify-center`}>
              <item.icon size={22} />
            </div>
            <div className="flex-1">
              <h4 className="text-[14px] font-bold text-gray-800">{item.label}</h4>
              <p className="text-[10px] text-gray-400 font-medium">{item.sub}</p>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
          </Card>
        ))}
      </div>
    </motion.div>
  );

  const menuGroups = [
    {
      title: 'Akun & Saldo',
      items: [
        { icon: UserIcon, label: 'Informasi Pribadi', sub: 'Nama, Email, Alamat', color: 'bg-blue-50 text-blue-600' },
        { icon: Wallet, label: 'Rekening Terhubung', sub: 'Kelola kartu & bank', color: 'bg-green-50 text-green-600' },
        { icon: Star, label: 'Loyalty Points', sub: 'Tukar poin dengan reward', color: 'bg-amber-50 text-amber-600' },
      ]
    },
    {
      title: 'Keamanan',
      items: [
        { icon: Shield, label: 'Layanan Keamanan', sub: 'Autentikasi 2 faktor', color: 'bg-purple-50 text-purple-600' },
        { icon: Lock, label: 'Ubah PIN & Password', sub: 'Terakhir diubah 2 bulan lalu', color: 'bg-indigo-50 text-indigo-600' },
        { icon: Smartphone, label: 'Perangkat Terdaftar', sub: 'Kelola akses perangkat', color: 'bg-cyan-50 text-cyan-600' },
      ]
    },
    {
      title: 'Informasi Lainnya',
      items: [
        { icon: Globe, label: 'Bahasa & Regional', sub: 'Indonesia (IDN)', color: 'bg-slate-50 text-slate-600' },
        { icon: Bell, label: 'Notifikasi', sub: 'Promo & aktivitas akun', color: 'bg-orange-50 text-orange-600' },
        { icon: FileText, label: 'Syarat & Ketentuan', sub: 'Legalitas & privasi', color: 'bg-gray-50 text-gray-600' },
        { icon: HelpCircle, label: 'Pusat Bantuan', sub: 'Bantuan CS 24/7', color: 'bg-teal-50 text-teal-600' },
      ]
    }
  ];

  return (
    <div className="pb-32 min-h-screen bg-[#F8FAFC]">
      <AnimatePresence mode="wait">
        {mode === 'menu' ? (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Premium Header Background */}
            <div className="h-48 bg-gradient-to-br from-[#003A8F] via-[#0047AB] to-[#0056D2] relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-20 -mt-20 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-300 rounded-full -ml-10 -mb-10 blur-2xl"></div>
              </div>
              <button 
                onClick={() => setScreen('home')}
                className="absolute top-8 left-5 p-3 bg-white/20 backdrop-blur-md rounded-xl text-white active:scale-95 transition-transform"
              >
                <ArrowLeft size={20} />
              </button>
            </div>

            {/* Profile Card Overlay */}
            <div className="px-5 -mt-20 relative z-10">
              <Card className="flex flex-col items-center py-8">
                <div className="relative group">
                  <div className="w-28 h-28 bg-gradient-to-tr from-gray-100 to-white rounded-full p-1 shadow-2xl">
                    <div className="w-full h-full bg-[#003A8F] rounded-full flex items-center justify-center border-4 border-white overflow-hidden shadow-inner relative">
                      <span className="text-white text-4xl font-black italic tracking-tighter">
                        {user?.name?.charAt(0)}
                      </span>
                      {/* Simulated photo if exists */}
                      <button 
                        onClick={() => alert('Fitur ubah foto akan segera tersedia!')}
                        className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                      >
                        <Camera size={24} className="text-white" />
                      </button>
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-green-500 p-1.5 rounded-full border-4 border-white shadow-lg">
                    <CheckCircle2 size={16} className="text-white" />
                  </div>
                </div>

                <div className="text-center mt-5">
                  <h2 className="text-2xl font-black text-[#003A8F] flex items-center justify-center gap-2">
                    {user?.name}
                  </h2>
                  <p className="text-gray-400 font-bold text-xs tracking-wider uppercase mt-1">{user?.phone}</p>
                  
                  <div className="flex gap-2 mt-4 justify-center">
                    <button 
                      onClick={() => alert('Status Member: Gold')}
                      className="px-3 py-1 bg-amber-50 text-[#B45309] text-[9px] font-black rounded-full uppercase tracking-widest border border-amber-100 flex items-center gap-1 shadow-sm active:scale-95 transition-transform"
                    >
                      <Star size={10} fill="currentColor" />
                      Gold Member
                    </button>
                    <button 
                      onClick={() => alert('Status Prioritas: Aktif')}
                      className="px-3 py-1 bg-blue-50 text-[#003A8F] text-[9px] font-black rounded-full uppercase tracking-widest border border-blue-100 flex items-center gap-1 shadow-sm active:scale-95 transition-transform"
                    >
                      <Heart size={10} fill="currentColor" />
                      Prioritas
                    </button>
                  </div>

                  <button 
                    onClick={() => setScreen('qr')}
                    className="mt-6 flex items-center gap-3 px-8 py-3 bg-white border-2 border-blue-50 rounded-2xl shadow-xl shadow-blue-50/20 active:scale-95 transition-all group"
                  >
                    <div className="p-2 bg-blue-50 rounded-lg text-[#003A8F] group-hover:bg-[#003A8F] group-hover:text-white transition-colors">
                      <QrCode size={18} />
                    </div>
                    <span className="text-xs font-black text-[#003A8F] uppercase tracking-widest">QR Saya</span>
                  </button>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-3 w-full gap-4 mt-8 pt-8 border-t border-gray-50">
                  <button onClick={() => alert('Detail Member')} className="text-center active:scale-95 transition-transform">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Member</p>
                    <p className="text-sm font-bold text-gray-700">2 Thn</p>
                  </button>
                  <button onClick={() => alert('Detail Poin Loyalty')} className="text-center border-x border-gray-100 active:scale-95 transition-transform">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Poin</p>
                    <p className="text-sm font-bold text-gray-700">1.250</p>
                  </button>
                  <button onClick={() => alert('Level Verifikasi')} className="text-center active:scale-95 transition-transform">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Level</p>
                    <p className="text-sm font-bold text-gray-700">V.2</p>
                  </button>
                </div>
              </Card>

              {/* Menu Groups */}
              <div className="mt-8 flex flex-col gap-8">
                {menuGroups.map((group, groupIdx) => (
                  <div key={group.title} className="flex flex-col gap-3">
                    <h3 className="px-1 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">{group.title}</h3>
                    <div className="flex flex-col gap-2">
                      {group.items.map((item, idx) => (
                        <motion.div
                          key={item.label}
                          initial={{ x: -20, opacity: 0 }}
                          whileInView={{ x: 0, opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.05 + groupIdx * 0.1 }}
                          onClick={() => handleMenuClick(item)}
                        >
                          <Card className="flex items-center gap-4 py-4 px-5 active:scale-[0.98] transition-all cursor-pointer group">
                            <div className={`w-11 h-11 ${item.color} rounded-[14px] flex items-center justify-center transition-transform group-hover:scale-110`}>
                              <item.icon size={22} strokeWidth={2.2} />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-[14px] font-bold text-gray-800 leading-tight">{item.label}</h4>
                              <p className="text-[10px] text-gray-400 font-medium mt-0.5">{item.sub}</p>
                            </div>
                            <ChevronRight size={18} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
                          </Card>
                        </motion.div>
                      ))}
                      {groupIdx === 1 && (
                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          whileInView={{ x: 0, opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.15 + groupIdx * 0.1 }}
                        >
                          <Card className="flex items-center gap-4 py-4 px-5 transition-all">
                            <div className="w-11 h-11 bg-pink-50 text-pink-600 rounded-[14px] flex items-center justify-center">
                              <Fingerprint size={22} strokeWidth={2.2} />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-[14px] font-bold text-gray-800 leading-tight">Login Biometrik</h4>
                              <p className="text-[10px] text-gray-400 font-medium mt-0.5">Fingerprint atau Face ID</p>
                            </div>
                            <button 
                              onClick={handleBiometricToggle}
                              className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${user?.isBiometricEnabled ? 'bg-[#003A8F]' : 'bg-gray-200'}`}
                            >
                              <motion.div 
                                animate={{ x: user?.isBiometricEnabled ? 24 : 2 }}
                                className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm" 
                              />
                            </button>
                          </Card>
                        </motion.div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Logout Section */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  className="mt-4 mb-2"
                >
                  <button
                    onClick={logout}
                    className="w-full flex items-center justify-between px-6 py-5 bg-white border border-red-100 rounded-[20px] text-red-500 font-bold shadow-sm active:bg-red-50 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-red-50 rounded-[14px] flex items-center justify-center text-red-600">
                        <LogOut size={22} strokeWidth={2.2} />
                      </div>
                      <div className="text-left">
                        <span className="block text-[14px]">Keluar Aplikasi</span>
                        <span className="text-[10px] text-red-300 font-medium">Sesi akan berakhir otomatis</span>
                      </div>
                    </div>
                    <ChevronRight size={18} className="opacity-40 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>

                {/* Simulation Section (Developer Mode) */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  className="mt-4 mb-2"
                >
                  <button
                    onClick={handleSimulateIncome}
                    className="w-full flex items-center justify-between px-6 py-5 bg-white border border-blue-100 rounded-[20px] text-[#003A8F] font-bold shadow-sm active:bg-blue-50 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-blue-50 rounded-[14px] flex items-center justify-center text-[#003A8F]">
                        <Bell size={22} strokeWidth={2.2} className="animate-bounce" />
                      </div>
                      <div className="text-left">
                        <span className="block text-[14px]">Simulasi Dana Masuk</span>
                        <span className="text-[10px] text-blue-300 font-medium tracking-tight">Klik untuk tes notifikasi push real-time</span>
                      </div>
                    </div>
                    <ChevronRight size={18} className="opacity-40 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              </div>

              {/* Footer info */}
              <div className="mt-12 mb-8 text-center px-4">
                <div className="flex justify-center gap-4 mb-4 grayscale opacity-40">
                  <div className="h-6 w-12 bg-gray-300 rounded"></div>
                  <div className="h-6 w-12 bg-gray-300 rounded"></div>
                  <div className="h-6 w-12 bg-gray-300 rounded"></div>
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">PayRaya Digital Bank Indonesia</p>
                <p className="text-[9px] text-gray-300 mt-2 font-medium">
                  Version 2.4.8 (Stable) • Build 190426<br/>
                  © 2026 PayRaya Global. All Rights Reserved.
                </p>
                <div className="mt-4 flex items-center justify-center gap-1.5 text-[9px] text-gray-400 font-bold">
                  <Shield size={10} className="text-green-500" />
                  DATA ENCRYPTED & PROTECTED
                </div>
              </div>
            </div>
          </motion.div>
        ) : mode === 'personal_info' ? (
          <PersonalInfoView />
        ) : mode === 'security' ? (
          <SecurityView />
        ) : null}
      </AnimatePresence>
    </div>
  );
};
