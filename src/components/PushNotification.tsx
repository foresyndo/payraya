import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, ArrowDownLeft, ArrowUpRight, X } from 'lucide-react';
import { formatRupiah } from '../utils/format';
import { Logo } from './Logo';

export interface PushNotificationInfo {
  id: string;
  title: string;
  message: string;
  type: 'incoming' | 'outgoing' | 'info';
  amount?: number;
}

interface PushNotificationContainerProps {
  notifications: PushNotificationInfo[];
  removeNotification: (id: string) => void;
}

export const PushNotification: React.FC<PushNotificationInfo & { onClose: () => void }> = ({
  title,
  message,
  type,
  amount,
  onClose
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 6000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const Icon = type === 'incoming' ? ArrowDownLeft : type === 'outgoing' ? ArrowUpRight : Bell;
  const iconColor = type === 'incoming' ? 'text-green-500' : type === 'outgoing' ? 'text-red-500' : 'text-blue-500';

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 150 }}
      className="w-[92vw] max-w-sm bg-white/90 backdrop-blur-xl rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/50 p-4 flex gap-4 pointer-events-auto overflow-hidden relative"
    >
      {/* App Identifier */}
      <div className="absolute top-2 right-4 flex items-center gap-1.5 opacity-30">
        <Logo size={12} showText={false} />
        <span className="text-[8px] font-black uppercase tracking-widest text-[#003A8F]">PayRaya</span>
      </div>

      <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center shrink-0 ${type === 'incoming' ? 'bg-green-50' : type === 'outgoing' ? 'bg-red-50' : 'bg-blue-50'}`}>
        <Icon className={iconColor} size={24} />
      </div>

      <div className="flex-1 min-w-0 pr-4">
        <h4 className="text-sm font-black text-gray-900 leading-tight mb-0.5">{title}</h4>
        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{message}</p>
        
        {amount !== undefined && (
          <div className="mt-2 flex items-baseline gap-1">
             <span className={`text-lg font-black tracking-tight ${type === 'incoming' ? 'text-green-600' : 'text-red-600'}`}>
               {type === 'incoming' ? '+' : '-'}{formatRupiah(amount)}
             </span>
          </div>
        )}
      </div>

      {/* Touch Handle for swipe feel */}
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-gray-100 rounded-full" />
    </motion.div>
  );
};

export const PushNotificationContainer: React.FC<PushNotificationContainerProps> = ({ notifications, removeNotification }) => {
  return (
    <div className="fixed top-4 left-0 right-0 z-[1000] flex flex-col items-center gap-3 pointer-events-none px-4">
      <AnimatePresence>
        {notifications.map((notif) => (
          <PushNotification 
            key={notif.id} 
            {...notif} 
            onClose={() => removeNotification(notif.id)} 
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
