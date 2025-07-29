import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import WalletConnection from '@/components/WalletConnection';
import GameLobby from '@/components/GameLobby';
import QuizGame from '@/components/QuizGame';
import Leaderboard from '@/components/Leaderboard';
import { useMultiSynq } from '@/hooks/useMultiSynq';
import { useWallet } from '@/hooks/useWallet';
import { toast } from '@/components/ui/use-toast';

function App() {
  const [gameState, setGameState] = useState('lobby'); // lobby, playing, finished
  const [currentRoom, setCurrentRoom] = useState(null);
  const { isConnected, address, connectWallet, disconnectWallet } = useWallet();
  const { 
    connectionStatus, 
    players, 
    gameData, 
    joinRoom, 
    leaveRoom, 
    sendAnswer,
    leaderboard 
  } = useMultiSynq();

  useEffect(() => {
    if (connectionStatus === 'connected') {
      toast({
        title: "🎮 MultiSynq Connected!",
        description: "The real-time multiplayer experience is starting!",
      });
    } else if (connectionStatus === 'disconnected') {
      toast({
        title: "⚠️ Connection Lost",
        description: "Reconnecting to MultiSynq...",
        variant: "destructive"
      });
    }
  }, [connectionStatus]);

  const handleJoinRoom = async (roomId) => {
    if (!isConnected) {
      toast({
        title: "🔗 Wallet Connection Required",
        description: "Please connect your wallet to join the game!",
        variant: "destructive"
      });
      return;
    }

    try {
      await joinRoom(roomId, address);
      setCurrentRoom(roomId);
      setGameState('playing');
      toast({
        title: "🎯 You've Joined the Game!",
        description: `Room ${roomId} - The game is starting!`,
      });
    } catch (error) {
      toast({
        title: "❌ Connection Error",
        description: "An error occurred while joining the room.",
        variant: "destructive"
      });
    }
  };

  const handleLeaveRoom = () => {
    if (currentRoom) {
      leaveRoom(currentRoom);
      setCurrentRoom(null);
      setGameState('lobby');
      toast({
        title: "👋 You've Left the Game",
        description: "You have returned to the main lobby.",
      });
    }
  };

  const handleGameFinish = () => {
    setGameState('finished');
  };

  const handleBackToLobby = () => {
    handleLeaveRoom();
  };

  return (
    <>
      <Helmet>
        <title>Monad Quiz Arena - Multiplayer Blockchain Quiz</title>
        <meta name="description" content="A real-time multiplayer quiz game running on the Monad testnet. A blockchain-based competition experience powered by the MultiSynq API." />
      </Helmet>
      
      <div className="min-h-screen cyber-grid relative overflow-hidden">
        {/* Connection Status */}
        <div className="connection-status">
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              connectionStatus === 'connected' ? 'status-connected' :
              connectionStatus === 'connecting' ? 'status-connecting' :
              'status-disconnected'
            }`}
          >
            {connectionStatus === 'connected' && '🟢 Connected'}
            {connectionStatus === 'connecting' && '🟡 Connecting...'}
            {connectionStatus === 'disconnected' && '🔴 Disconnected'}
          </motion.div>
        </div>

        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl floating"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl floating" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl floating" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10">
          <AnimatePresence mode="wait">
            {!isConnected ? (
              <motion.div
                key="wallet"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              >
                <WalletConnection 
                  onConnect={connectWallet}
                  connectionStatus={connectionStatus}
                />
              </motion.div>
            ) : gameState === 'lobby' ? (
              <motion.div
                key="lobby"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
              >
                <GameLobby 
                  onJoinRoom={handleJoinRoom}
                  players={players}
                  address={address}
                  onDisconnect={disconnectWallet}
                />
              </motion.div>
            ) : gameState === 'playing' ? (
              <motion.div
                key="playing"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                <QuizGame 
                  gameData={gameData}
                  players={players}
                  onAnswer={sendAnswer}
                  onLeave={handleLeaveRoom}
                  onGameFinish={handleGameFinish}
                  currentRoom={currentRoom}
                />
              </motion.div>
            ) : (
              <motion.div
                key="leaderboard"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              >
                <Leaderboard 
                  leaderboard={leaderboard}
                  onBackToLobby={handleBackToLobby}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Toaster />
      </div>
    </>
  );
}

export default App;