import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Trophy, 
  Target, 
  TrendingUp, 
  Plus, 
  ChevronRight,
  PiggyBank,
  Globe,
  Smartphone,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, Button } from '../components/UI';
import { formatRupiah } from '../utils/format';

export const GoalsScreen: React.FC = () => {
  const { setScreen } = useApp();

  const goals = [
    { title: 'Liburan ke Jepang', target: 20000000, current: 5400000, icon: <Globe size={20} />, color: 'bg-blue-500' },
    { title: 'iPhone 17 Pro', target: 25000000, current: 12000000, icon: <Smartphone size={20} />, color: 'bg-purple-600' },
    { title: 'Dana Darurat', target: 10000000, current: 9500000, icon: <ShieldCheck size={20} />, color: 'bg-green-500' },
  ];

  return (
    <div className="pb-24 pt-6 px-5 flex flex-col min-h-screen bg-[#f0f2f5]">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => setScreen('home')} className="p-2 bg-white rounded-lg shadow-sm border border-[#f0f0f0]">
            <ArrowLeft size={20} className="text-[#003A8F]" />
          </button>
          <h1 className="text-xl font-bold text-[#003A8F]">PayRaya Goals</h1>
        </div>
        <button className="w-10 h-10 bg-[#003A8F] text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform">
          <Plus size={24} />
        </button>
      </div>

      <Card className="bg-gradient-to-br from-[#003A8F] to-blue-700 p-6 text-white border-none mb-6 relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Total Tabungan Goals</span>
          <h2 className="text-3xl font-black mt-1">{formatRupiah(26900000)}</h2>
          <div className="flex items-center gap-2 mt-4">
            <div className="px-2 py-0.5 bg-green-500 text-[10px] font-black rounded-full">UP 12%</div>
            <span className="text-[10px] text-white/60 font-bold">Bulan ini</span>
          </div>
        </div>
        <Trophy size={100} className="absolute -right-6 -bottom-6 text-white/10" />
      </Card>

      <div className="flex flex-col gap-4">
        <h3 className="text-[13px] font-black text-gray-800 uppercase tracking-widest px-1">Goals Aktif</h3>
        {goals.map((goal, idx) => (
          <motion.div
            key={goal.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="p-5 flex flex-col gap-4 group cursor-pointer hover:border-[#003A8F] transition-all">
               <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                     <div className={`w-10 h-10 ${goal.color} text-white rounded-xl flex items-center justify-center shadow-md`}>
                        {goal.icon}
                     </div>
                     <div>
                        <h4 className="font-bold text-gray-800 text-sm">{goal.title}</h4>
                        <p className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                           <Target size={10} /> Target: {formatRupiah(goal.target)}
                        </p>
                     </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
               </div>

               <div className="space-y-2">
                  <div className="flex justify-between items-end">
                     <span className="text-[#003A8F] font-black text-xs">{formatRupiah(goal.current)}</span>
                     <span className="text-[10px] font-bold text-gray-400">{Math.round((goal.current / goal.target) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(goal.current / goal.target) * 100}%` }}
                        transition={{ duration: 1, delay: 0.5 + (idx * 0.1) }}
                        className={`h-full ${goal.color} shadow-[0_0_10px_rgba(0,0,0,0.1)]`}
                     />
                  </div>
               </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-4">
         <Card className="bg-amber-50 border-amber-100 p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
               <TrendingUp size={24} />
            </div>
            <div>
               <h4 className="text-sm font-black text-gray-800">Auto-Debit Goals</h4>
               <p className="text-[10px] text-gray-400 font-bold leading-tight">Makin cepet tercapai dengan nabung rutin otomatis setiap hari.</p>
            </div>
         </Card>
      </div>

      <Button size="full" variant="outline" className="mt-auto mb-4 border-2 border-dashed border-gray-200 text-gray-400">
         <PiggyBank size={18} className="mr-2" /> Lihat Goals yang Tercapai
      </Button>
    </div>
  );
};
