import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Users } from 'lucide-react';

const GameHeader = ({ onBackToLobby, gameTime, playerCount, myScore }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between mb-6"
    >
      <Button
        onClick={onBackToLobby}
        variant="outline"
        className="border-purple-400/50 text-purple-400 hover:bg-purple-400/10"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Oyundan Çık
      </Button>
      
      <div className="text-center">
        <h1 className="text-2xl font-bold orbitron bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          SAVAŞ ARENASI
        </h1>
        <div className="flex items-center justify-center space-x-4 mt-2">
          <div className="flex items-center space-x-2 text-green-400">
            <Clock className="w-4 h-4" />
            <span className="font-mono">{formatTime(gameTime)}</span>
          </div>
          <div className="flex items-center space-x-2 text-blue-400">
            <Users className="w-4 h-4" />
            <span>{playerCount}/8</span>
          </div>
        </div>
      </div>
      
      <div className="text-right w-28">
        <div className="text-sm text-gray-400">Skor</div>
        <div className="text-xl font-bold text-purple-400">{myScore}</div>
      </div>
    </motion.div>
  );
};

export default GameHeader;