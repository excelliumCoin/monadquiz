import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';

const RoundTransition = ({ round, totalRounds }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center h-[400px]">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
      >
        <BrainCircuit className="w-24 h-24 text-blue-400 mb-8" />
      </motion.div>
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-6xl font-black orbitron mb-4"
      >
        Round {round}
      </motion.h2>
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-2xl text-gray-400"
      >
        Get Ready!
      </motion.p>
    </div>
  );
};

export default RoundTransition;