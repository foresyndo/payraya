import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, Phone, User as UserIcon, ArrowRight, Fingerprint, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button, Input } from '../components/UI';
import { Logo } from '../components/Logo';

export const LoginScreen: React.FC = () => {
  const { login, setScreen, isLoading, biometricLogin } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showBioPrompt, setShowBioPrompt] = useState(false);
  const [bioStatus, setBioStatus] = useState<'idle' | 'scanning' | 'success'>('idle');

  const biometricEnabled = localStorage.getItem('payraya_biometric_user') !== null;

  const handleBiometricLogin = async () => {
    setShowBioPrompt(true);
    setBioStatus('scanning');
    
    // Simulate biometric scan delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const success = await biometricLogin();
    if (success) {
      setBioStatus('success');
    } else {
      setShowBioPrompt(false);
      setBioStatus('idle');
      alert('Autentikasi Biometrik Gagal. Silakan masuk menggunakan kata sandi.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-8 pt-16 pb-10">
      <div className="flex flex-col items-center mb-12">
        <div className="mb-6">
           <Logo size={80} showText={false} />
        </div>
        <h1 className="text-3xl font-black text-[#003A8F] mb-2 tracking-tight">PayRaya</h1>
        <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em] text-center">Digital Banking Solution</p>
      </div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col gap-6"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input
            label="Email atau No. Handphone"
            placeholder="Masukkan email/no HP"
            icon={<Mail size={20} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Kata Sandi"
            type="password"
            placeholder="Masukkan kata sandi"
            icon={<Lock size={20} />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button type="button" className="text-right text-[#003A8F] font-bold text-sm -mt-2">
            Lupa Sandi?
          </button>

          <Button type="submit" size="full" isLoading={isLoading}>
            Masuk Sekarang
          </Button>

          {biometricEnabled && (
            <button 
              type="button" 
              onClick={handleBiometricLogin}
              className="flex items-center justify-center gap-3 py-4 bg-pink-50 border-2 border-pink-100 rounded-xl font-bold text-pink-600 active:scale-95 transition-all"
            >
              <Fingerprint size={24} />
              Login dengan Biometrik
            </button>
          )}
        </form>

        <div className="flex items-center gap-4 my-4">
          <div className="h-[1px] bg-gray-100 flex-1"></div>
          <span className="text-xs font-bold text-gray-400">ATAU</span>
          <div className="h-[1px] bg-gray-100 flex-1"></div>
        </div>

        <button 
          onClick={() => setScreen('register')}
          className="flex justify-center items-center gap-2 py-4 border-2 border-gray-100 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Belum punya akun? <span className="text-[#003A8F]">Daftar</span>
        </button>
      </motion.div>

      {/* Biometric Prompt Overlay */}
      <AnimatePresence>
        {showBioPrompt && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#003A8F]/95 backdrop-blur-md z-[300] flex flex-col items-center justify-center p-8 text-white"
          >
            <div className="relative mb-12">
              <motion.div
                animate={{ 
                  scale: bioStatus === 'scanning' ? [1, 1.1, 1] : 1,
                  boxShadow: bioStatus === 'scanning' ? ['0 0 0px rgba(255,255,255,0)', '0 0 30px rgba(255,255,255,0.4)', '0 0 0px rgba(255,255,255,0)'] : 'none'
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center border-2 border-white/20"
              >
                {bioStatus === 'success' ? (
                  <CheckCircle2 size={64} className="text-pink-400" />
                ) : (
                  <Fingerprint size={64} className="text-white" />
                )}
              </motion.div>
              
              {bioStatus === 'scanning' && (
                <motion.div 
                  initial={{ top: '20%' }}
                  animate={{ top: '80%' }}
                  transition={{ duration: 1.5, repeat: Infinity, bounce: 0 }}
                  className="absolute left-4 right-4 h-1 bg-pink-400 blur-sm z-10"
                />
              )}
            </div>

            <h2 className="text-2xl font-black mb-2">Autentikasi Biometrik</h2>
            <p className="text-white/60 font-medium text-center mb-12">
              {bioStatus === 'scanning' ? 'Memindai data biometrik Anda...' : 'Berhasil masuk!'}
            </p>

            {bioStatus === 'scanning' && (
              <Button variant="outline" className="border-white/20 text-white" onClick={() => setShowBioPrompt(false)}>
                Batal
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-auto flex flex-col items-center gap-4 pt-10">
         <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Powered by PayRaya Global Security</p>
         <div className="flex gap-6 opacity-30">
            <div className="w-8 h-8 bg-gray-200 rounded"></div>
            <div className="w-8 h-8 bg-gray-200 rounded"></div>
            <div className="w-8 h-8 bg-gray-200 rounded"></div>
         </div>
      </div>
    </div>
  );
};

export const RegisterScreen: React.FC = () => {
  const { register, setScreen, isLoading } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    pin: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(formData.name, formData.email, formData.phone, formData.password, formData.pin);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-8 pt-10 pb-10 overflow-y-auto">
      <div className="mb-10 flex items-center gap-4">
        <button onClick={() => setScreen('login')} className="p-2 border border-gray-100 rounded-lg">
          <ArrowRight size={20} className="rotate-180" />
        </button>
        <h1 className="text-2xl font-black text-[#003A8F]">Daftar PayRaya</h1>
      </div>

      <motion.div
        initial={{ x: 30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label="Nama Lengkap"
            placeholder="Masukkan nama sesuai KTP"
            icon={<UserIcon size={20} />}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="example@payraya.com"
            icon={<Mail size={20} />}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input
            label="Nomor Handphone"
            placeholder="08xxxxxxxxxx"
            icon={<Phone size={20} />}
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
          <Input
            label="Kata Sandi"
            type="password"
            placeholder="Minimal 8 karakter"
            icon={<Lock size={20} />}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <Input
            label="PIN Transaksi (6 Digit)"
            type="password"
            maxLength={6}
            placeholder="Masukkan 6 angka"
            icon={<Lock size={20} />}
            value={formData.pin}
            onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/[^0-9]/g, '') })}
            required
          />

          <p className="text-[10px] text-gray-500 leading-relaxed mt-2">
            Dengan mendaftar, Anda menyetujui <span className="text-[#003A8F] font-bold">Syarat & Ketentuan</span> dan <span className="text-[#003A8F] font-bold">Kebijakan Privasi</span> kami.
          </p>

          <Button type="submit" size="full" isLoading={isLoading}>
            Daftar Sekarang
          </Button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-500 font-medium">
          Sudah punya akun? <button onClick={() => setScreen('login')} className="text-[#003A8F] font-bold">Masuk</button>
        </p>
      </motion.div>
    </div>
  );
};
