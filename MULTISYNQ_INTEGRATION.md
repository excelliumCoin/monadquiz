# MultiSynq Client Integration

This project has been updated to use the MultiSynq client for real-time multiplayer functionality.

## Overview

The project now uses a structured MultiSynq client implementation that provides:

- **Real-time WebSocket connection** to MultiSynq servers
- **Automatic reconnection** with exponential backoff
- **Type-safe message handling** for game events
- **Async/await API** for all multiplayer operations

## Architecture

### Client Implementation

The MultiSynq client is implemented in `src/lib/multisynq-client.js` and provides:

```javascript
class MultiSynqClient {
  constructor(options) // Initialize with API key and event handlers
  connect() // Establish WebSocket connection
  disconnect() // Close connection
  isConnected() // Check connection status
  send(message) // Send raw message
  joinRoom(roomId, playerData) // Join a game room
  leaveRoom(roomId) // Leave a game room
  sendGameAction(actionType, actionData) // Send game-specific actions
}
```

### React Hook Integration

The `useMultiSynq` hook in `src/hooks/useMultiSynq.js` provides:

- **Connection state management**
- **Player and game data synchronization**
- **Event handling for multiplayer actions**
- **Error handling and reconnection logic**

### Component Integration

All components receive multiplayer state and actions via props:

```javascript
// In App.jsx
const { 
  connectionStatus, 
  players, 
  gameData, 
  joinRoom, 
  leaveRoom, 
  sendAnswer,
  sendGameAction,
  leaderboard 
} = useMultiSynq();
```

## Key Features

### 1. Connection Management
- Automatic connection to MultiSynq servers
- Connection status indicators in UI
- Automatic reconnection on disconnection
- Error handling for connection failures

### 2. Room Management
- Join/leave game rooms
- Player synchronization across clients
- Real-time player list updates

### 3. Game Actions
- Submit quiz answers
- Send game-specific actions (for arena/fighting games)
- Real-time game state synchronization

### 4. Event Handling
- Player join/leave events
- Game state updates
- Leaderboard updates
- Question updates

## Usage Examples

### Joining a Room
```javascript
const handleJoinRoom = async (roomId) => {
  try {
    await joinRoom(roomId, playerAddress);
    // Room joined successfully
  } catch (error) {
    // Handle error
  }
};
```

### Sending Game Actions
```javascript
const handleAnswer = async (questionId, answerIndex, playerAddress) => {
  try {
    await sendAnswer(questionId, answerIndex, playerAddress);
    // Answer sent successfully
  } catch (error) {
    // Handle error
  }
};
```

### Sending Custom Game Actions
```javascript
const handleFightAction = async (actionType, actionData) => {
  try {
    await sendGameAction(actionType, actionData);
    // Action sent successfully
  } catch (error) {
    // Handle error
  }
};
```

## Error Handling

The implementation includes comprehensive error handling:

- **Connection errors**: Automatic reconnection with backoff
- **Message errors**: Graceful degradation with user feedback
- **Action errors**: Toast notifications for user awareness
- **State errors**: Fallback to local state when needed

## Migration from Custom WebSocket

The project has been migrated from a custom WebSocket implementation to use the structured MultiSynq client:

### Before (Custom WebSocket)
```javascript
const ws = new WebSocket(`${WS_URL}?apiKey=${API_KEY}`);
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Handle message
};
ws.send(JSON.stringify(message));
```

### After (MultiSynq Client)
```javascript
const client = new MultiSynqClient({
  apiKey: API_KEY,
  onMessage: (data) => {
    // Handle message
  }
});
await client.joinRoom(roomId, playerData);
await client.sendGameAction(actionType, actionData);
```

## Benefits

1. **Structured API**: Clear, type-safe methods for all operations
2. **Better Error Handling**: Comprehensive error management
3. **Automatic Reconnection**: Robust connection management
4. **Async/Await**: Modern JavaScript patterns for better code flow
5. **Extensible**: Easy to add new game actions and events
6. **Maintainable**: Clean separation of concerns

## Future Enhancements

When the official `@multisynq/client` package becomes available:

1. Replace the local implementation with the official client
2. Update imports in `useMultiSynq.js`
3. Remove the local `multisynq-client.js` file
4. Update package.json dependencies

The current implementation provides a working foundation that can be easily migrated to the official client when available. 