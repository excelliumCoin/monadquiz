import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, Users, LogOut, Gamepad2, Zap } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

function GameLobby({ onJoinRoom, players, address, onDisconnect }) {
  const [selectedRoom, setSelectedRoom] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const availableRooms = [
    { id: 'room-1', name: 'Beginner Room', difficulty: 'Easy', players: 3, maxPlayers: 8 },
    { id: 'room-2', name: 'Intermediate', difficulty: 'Medium', players: 5, maxPlayers: 8 },
    { id: 'room-3', name: 'Expert Room', difficulty: 'Hard', players: 2, maxPlayers: 6 },
    { id: 'room-4', name: 'Quick Round', difficulty: 'Mixed', players: 1, maxPlayers: 4 },
  ];

  const handleJoinRoom = async (roomId) => {
    setIsJoining(true);
    try {
      await onJoinRoom(roomId);
    } catch (error) {
      console.error('Error joining room:', error);
    } finally {
      setIsJoining(false);
    }
  };

  const handleQuickPlay = () => {
    const availableRoom = availableRooms.find(room => room.players < room.maxPlayers);
    if (availableRoom) {
      handleJoinRoom(availableRoom.id);
    } else {
      toast({
        title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
        description: "All rooms are full, please try again later.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-black orbitron glow-text">GAME LOBBY</h1>
            <p className="text-gray-400 mt-2">Choose a room and start competing!</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="glass-effect px-4 py-2 rounded-lg">
              <span className="text-sm text-gray-400">Wallet:</span>
              <span className="ml-2 font-mono text-blue-400">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
            </div>
            
            <Button
              onClick={onDisconnect}
              variant="outline"
              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Room List */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-between items-center"
            >
              <h2 className="text-2xl font-bold">Available Rooms</h2>
              <Button
                onClick={handleQuickPlay}
                disabled={isJoining}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                <Zap className="w-4 h-4 mr-2" />
                Quick Play
              </Button>
            </motion.div>

            <div className="grid gap-4">
              {availableRooms.map((room, index) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`glass-effect p-6 rounded-xl border transition-all duration-300 hover:border-blue-500/50 cursor-pointer ${
                    selectedRoom === room.id ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700'
                  }`}
                  onClick={() => setSelectedRoom(room.id)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{room.name}</h3>
                      <p className="text-gray-400">Difficulty: {room.difficulty}</p>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center text-gray-300">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{room.players}/{room.maxPlayers}</span>
                      </div>
                      <div className={`text-sm mt-1 ${
                        room.players >= room.maxPlayers ? 'text-red-400' : 'text-green-400'
                      }`}>
                        {room.players >= room.maxPlayers ? 'Full' : 'Available'}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex -space-x-2">
                      {[...Array(Math.min(room.players, 4))].map((_, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full border-2 border-gray-800 flex items-center justify-center text-xs font-bold"
                        >
                          {String.fromCharCode(65 + i)}
                        </div>
                      ))}
                      {room.players > 4 && (
                        <div className="w-8 h-8 bg-gray-600 rounded-full border-2 border-gray-800 flex items-center justify-center text-xs">
                          +{room.players - 4}
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJoinRoom(room.id);
                      }}
                      disabled={room.players >= room.maxPlayers || isJoining}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {isJoining ? 'Joining...' : 'Join'}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Online Players */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-effect p-6 rounded-xl"
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-green-400" />
                Online Players ({players.length})
              </h3>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {players.length > 0 ? players.map((player, index) => (
                  <div key={player.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-xs font-bold">
                      {player.name?.charAt(0) || 'P'}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{player.name || `Player ${index + 1}`}</div>
                      <div className="text-xs text-gray-400">Score: {player.score || 0}</div>
                    </div>
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                )) : (
                  <p className="text-gray-400 text-sm">No online players yet</p>
                )}
              </div>
            </motion.div>

            {/* Game Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-effect p-6 rounded-xl"
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Gamepad2 className="w-5 h-5 mr-2 text-purple-400" />
                Game Stats
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Rooms:</span>
                  <span className="font-semibold">{availableRooms.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Players:</span>
                  <span className="font-semibold">{availableRooms.reduce((sum, room) => sum + room.players, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Network:</span>
                  <span className="font-semibold text-blue-400">Monad Testnet</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Chain ID:</span>
                  <span className="font-semibold text-purple-400">10143</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameLobby;