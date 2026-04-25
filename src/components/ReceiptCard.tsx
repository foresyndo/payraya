import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Share2, Download, CheckCircle2, ShieldCheck, Printer, MessageCircle, Send, Mail, X, Copy, Check, MoreHorizontal } from 'lucide-react';
import { Transaction } from '../types';
import { formatRupiah, formatDate, formatFullDateTime, maskAccountNumber } from '../utils/format';
import { toPng } from 'html-to-image';
import { Button } from './UI';
import { Logo } from './Logo';

interface ReceiptCardProps {
  transaction: Transaction;
  onClose?: () => void;
}

export const ReceiptCard: React.FC<ReceiptCardProps> = ({ transaction, onClose }) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [showThermalPreview, setShowThermalPreview] = useState(false);

  const handleThermalPrint = () => {
    setIsPrinting(true);
    // Simulate real communication with printer
    setTimeout(() => {
      setIsPrinting(false);
      setShowThermalPreview(true);
      // Automatically trigger system print if in appropriate environment
      // window.print(); 
    }, 2000);
  };

  const getShareText = () => {
    return `Bukti Transaksi PayRaya\n\nTotal: ${formatRupiah(transaction.amount)}\nKepada: ${transaction.recipientName || transaction.title}\nTanggal: ${formatFullDateTime(transaction.date)}\nStatus: BERHASIL\n\nTransfer aman dan cepat dengan PayRaya!`;
  };

  const handleDownload = async () => {
    if (receiptRef.current === null) return;
    setIsCapturing(true);
    try {
      const dataUrl = await toPng(receiptRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `PayRaya-Receipt-${transaction.id}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download receipt', err);
    } finally {
      setIsCapturing(false);
    }
  };

  const shareNative = async () => {
    if (receiptRef.current === null) return;
    setIsCapturing(true);
    try {
      const dataUrl = await toPng(receiptRef.current, { cacheBust: true, pixelRatio: 2 });
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], `Receipt-${transaction.id}.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Bukti Transaksi PayRaya',
          text: getShareText(),
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
    const text = encodeURIComponent(getShareText());
    window.open(`https://wa.me/?text=${text}`, '_blank');
    setShowShareMenu(false);
  };

  const shareTelegram = () => {
    const text = encodeURIComponent(getShareText());
    window.open(`https://t.me/share/url?url=${encodeURIComponent('https://payraya.com')}&text=${text}`, '_blank');
    setShowShareMenu(false);
  };

  const shareEmail = () => {
    const subject = encodeURIComponent('Bukti Transaksi PayRaya');
    const body = encodeURIComponent(getShareText());
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    setShowShareMenu(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getShareText());
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setShowShareMenu(false);
    }, 2000);
  };

  const isIncome = transaction.type === 'income' || transaction.type === 'topup';

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm mx-auto relative">
      {/* The visible part for the user */}
      <div 
        ref={receiptRef}
        className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-2xl relative overflow-hidden"
      >
        {/* Decorative elements for the "Bank Receipt" look */}
        <div className="absolute top-0 left-0 w-full h-2 bg-[#003A8F]"></div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50 rounded-full opacity-50"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-50 rounded-full opacity-50"></div>

        {/* Logo and Status */}
        <div className="flex flex-col items-center mb-8">
          <Logo size={48} className="mb-4" />
          <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-3">
             <CheckCircle2 size={36} />
          </div>
          <h2 className="text-xl font-black text-gray-800">Transaksi Berhasil</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">Struk Digital Resmi</p>
        </div>

        {/* Amount Section */}
        <div className="flex flex-col items-center py-6 border-y border-dashed border-gray-200 mb-8">
           <span className="text-xs text-gray-400 font-bold uppercase mb-1">Total Transaksi</span>
           <span className={`text-3xl font-black ${isIncome ? 'text-green-600' : 'text-[#003A8F]'}`}>
              {formatRupiah(transaction.amount)}
           </span>
        </div>

        {/* Details Grid */}
        <div className="flex flex-col gap-5">
           <DetailRow label="Tipe Transaksi" value={transaction.type === 'transfer' ? 'Transfer Saldo' : transaction.category} />
           
           <div className="w-full flex flex-col gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
              <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mb-1">Info Pengiriman</h4>
              
              {transaction.senderName && (
                <DetailRow label="Pengirim" value={transaction.senderName} />
              )}
              {transaction.senderAccountNumber && (
                <DetailRow label="No. Rekening" value={maskAccountNumber(transaction.senderAccountNumber)} />
              )}
              
              <div className="w-full h-px bg-gray-200/50 my-1"></div>

              {transaction.recipientName && (
                <DetailRow label="Penerima" value={transaction.recipientName} />
              )}
              {transaction.accountNumber && (
                <DetailRow label="No. Rekening" value={maskAccountNumber(transaction.accountNumber)} />
              )}
           </div>
           
           {transaction.bankName && (
             <DetailRow label="Bank Tujuan" value={transaction.bankName} />
           )}
           <DetailRow label="Tanggal & Waktu" value={formatFullDateTime(transaction.date)} />
           <DetailRow label="Nomor Referensi" value={transaction.id.toUpperCase()} />
           {transaction.note && (
             <DetailRow label="Catatan" value={transaction.note} isItalic />
           )}
           <DetailRow label="Status" value="BERHASIL" isBadge />
        </div>

        {/* Footer Security */}
        <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-gray-300">
           <ShieldCheck size={14} />
           <span className="text-[9px] font-bold uppercase tracking-widest">Terverifikasi oleh PayRaya Security</span>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
         <Button variant="outline" size="full" onClick={handleDownload} className="flex gap-2 items-center justify-center h-12" isLoading={isCapturing}>
            <Download size={18} />
            Simpan
         </Button>
         <Button size="full" onClick={() => setShowShareMenu(true)} className="flex gap-2 items-center justify-center bg-[#003A8F] h-12">
            <Share2 size={18} />
            Bagikan
         </Button>
         <button 
           onClick={handleThermalPrint}
           disabled={isPrinting}
           className="col-span-2 mt-2 flex flex-col items-center justify-center gap-2 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-400 font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-colors disabled:opacity-100 relative overflow-hidden"
         >
            {isPrinting ? (
              <>
                <div className="flex items-center gap-2 relative z-10">
                  <div className="w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                  Menghubungkan ke Printer Bluetooth...
                </div>
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="absolute bottom-0 left-0 h-1 bg-[#003A8F] w-full"
                />
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Printer size={16} />
                Cetak Struk (Bluetooth Thermal)
              </div>
            )}
         </button>
      </div>
      
      {onClose && (
        <button onClick={onClose} className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors">
          Tutup
        </button>
      )}

      {/* Thermal Print Preview */}
      <AnimatePresence>
        {showThermalPreview && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-5">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setShowThermalPreview(false)}
            />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-[300px] rounded-sm shadow-2xl relative z-10 overflow-hidden font-mono text-[10px] text-black"
            >
              <div className="p-6 bg-white flex flex-col items-center">
                <div className="w-full text-center mb-4 border-b border-black border-dashed pb-2">
                   <h3 className="font-black text-sm uppercase tracking-tighter">PayRaya Wallet</h3>
                   <p>PT. RAYA DIGITAL INDONESIA</p>
                   <p>JAKARTA, INDONESIA</p>
                </div>
                
                <div className="w-full flex justify-between mb-1">
                   <span>TRANSAKSI</span>
                   <span className="font-bold">BERHASIL</span>
                </div>
                <div className="w-full flex justify-between mb-4 pb-2 border-b border-black border-dashed">
                   <span>TANGGAL</span>
                   <span>{formatFullDateTime(transaction.date)}</span>
                </div>

                <div className="w-full mb-4 space-y-1">
                   <div className="flex justify-between">
                      <span>TYPE:</span>
                      <span>{transaction.type.toUpperCase()}</span>
                   </div>
                   <div className="flex justify-between">
                      <span>REF:</span>
                      <span>{transaction.id.substring(0, 12)}</span>
                   </div>
                   {transaction.recipientName && (
                     <div className="flex justify-between">
                        <span>TO:</span>
                        <span className="text-right truncate max-w-[150px]">{transaction.recipientName}</span>
                     </div>
                   )}
                   {transaction.bankName && (
                     <div className="flex justify-between">
                        <span>BANK:</span>
                        <span>{transaction.bankName}</span>
                     </div>
                   )}
                </div>

                <div className="w-full border-t border-black border-dashed pt-2 mt-2 flex flex-col items-center">
                   <span className="text-[8px] uppercase mb-1">Total Bayar</span>
                   <span className="text-xl font-black">{formatRupiah(transaction.amount)}</span>
                </div>

                <div className="mt-6 text-center border-t border-black border-dashed pt-4 w-full">
                   <p className="font-bold mb-1">TERIMA KASIH</p>
                   <p className="text-[8px]">SIMPAN STRUK INI SEBAGAI</p>
                   <p className="text-[8px]">BUKTI PEMBAYARAN SAH</p>
                </div>

                <div className="mt-8 opacity-20 transform -rotate-12 select-none pointer-events-none">
                   <Logo size={40} showText={false} />
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 flex flex-col gap-2 border-t border-gray-100">
                 <Button size="full" onClick={() => window.print()} className="bg-black text-white hover:bg-gray-800">
                   Cetak Sekarang
                 </Button>
                 <button 
                   onClick={() => setShowThermalPreview(false)}
                   className="text-[10px] font-black text-gray-400 uppercase tracking-widest py-2"
                 >
                   Tutup
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Enhanced Share Sheet */}
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
                <h3 className="text-lg font-black text-[#003A8F]">Bagikan Ke</h3>
                <button onClick={() => setShowShareMenu(false)} className="p-2 bg-gray-100 rounded-full text-gray-400">
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-8">
                <ShareOption 
                  icon={<MessageCircle size={24} />} 
                  label="WhatsApp" 
                  color="bg-green-50 text-green-600" 
                  onClick={shareWA} 
                />
                <ShareOption 
                  icon={<Send size={24} />} 
                  label="Telegram" 
                  color="bg-blue-50 text-blue-500" 
                  onClick={shareTelegram} 
                />
                <ShareOption 
                  icon={<Mail size={24} />} 
                  label="Email" 
                  color="bg-red-50 text-red-500" 
                  onClick={shareEmail} 
                />
                <ShareOption 
                  icon={copied ? <Check size={24} className="animate-bounce" /> : <Copy size={24} />} 
                  label={copied ? "Tersalin" : "Salin Teks"} 
                  color={copied ? "bg-green-100 text-green-700" : "bg-gray-50 text-gray-600"} 
                  onClick={copyToClipboard} 
                />
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

const ShareOption: React.FC<{ icon: React.ReactNode; label: string; color: string; onClick: () => void }> = ({ icon, label, color, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-2 group">
    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center shadow-sm group-active:scale-90 transition-transform`}>
      {icon}
    </div>
    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">{label}</span>
  </button>
);

const DetailRow: React.FC<{ label: string; value: string; isBadge?: boolean; isItalic?: boolean }> = ({ 
  label, value, isBadge, isItalic 
}) => (
  <div className="flex justify-between items-start text-sm">
    <span className="text-gray-400 font-bold uppercase text-[9px] mt-1 shrink-0">{label}</span>
    {isBadge ? (
      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider">
        {value}
      </span>
    ) : (
      <span className={`text-right font-bold text-gray-800 break-words max-w-[180px] ${isItalic ? 'italic' : ''}`}>
        {value}
      </span>
    )}
  </div>
);

