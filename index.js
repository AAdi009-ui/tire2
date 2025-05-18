const { createClient } = require('bedrock-protocol')

console.log('Attempting to connect to server...')

// Server connection info
const serverInfo = {
  host: 'formfive.minefort.com',
  port: 19132,
  username: 'Bot',
  offline: true,
  version: '1.21.80',  // Bedrock version
  connectTimeout: 30000  // Increase connection timeout to 30 seconds
}

let client = null
let reconnectAttempts = 0
const MAX_RECONNECT_ATTEMPTS = 10
let RECONNECT_DELAY = 5000 // 5 seconds initial, will increase with exponential backoff

// Function to create and set up the client
function connectToServer() {
  console.log(`Connecting to server (Attempt ${reconnectAttempts + 1})...`)
  
  try {
    client = createClient(serverInfo)
    
    client.on('spawn', () => {
      console.log('Bot has spawned!')
      reconnectAttempts = 0 // Reset reconnect attempts on successful spawn
      RECONNECT_DELAY = 5000 // Reset delay on successful connection
      
      // Simple keep-alive by periodically forcing a tick update
      setInterval(() => {
        try {
          console.log('Sending keep-alive signal')
          // Just queue a tick sync packet which is simple and reliable
          client.write('tick_sync', {
            request_id: Date.now(),
            server_timestamp: 0n
          })
        } catch (err) {
          console.log('Error sending keep-alive:', err.message)
        }
      }, 60000) // Every minute
    })
    
    client.on('text', (packet) => {
      const message = packet.message
      console.log('Received message:', message)
      
      if (message.includes('hello')) {
        try {
          client.write('text', {
            type: 'chat',
            needs_translation: false,
            source_name: client.username,
            xuid: '',
            platform_chat_id: '',
            message: 'Hello!'
          })
        } catch (err) {
          console.log('Error sending message:', err.message)
        }
      }
    })
    
    client.on('error', (err) => {
      console.log('Error:', err)
      console.log('Error details:', {
        host: client.options.host,
        port: client.options.port,
        version: client.options.version,
        error: err.message
      })
      
      // If it's a timeout error, handle it specially
      if (err.message && (err.message.includes('timed out') || err.message.includes('timeout'))) {
        console.log('Connection timed out, attempting to reconnect...')
        attemptReconnect()
      }
    })
    
    client.on('close', (reason) => {
      console.log('Connection closed:', reason || 'No reason provided')
      attemptReconnect()
    })
  } catch (err) {
    console.log('Error creating client:', err.message)
    attemptReconnect()
  }
}

// Function to handle reconnection with exponential backoff
function attemptReconnect() {
  if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
    reconnectAttempts++
    // Exponential backoff - double the delay each time, up to 5 minutes max
    RECONNECT_DELAY = Math.min(RECONNECT_DELAY * 2, 300000)
    console.log(`Reconnecting in ${RECONNECT_DELAY / 1000} seconds... (Attempt ${reconnectAttempts})`)
    setTimeout(connectToServer, RECONNECT_DELAY)
  } else {
    console.log(`Max reconnection attempts (${MAX_RECONNECT_ATTEMPTS}) reached. Giving up.`)
    console.log('Waiting 30 minutes before trying again...')
    
    // Reset counters and try again after 30 minutes
    reconnectAttempts = 0
    RECONNECT_DELAY = 5000
    setTimeout(connectToServer, 30 * 60 * 1000)
  }
}

// Initial connection
connectToServer()

// Handle process termination
process.on('SIGINT', () => {
  console.log('Bot shutting down...')
  if (client) {
    client.close()
  }
  process.exit(0)
}) 