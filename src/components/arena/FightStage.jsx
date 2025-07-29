
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PlayerSprite = ({ player, isPlayer1, lastAction }) => {
  const [actionState, setActionState] = useState('idle');

  useEffect(() => {
    if (lastAction) {
      setActionState(lastAction.type);
      const timer = setTimeout(() => setActionState('idle'), 500);
      return () => clearTimeout(timer);
    }
  }, [lastAction]);

  const variants = {
    idle: { y: 0, scale: 1 },
    punch: { scale: 1.1, transition: { yoyo: Infinity, duration: 0.2 } },
    kick: { scale: 1.1, rotate: 5, transition: { yoyo: Infinity, duration: 0.2 } },
    hadouken: { scale: 1.2, transition: { yoyo: Infinity, duration: 0.3 } },
    hit: { x: isPlayer1 ? -10 : 10, rotate: isPlayer1 ? -5 : 5, backgroundColor: '#ef4444' },
    blocking: { scale: 0.9 },
  };

  return (
    <motion.div
      layout
      className="absolute bottom-0 w-24 h-48"
      style={{
        left: `calc(${player.position.x}% - 48px)`,
        transformOrigin: 'bottom center',
      }}
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: 1, 
        scaleX: isPlayer1 ? 1 : -1,
        ...(variants[actionState] || variants.idle)
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div
        className={`w-full h-full rounded-t-lg ${isPlayer1 ? 'bg-blue-500' : 'bg-red-600'} border-4 border-black`}
      >
        <div className="w-8 h-8 bg-yellow-300 rounded-full absolute top-2 left-1/2 -translate-x-1/2 border-2 border-black"></div>
      </div>
      <div className="absolute -top-6 text-center w-full text-white font-bold street-fighter-font text-shadow-heavy">
        {player.name}
      </div>
    </motion.div>
  );
};

const FightStage = ({ players, playerAddress, sendGameAction, gameState }) => {
  const player1 = players.find(p => p.address === playerAddress);
  const player2 = players.find(p => p.address !== playerAddress);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState.phase !== 'fighting') return;
      let action = null;
      switch (e.key.toLowerCase()) {
        case 'a': action = { type: 'punch' }; break;
        case 's': action = { type: 'kick' }; break;
        case 'd': action = { type: 'hadouken' }; break;
        case 'b': action = { type: 'blocking' }; break;
      }
      if (action) sendGameAction(action);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sendGameAction, gameState.phase]);

  const getStageBackground = () => 'bg-gradient-to-t from-orange-800 to-yellow-600';

  return (
    <div className={`w-full h-full relative overflow-hidden border-8 border-black rounded-lg ${getStageBackground()}`}>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/crissxcross.png')] opacity-10"></div>
      
      <AnimatePresence>
        {gameState.phase === 'pre_round' && (
           <motion.div
            key="pre_round"
            initial={{ scale: 2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
           >
            <h2 className="text-9xl font-black street-fighter-font text-yellow-300 text-shadow-heavy">
              Round {gameState.round}
            </h2>
           </motion.div>
        )}
        {gameState.phase === 'fighting' && (
           <motion.div
            key="fight"
            initial={{ scale: 3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, transition: { delay: 0.5, duration: 0.3 } }}
            exit={{ opacity: 0, transition: { duration: 2 } }}
            className="absolute inset-0 flex items-center justify-center"
           >
            <h2 className="text-9xl font-black street-fighter-font text-red-500 text-shadow-heavy animate-pulse">
              FIGHT!
            </h2>
           </motion.div>
        )}
         {gameState.phase === 'round_over' && (
            <motion.div
                key="round_over"
                initial={{ scale: 2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
            >
                <h2 className="text-9xl font-black street-fighter-font text-yellow-300 text-shadow-heavy">
                   K.O.
                </h2>
            </motion.div>
        )}
      </AnimatePresence>
      
      {player1 && <PlayerSprite player={player1} isPlayer1={true} lastAction={player1.lastAction} />}
      {player2 && <PlayerSprite player={player2} isPlayer1={false} lastAction={player2.lastAction} />}
    </div>
  );
};

export default FightStage;
