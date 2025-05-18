const mineflayer = require('mineflayer')

function createBot() {
  const bot = mineflayer.createBot({
    host: 'kyunaihoripadhai.play.hosting', // Change to your server IP or hostname
    port: 16489,       // Default Java Edition port
    username: 'Bot',   // Change to your bot's username
    // password: 'your_password', // Uncomment if using a Microsoft account
    version: '1.21.5'     // false = auto-detect, or specify e.g. '1.21.1'
  })

  bot.on('spawn', () => {
    console.log('Bot has spawned!')
    // Move forward for 1 second every 10 seconds to avoid being kicked
    setInterval(() => {
      bot.setControlState('forward', true)
      setTimeout(() => bot.setControlState('forward', false), 1000)
    }, 10000)
  })

  bot.on('chat', (username, message) => {
    if (username === bot.username) return
    console.log(`${username}: ${message}`)
    if (message.toLowerCase().includes('hello')) {
      bot.chat('Hello!')
    }
  })

  bot.on('kicked', (reason) => console.log('Kicked:', reason))
  bot.on('error', (err) => console.log('Error:', err))
  bot.on('end', () => {
    console.log('Bot disconnected, reconnecting in 5s...')
    setTimeout(createBot, 5000)
  })
}

// Start the bot for the first time
createBot() 