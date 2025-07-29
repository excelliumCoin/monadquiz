import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Clock, HelpCircle, BarChart2 } from 'lucide-react';

const QuizScreen = ({ question, onAnswer, timer, questionNumber, totalQuestions }) => {
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    if (question) {
      const answers = [...question.incorrect_answers, question.correct_answer];
      setShuffledAnswers(answers.sort(() => Math.random() - 0.5));
      setSelectedAnswer(null);
    }
  }, [question]);

  const handleAnswerClick = (answer, index) => {
    setSelectedAnswer(index);
    onAnswer(shuffledAnswers.indexOf(answer));
  };

  const getButtonClass = (index) => {
    if (selectedAnswer === null) {
      return 'bg-gray-800/80 hover:bg-blue-500/40';
    }
    if (selectedAnswer === index) {
      return 'bg-blue-600 border-blue-400';
    }
    return 'bg-gray-800/50 opacity-50';
  };

  return (
    <div className="game-card rounded-2xl p-8 max-w-3xl w-full mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-lg font-bold text-blue-400">
          <HelpCircle className="w-6 h-6" />
          <span>Question {questionNumber}/{totalQuestions}</span>
        </div>
        <div className="flex items-center gap-2 text-lg font-bold text-red-400">
          <Clock className="w-6 h-6" />
          <span>{timer}s</span>
        </div>
      </div>

      <div className="w-full bg-gray-700 rounded-full h-2.5 mb-8">
        <motion.div
          className="bg-gradient-to-r from-red-500 to-yellow-500 h-2.5 rounded-full"
          initial={{ width: '100%' }}
          animate={{ width: `${(timer / 15) * 100}%` }}
          transition={{ duration: 1, ease: 'linear' }}
        />
      </div>

      <motion.h2 
        key={question.question}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-center mb-8 min-h-[100px]"
      >
        {question.question}
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {shuffledAnswers.map((answer, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index }}
          >
            <Button
              onClick={() => handleAnswerClick(answer, index)}
              disabled={selectedAnswer !== null}
              className={`w-full h-auto text-left justify-start p-4 text-lg whitespace-normal rounded-lg border-2 border-transparent transition-all duration-300 ${getButtonClass(index)}`}
            >
              <span className="font-bold mr-3">{String.fromCharCode(65 + index)}.</span>
              {answer}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default QuizScreen;