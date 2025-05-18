from mineproxy.client import MinecraftClient
import asyncio
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)

async def main():
    # Bot configuration
    server_address = 'localhost'
    server_port = 25565
    username = 'MyPythonBot'
    
    print(f"Attempting to connect to {server_address}:{server_port} as {username}")
    
    # Create client instance
    client = MinecraftClient()
    
    # Set up event handlers
    @client.on("login")
    async def on_login():
        print(f"Successfully logged in as {username}")
        # Send a chat message after joining
        await asyncio.sleep(3)
        await client.chat("Hello! I am a Python bot.")
    
    @client.on("chat")
    async def on_chat(message, sender):
        print(f"Chat: {sender} > {message}")
        # Respond to specific commands
        if message.lower() == "hello bot":
            await client.chat(f"Hello, {sender}!")
    
    @client.on("disconnect")
    async def on_disconnect(reason):
        print(f"Disconnected: {reason}")
    
    # Connect to the server
    try:
        await client.connect(
            server_address, 
            port=server_port,
            username=username,
            auth_mode="offline"  # For offline-mode servers
        )
        
        # Keep the bot running
        while client.connected:
            await asyncio.sleep(1)
            
    except KeyboardInterrupt:
        print("Bot shutting down...")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if client.connected:
            await client.disconnect("Bot shutting down")

if __name__ == "__main__":
    asyncio.run(main()) 