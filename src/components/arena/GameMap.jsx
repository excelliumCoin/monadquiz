import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Heart, Zap, Sword } from 'lucide-react';

const PlayerAvatar = ({ player, isMe }) => (
  <motion.div
    key={player.id}
    layout
    className="absolute w-8 h-8 player-avatar rounded-full flex items-center justify-center text-xs font-bold border-2"
    style={{
      left: `${player.position.x}%`,
      top: `${player.position.y}%`,
      borderColor: isMe ? '#a78bfa' : 'transparent',
      opacity: player.health > 0 ? 1 : 0.3,
    }}
    animate={{
      scale: isMe ? [1, 1.2, 1] : 1,
    }}
    transition={{
      duration: 2,
      repeat: isMe ? Infinity : 0,
    }}
  >
    {player.name.charAt(0)}
    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 rounded px-2 py-1 text-xs whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity z-10">
      <div className="text-white font-semibold">{player.name}</div>
      <div className="text-red-400">HP: {player.health}</div>
      <div className="text-blue-400">Enerji: {player.energy}</div>
    </div>
    {player.health <= 0 && (
      <div className="absolute text-2xl">💀</div>
    )}
  </motion.div>
);

const PowerUp = ({ powerup }) => (
  <motion.div
    className="absolute w-6 h-6 rounded-full flex items-center justify-center"
    style={{
      left: `${powerup.x}%`,
      top: `${powerup.y}%`,
      transform: 'translate(-50%, -50%)'
    }}
    animate={{ scale: [1, 1.3, 1], rotate: [0, 360] }}
    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
  >
    {powerup.type === 'health' && <Heart className="w-4 h-4 text-red-400" />}
    {powerup.type === 'energy' && <Zap className="w-4 h-4 text-blue-400" />}
    {powerup.type === 'weapon' && <Sword className="w-4 h-4 text-yellow-400" />}
  </motion.div>
);

const GameMap = ({ players, playerAddress, onPlayerMove }) => {
  const powerups = [
    { x: 25, y: 30, type: 'health' },
    { x: 75, y: 70, type: 'energy' },
    { x: 50, y: 20, type: 'weapon' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="game-card rounded-2xl p-6 h-[600px] relative overflow-hidden"
    >
      <div className="absolute inset-0 game-grid opacity-30"></div>
      
      <div className="relative w-full h-full">
        {players.map((player) => (
          <PlayerAvatar key={player.id} player={player} isMe={player.address === playerAddress} />
        ))}
        
        {powerups.map((powerup, index) => (
          <PowerUp key={index} powerup={powerup} />
        ))}
      </div>
      
      <div className="absolute bottom-4 right-4">
        <div className="grid grid-cols-3 gap-1 bg-black/30 p-1 rounded-lg">
          <div></div>
          <Button size="sm" variant="ghost" className="w-10 h-10 p-0 text-xl" onClick={() => onPlayerMove('up')}>↑</Button>
          <div></div>
          <Button size="sm" variant="ghost" className="w-10 h-10 p-0 text-xl" onClick={() => onPlayerMove('left')}>←</Button>
          <div></div>
          <Button size="sm" variant="ghost" className="w-10 h-10 p-0 text-xl" onClick={() => onPlayerMove('right')}>→</Button>
          <div></div>
          <Button size="sm" variant="ghost" className="w-10 h-10 p-0 text-xl" onClick={() => onPlayerMove('down')}>↓</Button>
          <div></div>
        </div>
      </div>
    </motion.div>
  );
};

export default GameMap;