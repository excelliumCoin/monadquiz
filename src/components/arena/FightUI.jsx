
import React from 'react';
import { motion } from 'framer-motion';

const HealthBar = ({ health, isPlayer1 }) => {
  return (
    <div className={`h-12 bg-gray-500 border-4 border-black relative ${isPlayer1 ? 'rounded-l-lg' : 'rounded-r-lg'}`}>
      <motion.div
        className="h-full bg-yellow-400"
        initial={{ width: `${health}%`}}
        animate={{ width: `${health}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          boxShadow: 'inset 0 -4px 0 rgba(0,0,0,0.3)',
          clipPath: isPlayer1 ? 'polygon(0 0, 100% 0, 95% 100%, 0% 100%)' : 'polygon(5% 0, 100% 0, 100% 100%, 0 100%)',
        }}
      />
    </div>
  );
};

const SuperBar = ({ superAmount, isPlayer1 }) => {
    return (
        <div className={`h-6 bg-gray-700 border-2 border-black relative ${isPlayer1 ? 'rounded-l-md' : 'rounded-r-md'}`}>
            <motion.div
                className="h-full bg-blue-500"
                animate={{ width: `${superAmount}%`}}
                transition={{ duration: 0.3 }}
            />
        </div>
    );
};

const WinIndicator = ({ wins, isPlayer1 }) => (
    <div className={`flex gap-1 ${isPlayer1 ? 'justify-start' : 'justify-end'}`}>
        {[...Array(2)].map((_, i) => (
            <div key={i} className={`w-4 h-4 rounded-full border-2 border-yellow-600 ${i < wins ? 'bg-yellow-400' : 'bg-gray-700'}`}></div>
        ))}
    </div>
);


const FightUI = ({ player1, player2, timer, round }) => {
  if (!player1 || !player2) {
    return (
        <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white street-fighter-font text-2xl">RAKİP BEKLENİYOR...</p>
        </div>
    );
  }

  return (
    <div className="absolute top-0 left-0 right-0 z-10 p-4">
      <div className="grid grid-cols-3 items-center gap-4">
        {/* Player 1 UI */}
        <div className="space-y-1">
            <div className="flex items-center gap-4">
              <span className="text-3xl street-fighter-font text-white text-shadow-md">{player1.name}</span>
              <WinIndicator wins={player1.wins} isPlayer1={true} />
            </div>
            <HealthBar health={player1.health} isPlayer1={true} />
            <SuperBar superAmount={player1.super} isPlayer1={true} />
        </div>
        
        {/* Timer */}
        <div className="text-center">
          <div className="text-7xl street-fighter-font text-yellow-300 text-shadow-heavy">
            {timer}
          </div>
        </div>

        {/* Player 2 UI */}
        <div className="space-y-1 text-right">
            <div className="flex items-center justify-end gap-4">
               <WinIndicator wins={player2.wins} isPlayer1={false} />
               <span className="text-3xl street-fighter-font text-white text-shadow-md">{player2.name}</span>
            </div>
            <HealthBar health={player2.health} isPlayer1={false} />
            <SuperBar superAmount={player2.super} isPlayer1={false} />
        </div>
      </div>
    </div>
  );
};

export default FightUI;
