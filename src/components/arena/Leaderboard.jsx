import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

const Leaderboard = ({ players, playerAddress }) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  const getRankColor = (index) => {
    if (index === 0) return 'bg-yellow-500';
    if (index === 1) return 'bg-gray-400';
    if (index === 2) return 'bg-orange-500';
    return 'bg-gray-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="game-card rounded-2xl p-6"
    >
      <h3 className="text-lg font-bold orbitron mb-4 flex items-center">
        <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
        Sıralama
      </h3>
      
      <div className="space-y-3">
        {sortedPlayers.map((player, index) => (
          <div
            key={player.id}
            className={`flex items-center justify-between p-2 rounded-lg transition-all duration-300 ${
              player.address === playerAddress 
                ? 'bg-purple-500/20 border border-purple-400/30 scale-105' 
                : 'bg-gray-800/50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getRankColor(index)}`}>
                {index + 1}
              </div>
              <div>
                <div className="text-sm font-semibold">{player.name}</div>
                <div className="text-xs text-gray-400">
                  {player.address?.slice(0, 6)}...{player.address?.slice(-4)}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-purple-400">{player.score}</div>
              <div className={`text-xs ${player.health > 0 ? 'text-green-400' : 'text-red-500'}`}>
                {player.health > 0 ? `HP: ${player.health}` : 'Elendi'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Leaderboard;