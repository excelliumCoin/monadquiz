import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

const GameEvents = ({ events }) => {
  const getEventColor = (type) => {
    switch (type) {
      case 'damage': return 'text-red-400';
      case 'kill': return 'text-yellow-400 font-bold';
      case 'action': return 'text-blue-400';
      default: return 'text-purple-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="game-card rounded-2xl p-6"
    >
      <h3 className="text-lg font-bold orbitron mb-4 flex items-center">
        <MessageSquare className="w-5 h-5 mr-2 text-gray-400" />
        Oyun Olayları
      </h3>
      
      <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
        <AnimatePresence>
          {events.length === 0 && (
            <p className="text-sm text-gray-500">Henüz bir olay yok...</p>
          )}
          {events.map((event) => (
            <motion.div
              key={event.id}
              layout
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="text-sm p-2 bg-gray-800/50 rounded-lg"
            >
              <div className={getEventColor(event.type)}>{event.message}</div>
              <div className="text-xs text-gray-500 text-right">
                {event.timestamp.toLocaleTimeString()}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default GameEvents;