import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Wallet, ExternalLink, Copy, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const WalletConnection = ({ isConnected, onConnect, onDisconnect, address }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard!",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleConnect = async () => {
    try {
      await onConnect();
      setIsModalOpen(false);
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "There was an error connecting your wallet.",
        variant: "destructive"
      });
    }
  };

  const handleDisconnect = () => {
    onDisconnect();
    setIsModalOpen(false);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been securely disconnected.",
    });
  };

  return (
    <>
      <motion.div
        className="fixed top-6 right-6 z-50"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          onClick={() => setIsModalOpen(true)}
          className={`${
            isConnected 
              ? 'bg-green-500/20 border-green-400/50 text-green-400 hover:bg-green-500/30' 
              : 'bg-purple-500/20 border-purple-400/50 text-purple-400 hover:bg-purple-500/30'
          } border backdrop-blur-sm`}
          variant="outline"
        >
          <Wallet className="w-4 h-4 mr-2" />
          {isConnected ? 'Connected' : 'Connect Wallet'}
          {isConnected && (
            <div className="w-2 h-2 bg-green-400 rounded-full ml-2 animate-pulse"></div>
          )}
        </Button>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="game-card rounded-2xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold orbitron mb-2">
                  {isConnected ? 'Wallet Connected' : 'Connect Wallet'}
                </h2>
                <p className="text-gray-400">
                  {isConnected 
                    ? 'You are connected to the Monad Testnet' 
                    : 'Connect your wallet to join the game'
                  }
                </p>
              </div>

              {isConnected ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-center space-x-2 text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Connection Active</span>
                  </div>

                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <div className="text-sm text-gray-400 mb-2">Wallet Address</div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm">
                        {address?.slice(0, 8)}...{address?.slice(-8)}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleCopyAddress}
                        className="text-purple-400 hover:text-purple-300"
                      >
                        {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-400">Network</div>
                        <div className="font-semibold">Monad Testnet</div>
                      </div>
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      onClick={() => setIsModalOpen(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      Close
                    </Button>
                    <Button
                      onClick={handleDisconnect}
                      variant="destructive"
                      className="flex-1"
                    >
                      Disconnect
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-start space-x-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-semibold text-yellow-400 mb-1">Important Note</div>
                      <div className="text-gray-300">
                        This game runs on the Monad Testnet. No real funds are used.
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={handleConnect}
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-3"
                    >
                      <Wallet className="w-5 h-5 mr-2" />
                      Connect with MetaMask
                    </Button>
                    
                    <div className="text-center">
                      <a
                        href="https://metamask.io/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-purple-400 hover:text-purple-300 inline-flex items-center"
                      >
                        Get MetaMask
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  </div>

                  <Button
                    onClick={() => setIsModalOpen(false)}
                    variant="outline"
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WalletConnection;