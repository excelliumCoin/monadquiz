import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { io } from 'socket.io-client';
import he from 'he';

const API_KEY = '2g7kNDm8cSviXn9zgKTRRiUJsLYvB0BayE415WFqdV';
const MULTISYNQ_URL = 'https://horizons-api.hostinger.com';

const initialGameState = {
  phase: 'waiting', 
  questions: [],
  currentQuestionIndex: 0,
  timer: 0,
  lastAnswers: {},
};

export const useMultiSynq = (playerAddress) => {
  const [players, setPlayers] = useState([]);
  const [gameState, setGameState] = useState(initialGameState);
  const [connectionStatus, setConnectionStatus] = useState('disconnected'); // disconnected, connecting, connected, error
  const socketRef = useRef(null);
  const { toast } = useToast();

  const handleStateUpdate = useCallback((newGameState) => {
    // Decode HTML entities in questions
    if (newGameState.questions) {
      newGameState.questions = newGameState.questions.map(q => ({
        ...q,
        question: he.decode(q.question),
        correct_answer: he.decode(q.correct_answer),
        incorrect_answers: q.incorrect_answers.map(a => he.decode(a)),
      }));
    }
    setGameState(newGameState);
  }, []);

  const connect = useCallback(() => {
    if (!playerAddress || connectionStatus === 'connected' || connectionStatus === 'connecting') {
      return;
    }

    setConnectionStatus('connecting');

    const socket = io(MULTISYNQ_URL, {
      query: {
        apiKey: API_KEY,
        walletAddress: playerAddress,
      },
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setConnectionStatus('connected');
      toast({
        title: "Connected!",
        description: "Successfully connected to MultiSynq server."
      });
      socket.emit('joinGame', { gameType: 'quiz' });
    });

    socket.on('disconnect', () => {
      setConnectionStatus('disconnected');
      toast({
        title: "Disconnected",
        description: "Lost connection to the server.",
        variant: "destructive"
      });
      resetGame();
    });

    socket.on('connect_error', (error) => {
      console.error('Connection Error:', error);
      setConnectionStatus('error');
      toast({
        title: "Connection Error",
        description: "Failed to connect to the MultiSynq server.",
        variant: "destructive"
      });
      resetGame();
    });

    socket.on('playerUpdate', (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    socket.on('gameStateUpdate', handleStateUpdate);

    socket.on('gameEvent', (event) => {
      toast({
        title: event.title,
        description: event.description,
      });
    });

  }, [playerAddress, connectionStatus, toast, handleStateUpdate]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    resetGame();
  }, []);

  const resetGame = useCallback(() => {
    setPlayers([]);
    setGameState(initialGameState);
    setConnectionStatus('disconnected');
  }, []);

  const sendGameAction = useCallback((action, data) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('gameAction', { action, ...data });
    } else {
      toast({
        title: "Not Connected",
        description: "You're not connected to the game server.",
        variant: "destructive"
      });
    }
  }, [toast]);
  
  useEffect(() => {
    return () => {
        if (socketRef.current) {
            socketRef.current.disconnect();
        }
    };
  }, []);


  return {
    players,
    gameState,
    connectionStatus,
    connect,
    disconnect,
    sendGameAction,
  };
};