import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import he from 'he';

const initialPlayerState = {
  score: 0,
  name: 'Player',
  avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${Math.random()}`
};

const initialGameState = {
  phase: 'waiting', // waiting, transition, question, reveal, scoreboard, game_over
  questions: [],
  currentQuestionIndex: 0,
  timer: 0,
  lastAnswers: {},
};

const fetchQuestions = async () => {
  try {
    const response = await fetch('https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple');
    const data = await response.json();
    return data.results.map(q => ({
      ...q,
      question: he.decode(q.question),
      correct_answer: he.decode(q.correct_answer),
      incorrect_answers: q.incorrect_answers.map(a => he.decode(a)),
    }));
  } catch (error) {
    console.error("Failed to fetch questions:", error);
    return [];
  }
};

export const useMultiSynq = (playerAddress) => {
  const [players, setPlayers] = useState([]);
  const [gameState, setGameState] = useState(initialGameState);
  
  const { toast } = useToast();
  const gameLoopRef = useRef();

  const resetGame = useCallback(() => {
    setPlayers([]);
    setGameState(initialGameState);
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
  }, []);

  const connect = async () => {
    resetGame();
    const questions = await fetchQuestions();
    if (questions.length === 0) {
      toast({ title: "Error", description: "Could not load questions.", variant: "destructive" });
      return;
    }
    
    setGameState(prev => ({ ...prev, questions }));

    const mockPlayers = [
      { address: playerAddress, ...initialPlayerState, name: 'You', avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${playerAddress}` },
      { address: '0xOPPONENT1', ...initialPlayerState, name: 'Bot Alice', avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=alice` },
      { address: '0xOPPONENT2', ...initialPlayerState, name: 'Bot Bob', avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=bob` },
    ];
    setPlayers(mockPlayers);

    toast({ title: "Game Found!", description: "The quiz will begin shortly." });
    
    setTimeout(() => {
      runGameLoop();
    }, 2000);
  };

  const runGameLoop = () => {
    setGameState(prev => ({ ...prev, phase: 'transition' }));
    
    gameLoopRef.current = setTimeout(() => {
      // Question Phase
      setGameState(prev => ({ ...prev, phase: 'question', timer: 15, lastAnswers: {} }));
      
      gameLoopRef.current = setTimeout(() => {
        // Reveal Phase
        setGameState(prev => ({ ...prev, phase: 'reveal' }));
        
        gameLoopRef.current = setTimeout(() => {
          // Scoreboard Phase
          setGameState(prev => ({ ...prev, phase: 'scoreboard' }));
          
          gameLoopRef.current = setTimeout(() => {
            // Next Question or Game Over
            setGameState(prev => {
              if (prev.currentQuestionIndex < prev.questions.length - 1) {
                return { ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 };
              }
              return { ...prev, phase: 'game_over' };
            });

            if (gameState.phase !== 'game_over') {
              runGameLoop();
            } else {
              toast({ title: "Game Over!", description: "Thanks for playing!" });
            }
          }, 5000); // Scoreboard display time
        }, 3000); // Reveal time
      }, 15000); // Question time
    }, 3000); // Transition time
  };

  useEffect(() => {
    let timerInterval;
    if (gameState.phase === 'question' && gameState.timer > 0) {
      timerInterval = setInterval(() => {
        setGameState(prev => ({ ...prev, timer: prev.timer - 1 }));
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [gameState.phase, gameState.timer]);

  const sendGameAction = useCallback((action, data) => {
    if (action === 'answer' && gameState.phase === 'question') {
      const { answerIndex } = data;
      const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
      const allAnswers = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer].sort();
      const selectedAnswer = allAnswers[answerIndex];
      const isCorrect = selectedAnswer === currentQuestion.correct_answer;
      
      const points = isCorrect ? (100 + gameState.timer * 5) : 0;

      setPlayers(prev => prev.map(p => 
        p.address === playerAddress ? { ...p, score: p.score + points } : p
      ));

      setGameState(prev => ({
        ...prev,
        lastAnswers: { ...prev.lastAnswers, [playerAddress]: { answer: selectedAnswer, isCorrect } }
      }));

      toast({
        title: isCorrect ? "Correct!" : "Wrong!",
        description: `You earned ${points} points.`,
      });
    }
  }, [gameState, playerAddress, toast]);

  return {
    players,
    gameState,
    connect,
    sendGameAction,
    resetGame,
  };
};