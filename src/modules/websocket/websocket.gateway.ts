import { Injectable, Logger } from '@nestjs/common'
import {
    MessageBody,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { WebsocketService } from './websocket.service'

@Injectable()
@WebSocketGateway({
    transports: ['websocket'],
    cors: {
        origin: '*', // Enable CORS for all origins
        methods: ['GET', 'POST'], // Allow specific methods
        allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
        credentials: true
    }
})
export class WebsocketGateway {
    @WebSocketServer()
    server: Server
    private logger: Logger = new Logger('SocketServerGateway')
    private clients: Map<string, Socket> = new Map() // CREATING A MAP TO STORE CLIENTS
    constructor(private readonly websocketService: WebsocketService) {}

    /**
     * This method is called when a client connects to the server.
     * @param client
     */
    async handleConnection(client: Socket) {
        this.clients.set(client.id, client)
        const targetClient = this.clients.get(client.id)
        if (targetClient) {
            this.logger.log(`Client connected: ${client.id}`)
        }
    }

    /**
     * This method is called when the server receives a response from a client.
     * @param data
     * @param client
     */
    handleNotification(@MessageBody() data) {
        this.logger.log(`Notification response: ${JSON.stringify(data)}`)
        const clientId = data.client_id
        const targetClient = this.clients.get(clientId)
        if (targetClient) {
            targetClient.emit('new-event', data)
        } else {
            this.logger.log('Client not found')
        }
    }

    /**
     * This method is called when a client disconnects from the server.
     * @param client
     */
    async handleDisconnect(client: Socket) {
        const targetClient = this.clients.get(client.id)
        if (targetClient) {
            this.logger.log(`Client disconnected: ${client.id}`)
        }
        this.clients.delete(client.id)
    }
}
