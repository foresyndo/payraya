import React from 'react';
import { Home, Repeat, History, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Screen } from '../types';

export const BottomNav: React.FC = () => {
  const { currentScreen, setScreen } = useApp();

  const navItems: { icon: any; label: string; screen: Screen }[] = [
    { icon: Home, label: 'Beranda', screen: 'home' },
    { icon: Repeat, label: 'Transaksi', screen: 'transfer' },
    { icon: History, label: 'Riwayat', screen: 'history' },
    { icon: User, label: 'Profil', screen: 'profile' },
  ];

  if (['login', 'register', 'auth'].includes(currentScreen)) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#f0f0f0] px-4 py-2 pb-6 flex justify-around items-center z-50 h-[70px]">
      {navItems.map((item) => {
        const isActive = currentScreen === item.screen;
        return (
          <button
            key={item.label}
            onClick={() => setScreen(item.screen)}
            className={`flex flex-col items-center gap-1 transition-all ${
              isActive ? 'text-[#003A8F] opacity-100' : 'text-gray-400 opacity-40'
            }`}
          >
            <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-bold">
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
