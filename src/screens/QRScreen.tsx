import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, Share2, Download, Copy, Check, MessageCircle, Send, Mail, X, MoreHorizontal } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, Button } from '../components/UI';
import { QRCodeSVG } from 'qrcode.react';
import { Logo } from '../components/Logo';
import { toPng } from 'html-to-image';

export const QRScreen: React.FC = () => {
  const { user, setScreen } = useApp();
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const qrCardRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    if (user) {
      navigator.clipboard.writeText(user.phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareText = `Scan QR ini untuk kirim dana ke ${user?.name} via PayRaya.\nNomor: ${user?.phone}`;

  const handleDownload = async () => {
    if (qrCardRef.current === null) return;
    setIsCapturing(true);
    try {
      const dataUrl = await toPng(qrCardRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `PayRaya-QR-${user?.name}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download QR', err);
    } finally {
      setIsCapturing(false);
    }
  };

  const shareNative = async () => {
    if (qrCardRef.current === null) return;
    setIsCapturing(true);
    try {
      const dataUrl = await toPng(qrCardRef.current, { cacheBust: true, pixelRatio: 2 });
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], `QR-${user?.name}.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'QR PayRaya Saya',
          text: shareText,
        });
      } else {
        handleDownload();
      }
    } catch (err) {
      console.error('Native sharing failed', err);
      handleDownload();
    } finally {
      setIsCapturing(false);
      setShowShareMenu(false);
    }
  };

  const shareWA = () => {
    const text = encodeURIComponent(shareText);
    window.open(`https://wa.me/?text=${text}`, '_blank');
    setShowShareMenu(false);
  };

  const shareTelegram = () => {
    const text = encodeURIComponent(shareText);
    window.open(`https://t.me/share/url?url=${encodeURIComponent('https://payraya.com')}&text=${text}`, '_blank');
    setShowShareMenu(false);
  };

  const shareEmail = () => {
    const subject = encodeURIComponent('QR PayRaya Saya');
    const body = encodeURIComponent(shareText);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    setShowShareMenu(false);
  };

  if (!user) return null;

  // Prepare QR Data - typically a JSON string or a specific deep link for the app
  const qrData = JSON.stringify({
    type: 'payraya_transfer',
    phone: user.phone,
    name: user.name
  });

  return (
    <div className="pb-24 pt-6 px-5 flex flex-col min-h-screen bg-[#F5F7FA]">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setScreen('home')} className="p-2 bg-white rounded-lg shadow-sm border border-[#f0f0f0]">
          <ArrowLeft size={20} className="text-[#003A8F]" />
        </button>
        <h1 className="text-xl font-bold text-[#003A8F]">QR Saya</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center"
      >
        <div ref={qrCardRef} className="w-full">
          <Card className="w-full flex flex-col items-center p-8 bg-white relative overflow-hidden">
            {/* Decorative background logo */}
            <div className="absolute top-[-50px] right-[-50px] opacity-[0.03] rotate-12">
              <Logo size={300} showText={false} />
            </div>

            <div className="flex flex-col items-center mb-10 z-10">
              <div className="w-16 h-16 bg-[#003A8F] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-100">
                 <Logo size={40} className="invert brightness-0" showText={false} />
              </div>
              <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">{user.name}</h2>
              <p className="text-gray-400 font-bold text-sm tracking-widest mt-1 uppercase">PayRaya Personal QR</p>
            </div>

            <div className="relative group z-10">
              <div className="p-4 bg-white rounded-3xl border-4 border-blue-50 shadow-inner">
                 <QRCodeSVG 
                   value={qrData}
                   size={240}
                   level="H"
                   includeMargin={true}
                   imageSettings={{
                     src: "/favicon.ico", // Placeholder or use Logo path if available as URL
                     x: undefined,
                     y: undefined,
                     height: 40,
                     width: 40,
                     excavate: true,
                   }}
                 />
              </div>
              {/* Visual scan frame */}
              <div className="absolute -inset-2 border-2 border-dashed border-[#003A8F]/10 rounded-[40px] pointer-events-none" />
            </div>

            <div className="flex flex-col items-center mt-10 z-10">
              <div className="flex items-center gap-2 px-6 py-3 bg-gray-50 rounded-2xl border border-gray-100 mb-2">
                 <span className="text-lg font-black text-[#003A8F] tracking-widest">{user.phone}</span>
                 <button 
                   onClick={handleCopy}
                   className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-400"
                 >
                   {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                 </button>
              </div>
              <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Gunakan QR untuk menerima transfer instan</p>
            </div>
          </Card>
        </div>

        <div className="w-full grid grid-cols-2 gap-4 mt-8">
           <button 
             onClick={() => setShowShareMenu(true)}
             className="flex flex-col items-center gap-3 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm active:scale-95 transition-all"
           >
              <div className="w-12 h-12 bg-blue-50 text-[#003A8F] rounded-xl flex items-center justify-center">
                 <Share2 size={22} />
              </div>
              <span className="text-xs font-bold text-gray-700">Bagikan QR</span>
           </button>
           <button 
             onClick={handleDownload}
             disabled={isCapturing}
             className="flex flex-col items-center gap-3 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm active:scale-95 transition-all disabled:opacity-50"
           >
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                 {isCapturing ? <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" /> : <Download size={22} />}
              </div>
              <span className="text-xs font-bold text-gray-700">{isCapturing ? 'Menyimpan...' : 'Simpan Gambar'}</span>
           </button>
        </div>

        <div className="mt-12 text-center max-w-[280px] opacity-40">
           <p className="text-[10px] font-bold text-gray-400 leading-relaxed uppercase tracking-tighter">
             Penerima hanya perlu memindai kode ini dari aplikasi PayRaya mereka untuk mengirim dana ke Anda.
           </p>
        </div>
      </motion.div>

      {/* Share Sheet */}
      <AnimatePresence>
        {showShareMenu && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
              onClick={() => setShowShareMenu(false)}
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] p-8 z-[101] shadow-2xl safe-area-bottom"
            >
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black text-[#003A8F]">Bagikan QR</h3>
                <button onClick={() => setShowShareMenu(false)} className="p-2 bg-gray-100 rounded-full text-gray-400">
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-8">
                <button onClick={shareWA} className="flex flex-col items-center gap-2 group">
                  <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shadow-sm group-active:scale-90 transition-transform">
                    <MessageCircle size={24} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase">WhatsApp</span>
                </button>
                <button onClick={shareTelegram} className="flex flex-col items-center gap-2 group">
                  <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shadow-sm group-active:scale-90 transition-transform">
                    <Send size={24} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Telegram</span>
                </button>
                <button onClick={shareEmail} className="flex flex-col items-center gap-2 group">
                  <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center shadow-sm group-active:scale-90 transition-transform">
                    <Mail size={24} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Email</span>
                </button>
                <button onClick={handleCopy} className="flex flex-col items-center gap-2 group">
                  <div className={`w-14 h-14 ${copied ? 'bg-green-100 text-green-700' : 'bg-gray-50 text-gray-600'} rounded-2xl flex items-center justify-center shadow-sm group-active:scale-90 transition-transform`}>
                    {copied ? <Check size={24} /> : <Copy size={24} />}
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase">{copied ? 'Tersalin' : 'Salin No'}</span>
                </button>
              </div>

              <Button size="full" onClick={shareNative} className="flex gap-2 items-center justify-center">
                <MoreHorizontal size={20} />
                Lainnya (Native Share)
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
