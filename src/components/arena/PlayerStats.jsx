import React from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

const StatBar = ({ value, max, colorClass, animate = true }) => (
  <div className="w-full bg-gray-700 rounded-full h-2.5">
    <motion.div
      className={`${colorClass} h-2.5 rounded-full`}
      initial={animate ? { width: 0 } : false}
      animate={{ width: `${(value / max) * 100}%` }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    />
  </div>
);

const PlayerStats = ({ stats }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="game-card rounded-2xl p-6"
    >
      <h3 className="text-lg font-bold orbitron mb-4 flex items-center">
        <Target className="w-5 h-5 mr-2 text-purple-400" />
        İstatistiklerin
      </h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Sağlık</span>
            <span>{stats.health}/100</span>
          </div>
          <StatBar value={stats.health} max={100} colorClass="bg-red-500" />
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Enerji</span>
            <span>{stats.energy}/100</span>
          </div>
          <StatBar value={stats.energy} max={100} colorClass="energy-bar" />
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{stats.kills}</div>
            <div className="text-xs text-gray-400">Eliminasyon</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{stats.score}</div>
            <div className="text-xs text-gray-400">Skor</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlayerStats;