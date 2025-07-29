import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sword, Shield, Flame } from 'lucide-react';

const ActionButtons = ({ onAction, playerEnergy }) => {
  const actions = [
    { name: 'attack', icon: Sword, label: 'Saldır', color: 'bg-red-500 hover:bg-red-600', cost: 10 },
    { name: 'defend', icon: Shield, label: 'Savun', color: 'bg-blue-500 hover:bg-blue-600', cost: 15 },
    { name: 'special', icon: Flame, label: 'Özel Güç', color: 'bg-purple-500 hover:bg-purple-600', cost: 30 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex justify-center space-x-4 mt-6"
    >
      {actions.map((action) => (
        <Button
          key={action.name}
          onClick={() => onAction(action.name)}
          className={`${action.color} text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200 disabled:bg-gray-500 disabled:scale-100`}
          disabled={playerEnergy < action.cost}
        >
          <action.icon className="w-5 h-5 mr-2" />
          {action.label} ({action.cost}E)
        </Button>
      ))}
    </motion.div>
  );
};

export default ActionButtons;