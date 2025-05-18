import lodestone
import time

# --- Configuration ---
SERVER_ADDRESS = 'localhost'  # Replace with your server's IP address or hostname
SERVER_PORT = 25565  # Replace with your server's port if it's not the default
BOT_USERNAME = 'MyPythonBot'
# For online-mode servers (most common), use 'microsoft'
# For offline-mode servers, use 'offline'
AUTH_METHOD = 'offline' # or 'microsoft'
# If using 'microsoft' auth, you might be prompted to log in via a browser the first time.
# Lodestone will cache the token for future runs.

# Optional: Specify Minecraft version if needed, otherwise it's auto-detected
# MINECRAFT_VERSION = "1.20.1"
# --- Configuration End ---

print(f"Attempting to connect to {SERVER_ADDRESS}:{SERVER_PORT} as {BOT_USERNAME} using {AUTH_METHOD} auth.")

bot_instance = None # Define bot_instance outside try block for access in finally

try:
    bot_instance = lodestone.createBot(
        host=SERVER_ADDRESS,
        port=SERVER_PORT,
        username=BOT_USERNAME,
        auth=AUTH_METHOD,
        # version=MINECRAFT_VERSION # Uncomment if you specified a version
        # ls_skip_checks=True # Add this if you encounter issues with server checks, might be needed for some servers
    )
    print(f"Bot object created. Waiting for spawn...")

    @bot_instance.on('spawn')
    def handle_spawn(new_position, new_yaw, new_pitch):
        print(f"Bot spawned at {new_position}!")
        bot_instance.chat(f"Hello server! {BOT_USERNAME} is here.")
        # Example: Make the bot look at a nearby coordinate
        # bot_instance.lookAt(bot_instance.entity.position.offset(5, 0, 0))

    @bot_instance.on('chat')
    def handle_chat(username, message, *args):
        if username == bot_instance.username:
            return  # Ignore messages from the bot itself
        print(f"Chat: <{username}> {message}")
        
        if message.lower() == 'hello bot':
            bot_instance.chat(f"Hello {username}!")
        elif message.lower() == 'quit bot':
            bot_instance.chat("Goodbye!")
            time.sleep(1)  # Give a moment for the message to send
            bot_instance.quit("Quit command received")
            print("Bot quit command processed.")


    @bot_instance.on('kicked')
    def handle_kicked(reason, loggedIn):
        print(f"Kicked from server. Reason: {reason}")
        if loggedIn:
            print("Bot was logged in when kicked.")
        else:
            print("Bot was not logged in when kicked (possibly during connection).")

    @bot_instance.on('error')
    def handle_error(error):
        print(f"An error occurred: {error}")
        # Consider if bot_instance.quit() should be called here depending on the error.

    print("Bot setup complete. Listening for events. Press Ctrl+C to exit.")
    # This loop keeps the main thread alive. Lodestone's event listeners run in background threads.
    while True:
        if bot_instance and not bot_instance.connected and bot_instance.ended:
            print("Bot has disconnected and ended. Exiting loop.")
            break
        time.sleep(1)

except KeyboardInterrupt:
    print("KeyboardInterrupt received. Exiting bot...")
except ConnectionRefusedError:
    print(f"Connection refused. Ensure Minecraft server is running at {SERVER_ADDRESS}:{SERVER_PORT} and is accessible.")
except Exception as e:
    print(f"Failed to create or connect bot: {e}")
    print("Troubleshooting tips:")
    print("- Ensure the server address and port are correct.")
    print("- If using 'microsoft' auth, ensure your Microsoft account is valid and can join servers.")
    print("- For 'offline' auth, make sure the server has 'online-mode=false' in its 'server.properties'.")
    print("- Check your internet connection and firewall settings.")
    print("- The Minecraft version might be incompatible. Try specifying 'MINECRAFT_VERSION'.")
finally:
    if bot_instance and bot_instance.connected:
        print("Ensuring bot disconnects on script exit (if not already).")
        bot_instance.quit("Script ended")
    print("Bot script finished.") 