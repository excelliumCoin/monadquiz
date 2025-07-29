import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Crown, Trophy, Award } from 'lucide-react';

const GameOver = ({ players, onEndGame }) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];

  return (
    <motion.div
      className="game-card rounded-2xl p-8 max-w-2xl w-full text-center mx-auto"
    >
      <Trophy className="w-24 h-24 mx-auto text-yellow-400 mb-4" />
      <h2 className="text-5xl font-black orbitron mb-2 text-yellow-300">
        GAME OVER
      </h2>
      <p className="text-lg text-gray-300 mb-8">The quiz has concluded. Here are the final results!</p>

      <div className="bg-gray-800/50 rounded-xl p-6 mb-8">
        <h3 className="text-2xl font-bold orbitron flex items-center justify-center mb-3">
          <Crown className="w-8 h-8 mr-3 text-yellow-400" />
          Winner
        </h3>
        <div className="flex items-center justify-center gap-4">
          <img  alt="Winner's avatar" class="w-16 h-16 rounded-full border-4 border-yellow-400" src="https://images.unsplash.com/photo-1671084905223-1e7ed5c57160" />
          <div>
            <p className="text-3xl font-semibold text-purple-400">{winner.name}</p>
            <p className="text-xl text-gray-400">Score: {winner.score}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold orbitron">Final Standings</h3>
        {sortedPlayers.map((player, index) => (
          <motion.div
            key={player.address}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 * index }}
            className={`flex items-center justify-between p-4 rounded-lg ${index === 0 ? 'bg-yellow-500/20' : 'bg-gray-800/50'}`}
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold w-8">{index + 1}</span>
              <img  alt="Player avatar" class="w-10 h-10 rounded-full" src="https://images.unsplash.com/photo-1635003913011-95971abba560" />
              <span className="font-semibold text-lg">{player.name}</span>
            </div>
            <div className="flex items-center gap-2 text-lg font-bold text-blue-400">
              <Award className="w-5 h-5" />
              {player.score}
            </div>
          </motion.div>
        ))}
      </div>

      <Button
        onClick={onEndGame}
        size="lg"
        className="w-full mt-8 orbitron text-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3"
      >
        Return to Lobby
      </Button>
    </motion.div>
  );
};

export default GameOver;