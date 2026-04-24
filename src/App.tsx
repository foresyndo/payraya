/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginScreen, RegisterScreen } from './screens/AuthScreens';
import { Dashboard } from './screens/Dashboard';
import { TransferScreen } from './screens/TransferScreen';
import { TopUpScreen } from './screens/TopUpScreen';
import { PaymentScreen } from './screens/PaymentScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { DepositoScreen, EMoneyScreen, PaylaterScreen, LoanScreen, WithdrawScreen } from './screens/FinancialScreens';
import { EWalletTopUpScreen } from './screens/EWalletTopUpScreen';
import { GoalsScreen } from './screens/GoalsScreen';
import { NotificationScreen } from './screens/NotificationScreen';
import { QRScreen } from './screens/QRScreen';
import { BottomNav } from './components/BottomNav';
import { ToastContainer } from './components/Toast';
import { PushNotificationContainer } from './components/PushNotification';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './components/Logo';

import { LoadingIndicator } from './components/LoadingIndicator';

const ScreenRenderer: React.FC = () => {
  const { currentScreen, isLoading, toasts, removeToast, pushNotifications, removePush } = useApp();
  const [showSplash, setShowSplash] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500); // Splash screen for 2.5 seconds
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-[#003A8F] z-[200] flex flex-col items-center justify-center p-12 overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-amber-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <motion.div
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="flex flex-col items-center relative z-10"
        >
           <Logo size={120} className="invert brightness-0" showText={false} />
           
           <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.5 }}
             className="mt-6 text-white text-5xl font-black tracking-tighter"
           >
             PayRaya
           </motion.div>

           <motion.div 
             initial={{ width: 0 }}
             animate={{ width: '100%' }}
             transition={{ delay: 1.2, duration: 1.2 }}
             className="h-1 bg-amber-400 mt-8 rounded-full shadow-[0_0_20px_rgba(251,191,36,0.8)]" 
           />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#F5F7FA] font-sans text-[#1F2937]">
      <AnimatePresence mode="wait">
        <motion.div
           key={currentScreen}
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           transition={{ duration: 0.3 }}
        >
          {currentScreen === 'login' && <LoginScreen />}
          {currentScreen === 'register' && <RegisterScreen />}
          {currentScreen === 'home' && <Dashboard />}
          {currentScreen === 'transfer' && <TransferScreen />}
          {currentScreen === 'topup' && <TopUpScreen />}
          {currentScreen === 'payment' && <PaymentScreen />}
          {currentScreen === 'history' && <HistoryScreen />}
          {currentScreen === 'profile' && <ProfileScreen />}
          {currentScreen === 'deposito' && <DepositoScreen />}
          {currentScreen === 'emoney' && <EMoneyScreen />}
          {currentScreen === 'ewallet' && <EWalletTopUpScreen />}
          {currentScreen === 'goals' && <GoalsScreen />}
          {currentScreen === 'paylater' && <PaylaterScreen />}
          {currentScreen === 'loan' && <LoanScreen />}
          {currentScreen === 'withdraw' && <WithdrawScreen />}
          {currentScreen === 'notifications' && <NotificationScreen />}
          {currentScreen === 'qr' && <QRScreen />}
        </motion.div>
      </AnimatePresence>

      <BottomNav />
      
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <PushNotificationContainer notifications={pushNotifications} removeNotification={removePush} />

      {/* Global Loading Overlay */}
      {isLoading && <LoadingIndicator />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <ScreenRenderer />
    </AppProvider>
  );
}
