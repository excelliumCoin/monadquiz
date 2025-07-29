import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Clock, Users, ArrowLeft, Trophy, Zap } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

function QuizGame({ gameData, players, onAnswer, onLeave, onGameFinish, currentRoom }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Use MultiSynq state for these values
  const currentQuestionIndex = gameData?.currentQuestionIndex || 0;
  const totalQuestions = gameData?.questions?.length || 5;
  const timeRemaining = gameData?.timeRemaining ?? 30;
  const currentQuestion = gameData?.currentQuestion || gameData?.questions?.[currentQuestionIndex];
  const correctAnswer = currentQuestion?.correctAnswer;

  // Use player scores from MultiSynq (either in players or gameData.leaderboard)
  const getPlayerScore = (address) => {
    if (gameData?.leaderboard) {
      const entry = gameData.leaderboard.find(p => p.id === address || p.address === address);
      return entry ? entry.score : 0;
    }
    const player = players.find(p => p.address === address);
    return player?.score || 0;
  };

  useEffect(() => {
    // Reset answer state when question changes
    setSelectedAnswer(null);
    setHasAnswered(false);
    setShowResults(false);
  }, [currentQuestionIndex, currentQuestion?.id]);

  const handleAnswerSelect = (answerIndex) => {
    if (hasAnswered || timeRemaining <= 0) return;
    setSelectedAnswer(answerIndex);
    setHasAnswered(true);
    setShowResults(true);
    onAnswer(currentQuestion?.id, answerIndex, players[0]?.address);
  };

  const getAnswerClassName = (index) => {
    if (!showResults) {
      return selectedAnswer === index 
        ? 'border-blue-500 bg-blue-500/20' 
        : 'border-gray-600 hover:border-blue-400/50 hover:bg-blue-500/10';
    }
    if (index === correctAnswer) {
      return 'correct-answer border-green-500';
    }
    if (selectedAnswer === index && index !== correctAnswer) {
      return 'wrong-answer border-red-500';
    }
    return 'border-gray-600 opacity-50';
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading game...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <Button
            onClick={onLeave}
            variant="outline"
            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Leave
          </Button>

          <div className="flex items-center gap-6">
            <div className="glass-effect px-4 py-2 rounded-lg">
              <span className="text-sm text-gray-400">Room:</span>
              <span className="ml-2 font-semibold text-blue-400">{currentRoom}</span>
            </div>
            <div className="glass-effect px-4 py-2 rounded-lg">
              <span className="text-sm text-gray-400">Question:</span>
              <span className="ml-2 font-semibold text-purple-400">
                {currentQuestionIndex + 1}/{totalQuestions}
              </span>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Game Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Timer */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className={`inline-flex items-center gap-3 glass-effect px-6 py-4 rounded-xl ${
                timeRemaining <= 10 ? 'pulse-glow border-red-500/50' : ''
              }`}>
                <Clock className={`w-6 h-6 ${timeRemaining <= 10 ? 'text-red-400' : 'text-blue-400'}`} />
                <span className={`text-3xl font-bold orbitron ${
                  timeRemaining <= 10 ? 'text-red-400' : 'text-white'
                }`}>
                  {timeRemaining}s
                </span>
              </div>
            </motion.div>

            {/* Question */}
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-effect p-8 rounded-xl"
            >
              <h2 className="text-2xl font-semibold text-white mb-8 text-center leading-relaxed">
                {currentQuestion.question}
              </h2>
              <div className="grid gap-4">
                {currentQuestion.options.map((option, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={hasAnswered || timeRemaining <= 0}
                    className={`quiz-option p-6 rounded-xl border-2 text-left transition-all duration-300 ${getAnswerClassName(index)}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${
                        showResults && index === correctAnswer ? 'bg-green-500 border-green-500 text-white' :
                        showResults && selectedAnswer === index && index !== correctAnswer ? 'bg-red-500 border-red-500 text-white' :
                        selectedAnswer === index ? 'bg-blue-500 border-blue-500 text-white' :
                        'border-gray-400 text-gray-400'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-lg">{option}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Results */}
            <AnimatePresence>
              {showResults && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="glass-effect p-6 rounded-xl text-center"
                >
                  {selectedAnswer === correctAnswer ? (
                    <div className="text-green-400">
                      <Trophy className="w-8 h-8 mx-auto mb-2" />
                      <h3 className="text-xl font-semibold">Congratulations! Correct answer!</h3>
                    </div>
                  ) : (
                    <div className="text-red-400">
                      <Zap className="w-8 h-8 mx-auto mb-2" />
                      <h3 className="text-xl font-semibold">Wrong answer</h3>
                      <p className="text-gray-400 mt-2">
                        Correct answer: <span className="text-green-400">{currentQuestion.options[correctAnswer]}</span>
                      </p>
                    </div>
                  )}
                  <div className="mt-4 text-gray-400">
                    {currentQuestionIndex < totalQuestions - 1 ? 'Waiting for next question...' : 'Game finished!'}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Players */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-effect p-6 rounded-xl"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-400" />
                Players
              </h3>
              <div className="space-y-3">
                {players.map((player, index) => (
                  <div key={player.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <span className="text-sm">{player.name || `Player ${index + 1}`}</span>
                    </div>
                    <span className="text-sm font-semibold text-yellow-400">
                      {getPlayerScore(player.address)}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Progress */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-effect p-6 rounded-xl"
            >
              <h3 className="text-lg font-semibold mb-4">Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Questions</span>
                    <span>{currentQuestionIndex + 1}/{totalQuestions}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Time</span>
                    <span>{timeRemaining}s</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-1000 ${
                        timeRemaining <= 10 ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                        'bg-gradient-to-r from-green-500 to-blue-500'
                      }`}
                      style={{ width: `${(timeRemaining / 30) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizGame;