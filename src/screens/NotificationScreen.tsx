import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Bell, Gift, Info, CheckCircle2, ChevronRight, X, ExternalLink, ShieldCheck, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, Button } from '../components/UI';
import { formatDate } from '../utils/format';
import { Notification } from '../types';

export const NotificationScreen: React.FC = () => {
  const { notifications, setScreen, markAsRead } = useApp();
  const [selectedPromo, setSelectedPromo] = useState<Notification | null>(null);

  const getIcon = (notif: Notification) => {
    switch (notif.type) {
      case 'promo': return <Gift className="text-amber-500" size={20} />;
      case 'update': return <Info className="text-blue-500" size={20} />;
      default: return <Bell className="text-gray-500" size={20} />;
    }
  };

  const handleNotifClick = (notif: Notification) => {
    markAsRead(notif.id);
  };

  const handleLearnMore = (e: React.MouseEvent, notif: Notification) => {
    e.stopPropagation();
    markAsRead(notif.id);
    setSelectedPromo(notif);
  };

  return (
    <div className="pb-24 pt-6 px-5 flex flex-col min-h-screen bg-[#F5F7FA] relative">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => setScreen('home')} className="p-2 bg-white rounded-lg shadow-sm active:scale-95 transition-transform">
          <ArrowLeft size={20} className="text-[#003A8F]" />
        </button>
        <h1 className="text-xl font-bold text-[#003A8F]">Notifikasi</h1>
      </div>

      <div className="flex flex-col gap-3">
        {notifications.length > 0 ? (
          notifications.map((notif, index) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                className={`relative overflow-hidden cursor-pointer active:scale-[0.98] transition-all border-l-4 ${notif.isRead ? 'border-transparent opacity-80' : 'border-[#003A8F] shadow-md shadow-blue-50'}`}
                onClick={() => handleNotifClick(notif)}
              >
                {!notif.isRead && (
                  <div className="absolute top-3 right-3 w-2 h-2 bg-[#003A8F] rounded-full shadow-[0_0_8px_rgba(0,58,143,0.5)]"></div>
                )}
                
                <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notif.type === 'promo' ? 'bg-amber-50' : 'bg-blue-50'}`}>
                    {getIcon(notif)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`text-sm font-bold leading-tight ${notif.isRead ? 'text-gray-600' : 'text-[#003A8F]'}`}>
                        {notif.title}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed mb-3">
                      {notif.message}
                    </p>
                    {notif.imageUrl && (
                      <div className="rounded-xl overflow-hidden mb-3 aspect-video bg-gray-100 shadow-inner">
                        <img 
                          src={notif.imageUrl} 
                          alt="Promo" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-gray-400 font-medium">{formatDate(notif.date)}</span>
                      <div className="flex items-center gap-3">
                        {notif.type === 'promo' && (
                          <button 
                            onClick={(e) => handleLearnMore(e, notif)}
                            className="text-[11px] font-black text-[#003A8F] uppercase tracking-wider flex items-center gap-1 hover:underline active:opacity-70"
                          >
                            Pelajari Lebih Lanjut <ChevronRight size={14} />
                          </button>
                        )}
                        {notif.isRead && <CheckCircle2 size={12} className="text-gray-300" />}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 opacity-40">
            <Bell size={48} className="mb-4" />
            <p className="text-sm font-medium">Belum ada notifikasi untukmu</p>
          </div>
        )}
      </div>

      {/* Promo Detail Modal */}
      <AnimatePresence>
        {selectedPromo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedPromo(null)}
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[32px] p-8 pb-12 shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header decor */}
              <div className="absolute top-0 left-0 w-full h-2 bg-amber-400"></div>
              
              <button 
                onClick={() => setSelectedPromo(null)}
                className="absolute top-6 right-6 p-2 bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-[24px] flex items-center justify-center mb-4 shadow-inner">
                  <Gift size={32} />
                </div>
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] mb-2 text-center">Penawaran Eksklusif</span>
                <h2 className="text-xl font-black text-center text-gray-800 leading-tight">
                  {selectedPromo.title}
                </h2>
              </div>

              {selectedPromo.imageUrl && (
                <div className="rounded-2xl overflow-hidden mb-6 aspect-video shadow-lg">
                  <img 
                    src={selectedPromo.imageUrl} 
                    alt="Detail Promo" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                   <p className="text-sm text-gray-600 leading-relaxed">
                     {selectedPromo.message}
                   </p>
                   <p className="text-xs text-gray-400 mt-4 italic">
                     * Syarat & ketentuan berlaku. Promo ini hanya dapat digunakan satu kali per pengguna selama periode program.
                   </p>
                </div>
                
                <div className="flex flex-col gap-3">
                   <div className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100/50">
                      <ShieldCheck size={18} className="text-blue-500" />
                      <span className="text-[10px] font-black text-blue-700 uppercase">Transaksi Aman Terlindungi</span>
                   </div>
                   <div className="flex items-center gap-3 p-3 bg-amber-50/50 rounded-xl border border-amber-100/50">
                      <Zap size={18} className="text-amber-500" />
                      <span className="text-[10px] font-black text-amber-700 uppercase">Cashback Langsung Cair</span>
                   </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                 <Button size="full" onClick={() => setSelectedPromo(null)} className="bg-[#003A8F] shadow-lg shadow-blue-100">
                    Gunakan Sekarang
                 </Button>
                 <Button size="full" variant="ghost" onClick={() => setSelectedPromo(null)} className="flex items-center justify-center gap-2">
                    <ExternalLink size={16} />
                    <span className="text-xs">Baca S&K Lengkap</span>
                 </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
