/**
 * Simple MultiSynq Client Implementation
 * This is a placeholder implementation that can be replaced with the official @multisynq/client
 */

export class MultiSynqClient {
  constructor(options) {
    this.apiKey = options.apiKey;
    this.onConnect = options.onConnect || (() => {});
    this.onDisconnect = options.onDisconnect || (() => {});
    this.onError = options.onError || (() => {});
    this.onMessage = options.onMessage || (() => {});
    
    this.ws = null;
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
  }

  connect() {
    if (this.isConnecting || this.isConnected()) {
      return;
    }

    this.isConnecting = true;
    
    try {
      this.ws = new WebSocket(`wss://api.multisynq.io/ws?apiKey=${this.apiKey}`);
      
      this.ws.onopen = () => {
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.onConnect();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.onMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        this.isConnecting = false;
        this.onDisconnect();
        
        // Attempt to reconnect
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          setTimeout(() => {
            this.connect();
          }, this.reconnectDelay);
        }
      };

      this.ws.onerror = (error) => {
        this.isConnecting = false;
        this.onError(error);
      };
    } catch (error) {
      this.isConnecting = false;
      this.onError(error);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }

  send(message) {
    if (this.isConnected()) {
      this.ws.send(JSON.stringify(message));
    } else {
      throw new Error('Client is not connected');
    }
  }

  async joinRoom(roomId, playerData) {
    this.send({
      type: 'join_room',
      roomId,
      player: playerData
    });
  }

  async leaveRoom(roomId) {
    this.send({
      type: 'leave_room',
      roomId
    });
  }

  async sendGameAction(actionType, actionData) {
    this.send({
      type: 'game_action',
      actionType,
      actionData
    });
  }
} 