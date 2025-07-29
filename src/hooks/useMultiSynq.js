import { useState, useEffect, useRef } from 'react';
import { MultiSynqClient } from '@/lib/multisynq-client';

const MULTISYNQ_API_KEY = '2T3Pz87uuBgottPaS78miDAfbcCgl07ivyk6EkNTqq';

export function useMultiSynq() {
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [players, setPlayers] = useState([]);
  const [gameData, setGameData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const clientRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    connectToMultiSynq();
    return () => {
      if (clientRef.current) {
        clientRef.current.disconnect();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  const connectToMultiSynq = () => {
    if (clientRef.current?.isConnected()) {
      return;
    }
    setConnectionStatus('connecting');
    
    try {
      clientRef.current = new MultiSynqClient({
        apiKey: MULTISYNQ_API_KEY,
        onConnect: () => {
          setConnectionStatus('connected');
          console.log('Connected to MultiSynq');
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
        },
        onDisconnect: () => {
          setConnectionStatus('disconnected');
          console.log('Disconnected from MultiSynq. Attempting to reconnect...');
          
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
          reconnectTimeoutRef.current = setTimeout(() => {
            connectToMultiSynq();
          }, 3000);
        },
        onError: (error) => {
          console.error('MultiSynq error:', error);
          setConnectionStatus('disconnected');
        },
        onMessage: (data) => {
          handleMessage(data);
        }
      });

      clientRef.current.connect();
    } catch (error) {
      console.error('Error connecting to MultiSynq:', error);
      setConnectionStatus('disconnected');
    }
  };

  const handleMessage = (data) => {
    switch (data.type) {
      case 'player_joined':
        setPlayers(prev => [...prev.filter(p => p.id !== data.player.id), data.player]);
        break;
      case 'player_left':
        setPlayers(prev => prev.filter(p => p.id !== data.playerId));
        break;
      case 'game_state_update':
        setGameData(data.gameState);
        break;
      case 'players_update':
        setPlayers(data.players);
        break;
      case 'leaderboard_update':
        setLeaderboard(data.leaderboard);
        break;
      case 'question_update':
        setGameData(prev => ({ ...prev, currentQuestion: data.question }));
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  };

  const sendMessage = (message) => {
    if (clientRef.current?.isConnected()) {
      clientRef.current.send(message);
    } else {
      console.error('MultiSynq client is not connected. Message not sent:', message);
    }
  };

  const joinRoom = async (roomId, playerAddress) => {
    if (!clientRef.current?.isConnected()) {
      throw new Error('MultiSynq client is not connected');
    }

    try {
      await clientRef.current.joinRoom(roomId, {
        id: playerAddress,
        address: playerAddress,
        name: `Player ${playerAddress.slice(0, 6)}...${playerAddress.slice(-4)}`,
        score: 0
      });

      // Simulate receiving game data after joining
      const mockGameData = {
        roomId,
        currentQuestion: generateMockQuestions()[0],
        questions: generateMockQuestions(),
        currentQuestionIndex: 0,
        gameStatus: 'active',
        timeRemaining: 30
      };
      setGameData(mockGameData);
      setPlayers([{
        id: playerAddress,
        address: playerAddress,
        name: `Player ${playerAddress.slice(0, 6)}...${playerAddress.slice(-4)}`,
        score: 0
      }]);
    } catch (error) {
      console.error('Error joining room:', error);
      throw error;
    }
  };

  const leaveRoom = async (roomId) => {
    if (clientRef.current?.isConnected()) {
      try {
        await clientRef.current.leaveRoom(roomId);
      } catch (error) {
        console.error('Error leaving room:', error);
      }
    }
    setGameData(null);
    setPlayers([]);
  };

  const sendAnswer = async (questionId, answerIndex, playerAddress) => {
    if (!clientRef.current?.isConnected()) {
      throw new Error('MultiSynq client is not connected');
    }

    try {
      await clientRef.current.sendGameAction('submit_answer', {
        questionId,
        answerIndex,
        playerId: playerAddress,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Error sending answer:', error);
      throw error;
    }
  };

  const sendGameAction = async (actionType, actionData) => {
    if (!clientRef.current?.isConnected()) {
      throw new Error('MultiSynq client is not connected');
    }

    try {
      await clientRef.current.sendGameAction(actionType, actionData);
    } catch (error) {
      console.error('Error sending game action:', error);
      throw error;
    }
  };

  const generateMockQuestions = () => [
    {
      id: 1,
      question: "What is the core feature of the Monad blockchain?",
      options: [
        "High transaction speed and low cost",
        "NFT support only",
        "Centralized structure",
        "Limited smart contract support"
      ],
      correctAnswer: 0,
      timeLimit: 30
    },
    {
      id: 2,
      question: "What is the main purpose of the MultiSynq API?",
      options: [
        "Data storage only",
        "Real-time multiplayer experiences",
        "Static websites",
        "Email sending"
      ],
      correctAnswer: 1,
      timeLimit: 30
    },
    {
      id: 3,
      question: "What is the main advantage of blockchain technology?",
      options: [
        "Centralized control",
        "Slow transaction speed",
        "Transparency and security",
        "High energy consumption"
      ],
      correctAnswer: 2,
      timeLimit: 30
    },
    {
      id: 4,
      question: "In which language are smart contracts typically written?",
      options: [
        "Python",
        "JavaScript",
        "Solidity",
        "C++"
      ],
      correctAnswer: 2,
      timeLimit: 30
    },
    {
      id: 5,
      question: "What does DeFi stand for?",
      options: [
        "Digital Finance",
        "Decentralized Finance",
        "Direct Finance",
        "Dynamic Finance"
      ],
      correctAnswer: 1,
      timeLimit: 30
    }
  ];

  return {
    connectionStatus,
    players,
    gameData,
    leaderboard,
    joinRoom,
    leaveRoom,
    sendAnswer,
    sendGameAction,
    sendMessage
  };
}