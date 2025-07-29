import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Users, Trophy, Play, Settings } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const GameLobby = ({ onStartGame, isWalletConnected }) => {
  const [selectedCategory, setSelectedCategory] = useState('general');
  const { toast } = useToast();

  const categories = [
    {
      id: 'general',
      name: 'General Knowledge',
      description: 'A mix of questions from all fields.',
      icon: BrainCircuit,
    },
    {
      id: 'science',
      name: 'Science & Tech',
      description: 'Challenge your inner geek.',
      icon: Users,
    },
    {
      id: 'history',
      name: 'History',
      description: 'Travel back in time with historical facts.',
      icon: Trophy,
    }
  ];

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleStartClick = () => {
    if (selectedCategory !== 'general') {
      toast({
        title: "🚧 Coming Soon!",
        description: "For now, only 'General Knowledge' is available.",
      });
      return;
    }
    if (!isWalletConnected) {
      toast({
        title: "Wallet Connection Required",
        description: "Please connect your wallet to start the game!",
        variant: "destructive"
      });
      return;
    }
    onStartGame();
  };

  const handleSettingsClick = () => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 text-white">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="text-center mb-12"
      >
        <h1 className="text-7xl md:text-8xl font-black orbitron">
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">MONAD</span>
          <span className="text-white"> QUIZ</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mt-4 font-semibold">
          The ultimate real-time trivia challenge on the Monad Testnet.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full max-w-4xl space-y-8"
      >
        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
                selectedCategory === cat.id 
                  ? 'border-blue-400 bg-blue-500/20' 
                  : 'border-gray-700 bg-black/50 hover:border-blue-500/50'
              }`}
              onClick={() => handleCategorySelect(cat.id)}
            >
              <div className="text-center space-y-3">
                <cat.icon className="w-12 h-12 mx-auto text-blue-400" />
                <h3 className="text-2xl font-bold orbitron text-white">{cat.name}</h3>
                <p className="text-gray-400 text-sm h-10">{cat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleStartClick}
            size="lg"
            className="orbitron text-2xl tracking-widest bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-black py-6 px-12 rounded-lg border-2 border-blue-400/50 shadow-lg"
          >
            <Play className="w-8 h-8 mr-4" />
            START GAME
          </Button>
          <Button
            onClick={handleSettingsClick}
            variant="outline"
            size="lg"
            className="orbitron text-xl bg-black/30 hover:bg-white/10 text-white font-bold py-5 px-10 rounded-lg border-2 border-gray-600"
          >
            <Settings className="w-6 h-6 mr-3" />
            Settings
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default GameLobby;