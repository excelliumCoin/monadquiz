import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import QuizScreen from '@/components/quiz/QuizScreen';
import Scoreboard from '@/components/quiz/Scoreboard';
import GameOver from '@/components/quiz/GameOver';
import WaitingForPlayers from '@/components/quiz/WaitingForPlayers';
import RoundTransition from '@/components/quiz/RoundTransition';

const GameArena = ({ 
  onEndGame, 
  players,
  playerAddress,
  sendGameAction,
  gameState,
}) => {
  const me = players.find(p => p.address === playerAddress) || null;

  const renderContent = () => {
    switch (gameState.phase) {
      case 'waiting':
        return <WaitingForPlayers players={players} />;
      case 'transition':
        return <RoundTransition round={gameState.currentQuestionIndex + 1} totalRounds={gameState.questions.length} />;
      case 'question':
        return (
          <QuizScreen
            question={gameState.questions[gameState.currentQuestionIndex]}
            onAnswer={(answerIndex) => sendGameAction('answer', { answerIndex })}
            timer={gameState.timer}
            questionNumber={gameState.currentQuestionIndex + 1}
            totalQuestions={gameState.questions.length}
          />
        );
      case 'reveal':
      case 'scoreboard':
        return (
          <Scoreboard
            players={players}
            correctAnswer={gameState.questions[gameState.currentQuestionIndex].correct_answer}
            lastAnswers={gameState.lastAnswers}
          />
        );
      case 'game_over':
        return <GameOver players={players} onEndGame={onEndGame} />;
      default:
        return <div className="text-white">Loading...</div>;
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="w-full max-w-4xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={gameState.phase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GameArena;