import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Transaction, Screen, Notification } from '../types';
import { DUMMY_TRANSACTIONS } from '../constants';
import { supabase } from '../lib/supabase';
import { ToastMessage } from '../components/Toast';
import { PushNotificationInfo } from '../components/PushNotification';
import { formatRupiah } from '../utils/format';

interface AppContextType {
  user: User | null;
  transactions: Transaction[];
  notifications: Notification[];
  toasts: ToastMessage[];
  pushNotifications: PushNotificationInfo[];
  currentScreen: Screen;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, password: string, pin: string) => Promise<boolean>;
  logout: () => void;
  setScreen: (screen: Screen) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date' | 'userId'>) => Promise<Transaction>;
  transferPayRaya: (recipientPhone: string, amount: number, note?: string) => Promise<Transaction>;
  updateBalance: (amount: number) => void;
  updateUserPin: (newPin: string) => void;
  updateUserPassword: (newPassword: string) => void;
  activatePaylater: () => Promise<void>;
  markAsRead: (id: string) => void;
  unreadCount: number;
  toggleBiometric: (enabled: boolean) => Promise<void>;
  biometricLogin: () => Promise<boolean>;
  findUserByPhone: (phone: string) => User | undefined;
  isBiometricAvailable: boolean;
  themeColor: string;
  setThemeColor: (color: string) => void;
  selectedEWallet: string | null;
  setSelectedEWallet: (wallet: string | null) => void;
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  showPush: (notif: Omit<PushNotificationInfo, 'id'>) => void;
  removePush: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [pushNotifications, setPushNotifications] = useState<PushNotificationInfo[]>([]);

  useEffect(() => {
    // Check if browser supports biometric authentication
    if (window.PublicKeyCredential) {
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        .then(available => setIsBiometricAvailable(available));
    }
  }, []);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('payraya_all_users');
    return saved ? JSON.parse(saved) : [];
  });
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('payraya_transactions');
    return saved ? JSON.parse(saved) : DUMMY_TRANSACTIONS;
  });
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('payraya_notifications');
    return saved ? JSON.parse(saved) : [
      {
        id: 'n1',
        title: 'Promo Cashback 50%',
        message: 'Nikmati cashback hingga 50% untuk pembayaran tagihan listrik pertama kamu!',
        type: 'promo',
        date: new Date().toISOString(),
        isRead: false,
        imageUrl: 'https://picsum.photos/seed/promo/800/400'
      },
      {
        id: 'n2',
        title: 'Pembaruan Sistem',
        message: 'Kini PayRaya hadir dengan fitur Tarik Tunai tanpa kartu di ATM terdekat.',
        type: 'update',
        date: new Date(Date.now() - 86400000).toISOString(),
        isRead: true
      }
    ];
  });
  const [currentScreen, setCurrentScreen] = useState<Screen>('topup');
  const [isLoading, setIsLoading] = useState(false);
  const [themeColor, setThemeColor] = useState(() => {
    return localStorage.getItem('payraya_theme_color') || '#003A8F';
  });
  const [selectedEWallet, setSelectedEWallet] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', themeColor);
    localStorage.setItem('payraya_theme_color', themeColor);
  }, [themeColor]);

  useEffect(() => {
    const savedUser = localStorage.getItem('payraya_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentScreen('home');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('payraya_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('payraya_all_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    localStorage.setItem('payraya_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('payraya_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('payraya_user');
    }
  }, [user]);

  const showToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showPush = (notif: Omit<PushNotificationInfo, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setPushNotifications(prev => [...prev, { ...notif, id }]);
  };

  const removePush = (id: string) => {
    setPushNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Supabase Real-time Transaction Listener
  useEffect(() => {
    if (user && supabase) {
      const channel = supabase
        .channel('realtime_transactions')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'transactions',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            const newTx = payload.new as Transaction;
            
            // Check if we already have this transaction locally (from addTransaction)
            setTransactions(prev => {
              if (prev.find(t => t.id === newTx.id)) return prev;
              
              // If it's new (e.g. from another device or incoming transfer)
              // Add to notifications
              const summary = `${formatRupiah(newTx.amount)} ${newTx.type === 'income' ? 'dari' : 'ke'} ${newTx.bankName || 'PayRaya'}`;

              const newNotif: Notification = {
                id: `n-tx-${newTx.id}`,
                title: 'Transaksi Berhasil',
                message: summary,
                type: 'transaction',
                date: new Date().toISOString(),
                isRead: false
              };
              
              setNotifications(nPrev => [newNotif, ...nPrev]);
              
              showPush({
                title: newTx.type === 'income' ? 'Dana Masuk' : 'Transaksi Berhasil',
                message: summary,
                type: newTx.type === 'income' ? 'incoming' : 'outgoing',
                amount: newTx.amount
              });

              return [newTx, ...prev];
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  // Sync with Supabase if available
  useEffect(() => {
    if (user && supabase) {
      const syncData = async () => {
        // Fetch real notifications from Supabase
        const { data: promoData } = await supabase
          .from('notifications')
          .select('*')
          .order('date', { ascending: false });
        
        if (promoData && promoData.length > 0) {
          setNotifications(prev => {
            const existingIds = new Set(prev.map(n => n.id));
            const newNotifs = promoData.filter(n => !existingIds.has(n.id));
            return [...newNotifs, ...prev];
          });
        }
      };
      syncData();
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Supabase Login simulation/integration
    if (supabase) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .or(`email.eq.${email},phone.eq.${email}`)
        .single();
      
      if (data && !error) {
        // In a real app we'd verify password on server
        setUser(data);
        setCurrentScreen('home');
        setIsLoading(false);
        return true;
      }
    }

    // Fallback to local storage users
    const existingUser = registeredUsers.find(u => (u.email === email || u.phone === email));

    if (existingUser) {
      // Validate password if it exists
      if (existingUser.password && existingUser.password !== password) {
        setIsLoading(false);
        alert('Kata sandi salah.');
        return false;
      }
      
      setUser(existingUser);
      setCurrentScreen('home');
      setIsLoading(false);
      return true;
    }

    // Default demo user if no users are registered yet and it matches standard demo credentials
    if (registeredUsers.length === 0 && (email === 'user@payraya.com' || email === '081234567890')) {
      const defaultUser: User = {
        id: 'u1',
        name: 'User Handal',
        email: 'user@payraya.com',
        phone: '081234567890',
        password: 'password123',
        balance: 10500000,
        pin: '123456'
      };
      setUser(defaultUser);
      setRegisteredUsers([defaultUser]);
      setCurrentScreen('home');
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    alert('Email atau No. Handphone tidak ditemukan.');
    return false;
  };

  const register = async (name: string, email: string, phone: string, password: string, pin: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Check if user already exists
    const userExists = registeredUsers.some(u => u.email === email || u.phone === phone);
    if (userExists) {
      setIsLoading(false);
      alert('Email atau Nomor Handphone sudah terdaftar.');
      return false;
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      phone,
      password,
      balance: 1000000, // Initial bonus
      pin
    };

    if (supabase) {
      const { error } = await supabase.from('users').insert([newUser]);
      if (error) {
        console.error('Supabase save error:', error);
      }
    }

    setRegisteredUsers(prev => [...prev, newUser]);
    setUser(newUser);
    setCurrentScreen('home');
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    setCurrentScreen('login');
  };

  const setScreen = (screen: Screen) => setCurrentScreen(screen);

  const transferPayRaya = async (recipientPhone: string, amount: number, note?: string): Promise<Transaction> => {
    if (!user) throw new Error("User not logged in");

    // Find Recipient
    const recipient = registeredUsers.find(u => u.phone === recipientPhone);

    // 1. Process Sender Transaction
    const senderTx = await addTransaction({
      type: 'transfer',
      amount: amount,
      title: `Transfer ke ${recipientPhone}`,
      category: 'Transfer',
      bankName: 'PayRaya',
      accountNumber: recipientPhone,
      recipientName: recipient?.name || recipientPhone,
      senderName: user.name,
      senderAccountNumber: user.phone,
      status: 'success',
      note
    });
    
    if (recipient) {
      // Logic for adding balance to recipient
      const updatedUsers = registeredUsers.map(u => {
        if (u.phone === recipientPhone) {
          return { ...u, balance: u.balance + amount };
        }
        return u;
      });
      setRegisteredUsers(updatedUsers);

      // Create income transaction for recipient (simulate)
      const recipientTx: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        userId: recipient.id,
        type: 'income',
        amount: amount,
        title: `Dana Masuk dari ${user.name || user.phone}`,
        category: 'Income',
        bankName: 'PayRaya',
        accountNumber: user.phone,
        recipientName: recipient.name,
        senderName: user.name,
        senderAccountNumber: user.phone,
        status: 'success',
        date: new Date().toISOString(),
        note
      };

      setTransactions(prev => [recipientTx, ...prev]);
      
      if (supabase) {
        await supabase.from('users').update({ balance: recipient.balance + amount }).eq('id', recipient.id);
        await supabase.from('transactions').insert([{ ...recipientTx, user_id: recipient.id }]);
      }
    }

    return senderTx;
  };

  const addTransaction = async (t: Omit<Transaction, 'id' | 'date' | 'userId'>): Promise<Transaction> => {
    if (!user) throw new Error("User not logged in");

    const newTransaction: Transaction = {
      ...t,
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      date: new Date().toISOString()
    };
    
    if (supabase && user) {
      await supabase.from('transactions').insert([{ ...newTransaction, user_id: user.id }]);
    }

    setTransactions(prev => [newTransaction, ...prev]);
    
    const summary = `${formatRupiah(newTransaction.amount)} ${newTransaction.type === 'income' ? 'dari' : 'ke'} ${newTransaction.bankName || 'PayRaya'}`;

    // Add to notifications log
    const newNotif: Notification = {
      id: `n-tx-${newTransaction.id}`,
      title: 'Transaksi Berhasil',
      message: summary,
      type: 'transaction',
      date: newTransaction.date,
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    
    // Show Push Notification
    showPush({
      title: newTransaction.type === 'income' ? 'Dana Masuk' : 'Transaksi Berhasil',
      message: summary,
      type: newTransaction.type === 'income' ? 'incoming' : 'outgoing',
      amount: newTransaction.amount
    });

    // Show visual toast
    showToast({
      title: 'Transaksi Berhasil',
      message: `${newTransaction.title} - ${newTransaction.type === 'income' ? 'Dana Masuk' : 'Dana Keluar'}`,
      type: 'success',
      amount: newTransaction.amount
    });
    
    if (t.status === 'success') {
       if (t.type === 'income' || t.type === 'topup') {
         updateBalance(t.amount);
       } else {
         updateBalance(-t.amount);
       }
    }

    return newTransaction;
  };

  const updateBalance = async (amount: number) => {
    if (user) {
      const newBalance = user.balance + amount;
      setUser({ ...user, balance: newBalance });
      
      if (supabase) {
        await supabase.from('users').update({ balance: newBalance }).eq('id', user.id);
      }
    }
  };

  const updateUserPin = async (newPin: string) => {
    if (user) {
      setUser({ ...user, pin: newPin });
      if (supabase) {
        await supabase.from('users').update({ pin: newPin }).eq('id', user.id);
      }
    }
  };

  const updateUserPassword = (_newPassword: string) => {
    // Password simulation
  };

  const activatePaylater = async () => {
    if (!user) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const updatedUser = { 
      ...user, 
      isPaylaterActive: true, 
      paylaterLimit: 15000000 
    };
    setUser(updatedUser);
    setRegisteredUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    
    if (supabase) {
      await supabase.from('users').update({ 
        isPaylaterActive: true, 
        paylaterLimit: 15000000 
      }).eq('id', user.id);
    }

    setIsLoading(false);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const toggleBiometric = async (enabled: boolean) => {
    if (!user) return;
    const updatedUser = { ...user, isBiometricEnabled: enabled };
    setUser(updatedUser);
    
    if (enabled) {
      localStorage.setItem('payraya_biometric_user', JSON.stringify({ 
        email: user.email, 
        id: user.id 
      }));
    } else {
      localStorage.removeItem('payraya_biometric_user');
    }

    if (supabase) {
      await supabase.from('users').update({ isBiometricEnabled: enabled }).eq('id', user.id);
    }
  };

  const findUserByPhone = (phone: string) => {
    return registeredUsers.find(u => u.phone === phone);
  };

  const biometricLogin = async (): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const bioData = localStorage.getItem('payraya_biometric_user');
    if (!bioData) {
      setIsLoading(false);
      return false;
    }

    const { email } = JSON.parse(bioData);
    const existingUser = registeredUsers.find(u => u.email === email);

    if (existingUser && existingUser.isBiometricEnabled) {
      setUser(existingUser);
      setCurrentScreen('home');
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const userTransactions = transactions.filter(t => t.userId === user?.id);

  return (
    <AppContext.Provider value={{
      user,
      transactions: userTransactions,
      notifications,
      toasts,
      pushNotifications,
      currentScreen,
      isLoading,
      login,
      register,
      logout,
      setScreen,
      addTransaction,
      transferPayRaya,
      updateBalance,
      updateUserPin,
      updateUserPassword,
      activatePaylater,
      markAsRead,
      unreadCount,
      findUserByPhone,
      toggleBiometric,
      biometricLogin,
      isBiometricAvailable,
      themeColor,
      setThemeColor,
      selectedEWallet,
      setSelectedEWallet,
      showToast,
      removeToast,
      showPush,
      removePush
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
