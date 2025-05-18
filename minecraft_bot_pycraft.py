from minecraft.networking.connection import Connection
from minecraft.networking.packets import Packet, clientbound, serverbound
import getpass
import sys

def main():
    # Connection details
    server_address = 'localhost'
    server_port = 25565
    username = 'MyPythonBot'
    
    # Create a connection
    connection = Connection(
        server_address, server_port, username=username, 
        auth_token=None  # For offline mode (no authentication)
    )
    
    print(f"Attempting to connect to {server_address}:{server_port} as {username}")
    
    # Set up event handlers
    
    # Handle disconnect
    @connection.listener(clientbound.login.DisconnectPacket)
    def on_disconnect(packet):
        print(f"Disconnected: {packet.json_data}")
        connection.disconnect()
        sys.exit()
    
    # Handle login success
    @connection.listener(clientbound.login.LoginSuccessPacket)
    def on_login_success(packet):
        print(f"Login successful! UUID: {packet.uuid}")
        print("Bot has joined the server.")
        
        # Send chat message after joining
        def send_chat_message():
            chat_packet = serverbound.play.ChatPacket()
            chat_packet.message = "Hello! I am a Python bot."
            connection.write_packet(chat_packet)
        
        # Schedule sending a chat message soon after login
        from twisted.internet import reactor
        reactor.callLater(3, send_chat_message)
    
    # Handle chat messages
    @connection.listener(clientbound.play.ChatMessagePacket)
    def on_chat_message(packet):
        print(f"Chat: {packet.json_data}")
        # For simplicity, we're just printing the raw JSON
        # In a real bot, you'd parse this to extract the message and sender
    
    # Connect to the server
    connection.connect()
    
    print("Press Ctrl+C to exit.")
    
    try:
        # Start the network event loop
        from twisted.internet import reactor
        reactor.run()
    except KeyboardInterrupt:
        print("Bot shutting down...")
        connection.disconnect()
        sys.exit(0)

if __name__ == "__main__":
    main() 