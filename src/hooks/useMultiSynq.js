import { useState, useEffect, useRef } from 'react';

const MULTISYNQ_API_KEY = '2T3Pz87uuBgottPaS78miDAfbcCgl07ivyk6EkNTqq';
const MULTISYNQ_WS_URL = 'wss://api.multisynq.io/ws';

export function useMultiSynq() {
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [players, setPlayers] = useState([]);
  const [gameData, setGameData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    connectToMultiSynq();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  const connectToMultiSynq = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      return;
    }
    setConnectionStatus('connecting');
    
    try {
      wsRef.current = new WebSocket(`${MULTISYNQ_WS_URL}?apiKey=${MULTISYNQ_API_KEY}`);
      
      wsRef.current.onopen = () => {
        setConnectionStatus('connected');
        console.log('Connected to MultiSynq');
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      wsRef.current.onclose = () => {
        setConnectionStatus('disconnected');
        console.log('Disconnected from MultiSynq. Attempting to reconnect...');
        
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        reconnectTimeoutRef.current = setTimeout(() => {
          connectToMultiSynq();
        }, 3000);
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        wsRef.current.close();
      };
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
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected. Message not sent:', message);
    }
  };

  const joinRoom = async (roomId, playerAddress) => {
    sendMessage({
      type: 'join_room',
      roomId,
      player: {
        id: playerAddress,
        address: playerAddress,
        name: `Player ${playerAddress.slice(0, 6)}...${playerAddress.slice(-4)}`,
        score: 0
      }
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
  };

  const leaveRoom = (roomId) => {
    sendMessage({
      type: 'leave_room',
      roomId
    });
    setGameData(null);
    setPlayers([]);
  };

  const sendAnswer = (questionId, answerIndex, playerAddress) => {
    sendMessage({
      type: 'submit_answer',
      questionId,
      answerIndex,
      playerId: playerAddress,
      timestamp: Date.now()
    });
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
    sendMessage
  };
}