
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Crown, Trophy } from 'lucide-react';

const GameOverModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  const { reason, winner } = data;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "-100vh" }}
        animate={{ y: 0 }}
        exit={{ y: "100vh" }}
        transition={{ type: 'spring', stiffness: 150, damping: 20 }}
        className="p-10 max-w-2xl w-full text-center rounded-lg border-8 border-yellow-500 bg-blue-900"
        onClick={(e) => e.stopPropagation()}
      >
        <Trophy className="w-24 h-24 mx-auto text-yellow-400 mb-4 animate-pulse" />
        <h2 className="text-8xl font-black street-fighter-font mb-4">
          <span className="text-yellow-300">OYUN</span>
          <span className="text-red-500"> BİTTİ</span>
        </h2>
        
        <div className="bg-black/40 rounded-lg p-6 my-8">
          <h3 className="text-4xl font-bold street-fighter-font flex items-center justify-center mb-2">
            <Crown className="w-10 h-10 mr-4 text-yellow-400" />
            <span className="text-white">KAZANAN</span>
          </h3>
          <p className="text-6xl font-semibold street-fighter-font text-red-500 text-shadow-heavy">{winner?.name || 'Bilinmiyor'}</p>
        </div>

        <Button
          onClick={onClose}
          size="lg"
          className="street-fighter-font text-3xl tracking-widest bg-red-600 hover:bg-red-700 text-yellow-300 font-black py-6 px-12 rounded-lg border-4 border-red-800"
        >
          Lobiye Dön
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default GameOverModal;
