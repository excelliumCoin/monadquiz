import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Award, ArrowLeft, Crown, Star } from 'lucide-react';

function Leaderboard({ leaderboard, onBackToLobby }) {
  // Mock leaderboard data if none provided
  const mockLeaderboard = [
    { id: '1', name: 'CryptoMaster', score: 850, address: '0x1234...5678', rank: 1 },
    { id: '2', name: 'BlockchainPro', score: 720, address: '0x2345...6789', rank: 2 },
    { id: '3', name: 'QuizKing', score: 680, address: '0x3456...7890', rank: 3 },
    { id: '4', name: 'SmartPlayer', score: 620, address: '0x4567...8901', rank: 4 },
    { id: '5', name: 'TechGuru', score: 580, address: '0x5678...9012', rank: 5 },
  ];

  const displayLeaderboard = leaderboard?.length > 0 ? leaderboard : mockLeaderboard;

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <Star className="w-5 h-5 text-blue-400" />;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 to-orange-500';
      case 2:
        return 'from-gray-300 to-gray-500';
      case 3:
        return 'from-amber-500 to-amber-700';
      default:
        return 'from-blue-400 to-purple-500';
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-between items-center mb-8">
            <Button
              onClick={onBackToLobby}
              variant="outline"
              className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Lobby
            </Button>
            
            <div className="glass-effect px-4 py-2 rounded-lg">
              <span className="text-sm text-gray-400">Monad Testnet</span>
            </div>
          </div>

          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="flex justify-center">
              <div className="relative">
                <Trophy className="w-16 h-16 text-yellow-400 pulse-glow" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Crown className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl font-black orbitron glow-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              LEADERBOARD
            </h1>
            
            <p className="text-xl text-gray-300">
              The most successful players and their scores
            </p>
          </motion.div>
        </motion.div>

        {/* Podium - Top 3 */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center items-end gap-8 mb-12"
        >
          {/* 2nd Place */}
          {displayLeaderboard[1] && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <div className="glass-effect p-6 rounded-xl mb-4 border-2 border-gray-400/50">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-300 to-gray-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Medal className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg">{displayLeaderboard[1].name}</h3>
                <p className="text-gray-400 text-sm">{displayLeaderboard[1].address}</p>
                <p className="text-2xl font-bold text-gray-300 mt-2">{displayLeaderboard[1].score}</p>
              </div>
              <div className="h-24 bg-gradient-to-t from-gray-400 to-gray-500 rounded-t-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">2</span>
              </div>
            </motion.div>
          )}

          {/* 1st Place */}
          {displayLeaderboard[0] && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <div className="glass-effect p-8 rounded-xl mb-4 border-2 border-yellow-400/50 pulse-glow">
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Crown className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-semibold text-xl">{displayLeaderboard[0].name}</h3>
                <p className="text-gray-400 text-sm">{displayLeaderboard[0].address}</p>
                <p className="text-3xl font-bold text-yellow-400 mt-3">{displayLeaderboard[0].score}</p>
              </div>
              <div className="h-32 bg-gradient-to-t from-yellow-400 to-orange-500 rounded-t-lg flex items-center justify-center">
                <span className="text-white font-bold text-2xl">1</span>
              </div>
            </motion.div>
          )}

          {/* 3rd Place */}
          {displayLeaderboard[2] && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center"
            >
              <div className="glass-effect p-6 rounded-xl mb-4 border-2 border-amber-600/50">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-amber-700 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg">{displayLeaderboard[2].name}</h3>
                <p className="text-gray-400 text-sm">{displayLeaderboard[2].address}</p>
                <p className="text-2xl font-bold text-amber-500 mt-2">{displayLeaderboard[2].score}</p>
              </div>
              <div className="h-20 bg-gradient-to-t from-amber-500 to-amber-700 rounded-t-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">3</span>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Full Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold text-center mb-6">All Players</h2>
          
          {displayLeaderboard.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className={`leaderboard-item p-6 rounded-xl ${
                index < 3 ? 'border-2' : 'border'
              } ${
                index === 0 ? 'border-yellow-400/50' :
                index === 1 ? 'border-gray-400/50' :
                index === 2 ? 'border-amber-600/50' :
                'border-gray-600/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${getRankColor(index + 1)} rounded-full flex items-center justify-center font-bold text-white`}>
                    {index < 3 ? getRankIcon(index + 1) : index + 1}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg">{player.name}</h3>
                    <p className="text-gray-400 text-sm font-mono">{player.address}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-2xl font-bold ${
                    index === 0 ? 'text-yellow-400' :
                    index === 1 ? 'text-gray-300' :
                    index === 2 ? 'text-amber-500' :
                    'text-blue-400'
                  }`}>
                    {player.score}
                  </div>
                  <div className="text-sm text-gray-400">points</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-12 grid md:grid-cols-3 gap-6"
        >
          <div className="glass-effect p-6 rounded-xl text-center">
            <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold">Highest Score</h3>
            <p className="text-2xl font-bold text-yellow-400">{displayLeaderboard[0]?.score || 0}</p>
          </div>
          
          <div className="glass-effect p-6 rounded-xl text-center">
            <Star className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold">Average Score</h3>
            <p className="text-2xl font-bold text-blue-400">
              {Math.round(displayLeaderboard.reduce((sum, player) => sum + player.score, 0) / displayLeaderboard.length) || 0}
            </p>
          </div>
          
          <div className="glass-effect p-6 rounded-xl text-center">
            <Medal className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold">Total Players</h3>
            <p className="text-2xl font-bold text-purple-400">{displayLeaderboard.length}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Leaderboard;