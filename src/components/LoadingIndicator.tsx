import React from 'react';
import { motion } from 'motion/react';
import { Logo } from './Logo';

export const LoadingIndicator: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-[#003A8F]/95 backdrop-blur-md z-[200] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Flowing Elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          borderRadius: ["40%", "50%", "40%"],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute w-[600px] h-[600px] bg-white/5 blur-3xl -z-10"
      />
      
      <div className="relative flex flex-col items-center">
        {/* Main Logo Animation */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotateY: [0, 180, 360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative perspective-1000"
        >
          {/* Orbital Particles */}
          {[0, 72, 144, 216, 288].map((angle, i) => (
            <motion.div
              key={i}
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.2
              }}
              className="absolute inset-0"
            >
              <motion.div
                animate={{
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
                className="w-2 h-2 bg-amber-400 rounded-full absolute -top-4 left-1/2 -translate-x-1/2 blur-[1px]"
              />
            </motion.div>
          ))}

          {/* Glowing Ring */}
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.6, 0, 0.6],
              rotate: [0, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -inset-6 border-[3px] border-dashed border-amber-400/30 rounded-full"
          />
          
          <Logo size={110} className="invert brightness-0 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" showText={false} />
        </motion.div>

        {/* Brand Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="flex gap-2 justify-center mb-4">
             {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: [8, 20, 8],
                    backgroundColor: ["#ffffff", "#fbbf24", "#ffffff"],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                  className="w-1 rounded-full opacity-80"
                />
             ))}
          </div>
          <p className="text-white text-xs font-black uppercase tracking-[0.4em] drop-shadow-md">
            PayRaya <span className="text-amber-400">Secure</span>
          </p>
          <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest mt-2">
            Sedang Menyiapkan Pengalaman Anda
          </p>
        </motion.div>
      </div>

      {/* Modern Wave Lines */}
      <div className="absolute bottom-0 left-0 w-full h-[100px] opacity-20 pointer-events-none">
        <svg viewBox="0 0 1440 320" className="w-full h-full preserve-3d">
          <motion.path
            animate={{
              d: [
                "M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,186.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                "M0,192L48,176C96,160,192,128,288,128C384,128,480,160,576,181.3C672,203,768,245,864,240C960,235,1056,181,1152,154.7C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            fill="#ffffff"
          />
        </svg>
      </div>
    </div>
  );
};
