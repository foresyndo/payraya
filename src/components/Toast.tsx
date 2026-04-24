import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, Bell, X } from 'lucide-react';
import { formatRupiah } from '../utils/format';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
  amount?: number;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

export const Toast: React.FC<ToastMessage & { onClose: () => void }> = ({ 
  title, 
  message, 
  type, 
  amount, 
  onClose 
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle2 className="text-green-500" size={24} />,
    error: <XCircle className="text-red-500" size={24} />,
    info: <Bell className="text-blue-500" size={24} />
  };

  const colors = {
    success: 'border-green-100 bg-green-50',
    error: 'border-red-100 bg-red-50',
    info: 'border-blue-100 bg-blue-50'
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0, scale: 0.9 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: -20, opacity: 0, scale: 0.9 }}
      className={`
        w-[90vw] max-w-sm p-4 rounded-2xl border shadow-xl backdrop-blur-md flex gap-4 items-start relative
        ${colors[type]}
      `}
    >
      <div className="shrink-0 mt-1">
        {icons[type]}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-black text-gray-900 text-sm">{title}</h4>
        <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{message}</p>
        {amount !== undefined && (
          <p className="text-lg font-black text-[#003A8F] mt-2">
            {formatRupiah(amount)}
          </p>
        )}
      </div>
      <button 
        onClick={onClose}
        className="shrink-0 p-1 hover:bg-black/5 rounded-full text-gray-400"
      >
        <X size={16} />
      </button>

      {/* Progress bar */}
      <motion.div 
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: 5, ease: "linear" }}
        className="absolute bottom-0 left-0 h-1 bg-black/5 rounded-full"
      />
    </motion.div>
  );
};

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[500] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast 
              {...toast} 
              onClose={() => removeToast(toast.id)} 
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};
