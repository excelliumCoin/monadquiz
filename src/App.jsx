import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import GameLobby from '@/components/GameLobby';
import GameArena from '@/components/GameArena';
import WalletConnection from '@/components/WalletConnection';
import { useMultiSynq } from '@/hooks/useMultiSynq';
import { useWallet } from '@/hooks/useWallet';

function App() {
  const [appState, setAppState] = useState('lobby'); // lobby, connecting, arena
  const { isConnected, connect, disconnect, address } = useWallet();
  const { 
    connect: connectMultiSynq,
    disconnect: disconnectMultiSynq,
    players, 
    gameState,
    sendGameAction,
    connectionStatus,
  } = useMultiSynq(address);

  useEffect(() => {
    if (connectionStatus === 'connected' && appState === 'connecting') {
        setAppState('arena');
    }
     if (connectionStatus === 'disconnected' && appState === 'arena') {
        setAppState('lobby');
    }
  }, [connectionStatus, appState]);


  const handleStartGame = async () => {
    if (!isConnected) {
      return;
    }
    setAppState('connecting');
    await connectMultiSynq();
  };

  const handleEndGame = () => {
    disconnectMultiSynq();
    setAppState('lobby');
  };

  const backgroundPattern = `data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='0.04'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E`;

  return (
    <>
      <Helmet>
        <title>Monad Quiz Challenge - Real-time Trivia on Monad</title>
        <meta name="description" content="A real-time multiplayer quiz game built on the Monad testnet using the MultiSynq API. Challenge your friends and test your knowledge!" />
      </Helmet>
      
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
          <div 
            className="absolute inset-0 opacity-50"
            style={{ backgroundImage: `url("${backgroundPattern}")` }}
          ></div>
        </div>

        <div className="relative z-10">
          <AnimatePresence mode="wait">
            {appState === 'lobby' && (
              <motion.div
                key="lobby"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <GameLobby 
                  onStartGame={handleStartGame}
                  isWalletConnected={isConnected}
                />
              </motion.div>
            )}

            {appState === 'connecting' && (
              <motion.div
                key="connecting"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="min-h-screen flex items-center justify-center"
              >
                <div className="text-center space-y-8">
                   <motion.div
                    className="w-32 h-32 mx-auto relative"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="absolute inset-0 border-4 border-blue-500/50 rounded-full"></div>
                    <div className="absolute inset-2 border-4 border-purple-500/70 rounded-full animate-ping"></div>
                  </motion.div>
                  
                  <div className="space-y-4">
                    <h2 className="text-4xl font-black orbitron bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent tracking-wider">
                      CONNECTING TO SERVER
                    </h2>
                    <p className="text-gray-300">Preparing the Quiz Arena...</p>
                  </div>
                </div>
              </motion.div>
            )}

            {appState === 'arena' && (
              <motion.div
                key="arena"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <GameArena 
                  onEndGame={handleEndGame}
                  players={players}
                  playerAddress={address}
                  sendGameAction={sendGameAction}
                  gameState={gameState}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <WalletConnection 
          isConnected={isConnected}
          onConnect={connect}
          onDisconnect={disconnect}
          address={address}
        />

        <Toaster />
      </div>
    </>
  );
}

export default App;