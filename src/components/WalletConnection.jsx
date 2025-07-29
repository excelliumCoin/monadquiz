import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Wallet, Zap, Users, Trophy } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

function WalletConnection({ onConnect, connectionStatus }) {
  const handleConnect = async () => {
    try {
      await onConnect();
      toast({
        title: "🎉 Wallet Connected!",
        description: "Successfully connected to the Monad testnet!",
      });
    } catch (error) {
      toast({
        title: "❌ Connection Error",
        description: error.message || "An error occurred while connecting the wallet.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl w-full text-center space-y-8"
      >
        {/* Logo and Title */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center pulse-glow">
                <Zap className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">M</span>
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl font-black orbitron glow-text bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
            MONAD QUIZ ARENA
          </h1>
          
          <p className="text-xl text-gray-300 max-w-lg mx-auto">
            A real-time multiplayer blockchain quiz experience on the Monad testnet
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-6 my-12"
        >
          <div className="glass-effect p-6 rounded-xl">
            <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2">Multiplayer</h3>
            <p className="text-gray-400 text-sm">Compete with other players in real-time</p>
          </div>
          
          <div className="glass-effect p-6 rounded-xl">
            <Zap className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2">Blockchain-Based</h3>
            <p className="text-gray-400 text-sm">Secure and transparent on the Monad testnet</p>
          </div>
          
          <div className="glass-effect p-6 rounded-xl">
            <Trophy className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2">Leaderboard</h3>
            <p className="text-gray-400 text-sm">Rank among the best players</p>
          </div>
        </motion.div>

        {/* Connection Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="space-y-4"
        >
          <Button
            onClick={handleConnect}
            disabled={connectionStatus === 'connecting'}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 pulse-glow"
          >
            <Wallet className="w-6 h-6 mr-3" />
            {connectionStatus === 'connecting' ? 'Connecting...' : 'Connect Wallet'}
          </Button>
          
          <p className="text-sm text-gray-400">
            MetaMask required • Monad Testnet (Chain ID: 10143)
          </p>
        </motion.div>

        {/* Connection Status */}
        {connectionStatus !== 'disconnected' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6"
          >
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm ${
              connectionStatus === 'connected' ? 'bg-green-500/20 text-green-400' :
              connectionStatus === 'connecting' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                connectionStatus === 'connected' ? 'bg-green-400' :
                connectionStatus === 'connecting' ? 'bg-yellow-400 animate-pulse' :
                'bg-red-400'
              }`}></div>
              {connectionStatus === 'connected' && 'MultiSynq Connection Active'}
              {connectionStatus === 'connecting' && 'Connecting to MultiSynq...'}
              {connectionStatus === 'disconnected' && 'No Connection'}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default WalletConnection;