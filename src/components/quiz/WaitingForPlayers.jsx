import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck } from 'lucide-react';

const WaitingForPlayers = ({ players }) => {
  return (
    <div className="game-card rounded-2xl p-8 max-w-2xl w-full mx-auto text-center">
      <h2 className="text-4xl font-black orbitron mb-6">Waiting for Players...</h2>
      
      <div className="flex justify-center mb-8">
        <motion.div
          className="w-20 h-20 border-4 border-blue-500/50 rounded-full border-t-blue-400"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="space-y-4">
        {players.map((player, index) => (
          <motion.div
            key={player.address}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 * index }}
            className="flex items-center gap-4 p-4 rounded-lg bg-gray-800/50"
          >
            <img  alt="Player avatar" class="w-12 h-12 rounded-full" src="https://images.unsplash.com/photo-1635003913011-95971abba560" />
            <span className="font-semibold text-lg">{player.name}</span>
            <UserCheck className="w-6 h-6 text-green-500 ml-auto" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WaitingForPlayers;