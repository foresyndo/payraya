import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Lightbulb, Smartphone, Globe, CreditCard, CheckCircle2, QrCode as QrIcon, X, Store, Info, ShieldCheck } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useApp } from '../context/AppContext';
import { Button, Card, Input } from '../components/UI';
import { formatRupiah } from '../utils/format';
import { ReceiptCard } from '../components/ReceiptCard';
import confetti from 'canvas-confetti';
import { Transaction } from '../types';

export const PaymentScreen: React.FC = () => {
  const { user, setScreen, addTransaction } = useApp();
  const [step, setStep] = useState<'menu' | 'input' | 'success' | 'qris' | 'qris_confirm'>('menu');
  const [selectedService, setSelectedService] = useState<{ icon: any, label: string, color: string } | null>(null);
  const [customerNumber, setCustomerNumber] = useState('');
  const [amount, setAmount] = useState('0');
  const [qrisMerchant, setQrisMerchant] = useState('');
  const [completedTransaction, setCompletedTransaction] = useState<Transaction | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const services = [
    { icon: Lightbulb, label: 'PLN Prabayar', color: 'bg-yellow-100 text-yellow-600' },
    { icon: Smartphone, label: 'Pulsa & Data', color: 'bg-blue-100 text-blue-600' },
    { icon: Globe, label: 'Internet / WiFi', color: 'bg-indigo-100 text-indigo-600' },
    { icon: Store, label: 'Toko Digital', color: 'bg-amber-100 text-amber-600' },
    { icon: QrIcon, label: 'Bayar QRIS', color: 'bg-purple-100 text-purple-600' },
  ];

  useEffect(() => {
    if (step === 'qris') {
      const scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );

      scanner.render((decodedText) => {
        // Mock QRIS parsing
        setQrisMerchant("KOPI KENANGAN - GRAND INDONESIA");
        setCustomerNumber(decodedText.substring(0, 10)); // Use part of QR as ID
        setAmount('50000'); // Default amount for QRIS test
        setSelectedService(services[3]);
        scanner.clear();
        setStep('qris_confirm');
      }, (error) => {
        // silence errors
      });

      scannerRef.current = scanner;
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(e => console.error(e));
      }
    };
  }, [step]);

  const handleServiceSelect = (service: any) => {
    if (service.label === 'Bayar QRIS') {
      setStep('qris');
      return;
    }
    setSelectedService(service);
    setAmount(service.label === 'PLN Prabayar' ? '100000' : '50000');
    setStep('input');
  };

  const handlePay = async () => {
    if (!customerNumber && step !== 'qris') return;
    const tx = await addTransaction({
      type: 'payment',
      amount: parseInt(amount),
      title: `Pembayaran ${selectedService?.label}${qrisMerchant ? ` - ${qrisMerchant}` : ''}`,
      category: 'Tagihan',
      bankName: qrisMerchant ? 'QRIS PayRaya' : 'PayRaya Billing',
      accountNumber: customerNumber || 'QRIS-INTL-102',
      recipientName: qrisMerchant || selectedService?.label || 'Billing Merchant',
      senderName: user?.name || 'User Handal',
      senderAccountNumber: user?.phone || '',
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
          if (step === 'menu') setScreen('home');
          else if (step === 'qris_confirm') setStep('qris');
          else if (step === 'input' && qrisMerchant) setStep('qris_confirm');
          else setStep('menu');
        }} className="p-2 bg-white rounded-lg shadow-sm">
          <ArrowLeft size={20} className="text-[#003A8F]" />
        </button>
        <h1 className="text-xl font-bold text-[#003A8F]">
          {step === 'qris' ? 'Scan QRIS' : (step === 'qris_confirm' ? 'Konfirmasi Merchant' : 'Pembayaran')}
        </h1>
      </div>

      <AnimatePresence mode="wait">
        {step === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-4"
          >
             <h3 className="font-bold text-gray-800">Pilih Layanan</h3>
             <div className="grid grid-cols-2 gap-4">
                {services.map((service) => (
                   <button
                     key={service.label}
                     onClick={() => handleServiceSelect(service)}
                     className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-3 active:scale-95 transition-all"
                   >
                      <div className={`w-14 h-14 ${service.color} rounded-full flex items-center justify-center`}>
                         <service.icon size={28} />
                      </div>
                      <span className="text-sm font-bold text-gray-700">{service.label}</span>
                   </button>
                ))}
             </div>
          </motion.div>
        )}

        {step === 'qris' && (
          <motion.div
            key="qris"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="w-full max-w-sm aspect-square bg-black rounded-3xl overflow-hidden relative border-4 border-white shadow-2xl">
              <div id="reader" className="w-full h-full"></div>
              {/* Overlays for scanner look */}
              <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] border-2 border-white rounded-2xl pointer-events-none shadow-[0_0_0_1000px_rgba(0,0,0,0.4)]">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-400 rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-400 rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-400 rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-400 rounded-br-lg"></div>
                
                <motion.div 
                  animate={{ top: ['10%', '90%', '10%'] }} 
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute left-2 right-2 h-0.5 bg-blue-400 shadow-[0_0_10px_#60a5fa] z-10"
                />
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="font-bold text-gray-800 mb-2">Arahkan Kamera ke Kode QRIS</h3>
              <p className="text-sm text-gray-500 px-10">Pastikan Kode QR terlihat jelas di dalam kotak pemindai.</p>
            </div>

            <button 
              onClick={() => setStep('menu')}
              className="mt-4 p-4 bg-white rounded-full shadow-lg text-gray-500 active:scale-95 transition-transform"
            >
              <X size={24} />
            </button>
          </motion.div>
        )}

        {step === 'qris_confirm' && (
          <motion.div
            key="qris_confirm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col gap-6"
          >
             <Card className="flex flex-col items-center py-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-purple-500"></div>
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-purple-50 rounded-full opacity-50"></div>
                
                <div className="w-24 h-24 bg-purple-100 text-purple-600 rounded-[32px] flex items-center justify-center mb-6 shadow-xl shadow-purple-100/50 border-4 border-white">
                   <Store size={48} strokeWidth={1.5} />
                </div>
                
                <div className="text-center px-4">
                  <p className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em] mb-2">Merchant Terverifikasi</p>
                  <h2 className="text-xl font-black text-gray-800 leading-tight mb-2">{qrisMerchant}</h2>
                  <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 font-bold">
                    <QrIcon size={14} />
                    <span>NMID: ID102030405060</span>
                  </div>
                </div>

                <div className="w-full h-px bg-gray-100 my-8 mx-auto max-w-[200px]"></div>

                <div className="flex flex-col gap-4 w-full px-4">
                   <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                      <ShieldCheck size={18} className="text-green-600" />
                      <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">Aman • QRIS GPN Terjamin</span>
                   </div>
                   <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                      <Info size={18} className="text-blue-600" />
                      <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Saldo Cashback hingga 5%</span>
                   </div>
                </div>
             </Card>

             <div className="space-y-3">
               <Button size="full" onClick={() => setStep('input')} className="bg-[#003A8F]">
                  Lanjutkan Bayar
               </Button>
               <Button size="full" variant="outline" onClick={() => setStep('qris')}>
                  Scan Ulang
               </Button>
             </div>
          </motion.div>
        )}

        {step === 'input' && (
          <motion.div
            key="input"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex flex-col gap-6"
          >
             <Card>
                <div className="flex items-center gap-3 mb-6">
                   <div className={`w-10 h-10 ${selectedService?.color} rounded-lg flex items-center justify-center`}>
                      <selectedService.icon size={20} />
                   </div>
                   <h3 className="font-bold text-gray-800">{selectedService?.label}</h3>
                </div>
                
                {qrisMerchant ? (
                  <div className="mb-6 p-4 bg-purple-50 rounded-xl border border-purple-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-purple-600 shadow-sm">
                      <QrIcon size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">Merchant QRIS</p>
                      <h4 className="font-black text-purple-900">{qrisMerchant}</h4>
                    </div>
                  </div>
                ) : (
                  <Input
                    label="Nomor Pelanggan / HP"
                    placeholder="Masukkan nomor pelanggan"
                    value={customerNumber}
                    onChange={(e) => setCustomerNumber(e.target.value)}
                  />
                )}

                <div className="mt-6">
                   <p className="text-xs font-medium text-gray-500 mb-2">
                     {qrisMerchant ? 'Nominal Pembayaran' : 'Pilih Nominal'}
                   </p>
                   {qrisMerchant ? (
                     <Input
                        placeholder="Masukkan nominal"
                        value={amount}
                        type="number"
                        onChange={(e) => setAmount(e.target.value)}
                        className="text-lg font-bold"
                     />
                   ) : (
                     <div className="grid grid-cols-3 gap-2">
                        {['50000', '100000', '200000'].map(val => (
                          <button
                            key={val}
                            onClick={() => setAmount(val)}
                            className={`
                              py-2 text-xs font-bold rounded-lg border-2 transition-all
                              ${amount === val ? 'bg-[#003A8F] border-[#003A8F] text-white' : 'bg-gray-50 border-transparent text-gray-600'}
                            `}
                          >
                            {parseInt(val) / 1000}rb
                          </button>
                        ))}
                     </div>
                   )}
                </div>
             </Card>

             <Card className="bg-blue-50 border-blue-100">
                <div className="flex justify-between items-center text-sm">
                   <span className="text-gray-600">Total Tagihan</span>
                   <span className="font-black text-[#003A8F]">{formatRupiah(parseInt(amount || '0'))}</span>
                </div>
             </Card>

             <Button size="full" onClick={handlePay} disabled={!customerNumber && !qrisMerchant}>
                Konfirmasi Pembayaran
             </Button>
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
                   setStep('menu');
                   setQrisMerchant('');
                   setCustomerNumber('');
                   setAmount('0');
                 }}>Bayar Tagihan Lain</Button>
              </div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
