import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Award } from 'lucide-react';

const Scoreboard = ({ players, correctAnswer, lastAnswers }) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="game-card rounded-2xl p-8 max-w-2xl w-full mx-auto">
      <h2 className="text-4xl font-black orbitron text-center mb-4">
        Round Over!
      </h2>
      <div className="text-center mb-8">
        <p className="text-gray-400">The correct answer was:</p>
        <p className="text-2xl font-bold text-green-400">{correctAnswer}</p>
      </div>

      <div className="space-y-4">
        {sortedPlayers.map((player, index) => {
          const playerAnswer = lastAnswers[player.address];
          return (
            <motion.div
              key={player.address}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold w-8">{index + 1}</span>
                <img  alt="Player avatar" class="w-12 h-12 rounded-full" src="https://images.unsplash.com/photo-1635003913011-95971abba560" />
                <span className="font-semibold text-lg">{player.name}</span>
              </div>
              <div className="flex items-center gap-4">
                {playerAnswer && (
                  playerAnswer.isCorrect ? (
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-500" />
                  )
                )}
                <div className="flex items-center gap-2 text-lg font-bold text-blue-400">
                  <Award className="w-5 h-5" />
                  {player.score}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Scoreboard;