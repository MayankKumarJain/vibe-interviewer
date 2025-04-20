import { Context } from "@oak/oak";

type WebSocketWithUsername = WebSocket & {
  userId: string;
  meetingId: string;
  sdp?: any;
};
type AppEvent = { event: string; [key: string]: any };

export default class ChatServer {
  private connectedClients = new Map<string, Array<WebSocketWithUsername>>();

  public async handleConnection(ctx: Context) {
    let socket = (await ctx.upgrade()) as WebSocketWithUsername;
    const meetingId = ctx.request.url.searchParams.get("meetingId");
    const userId = ctx.request.url.searchParams.get("userId");

    if (!userId || !meetingId) return;

    socket = { ...socket, userId, meetingId };

    // console.log("New connection for", userId, meetingId);
    const clients = this.connectedClients.get(meetingId);
    // console.log({ clients: this.connectedClients });

    if (
      this.connectedClients.get(meetingId)?.some((websocket) => {
        return websocket.userId === userId;
      })
    ) {
      // socket.close(1008, `Username with ${userId} is already connected`);
      return;
    }

    // socket.onopen = this.broadcastUsernames.bind(this);
    // socket.onclose = () => {
    //   this.clientDisconnected(socket.meetingId, socket.userId);
    // };
    socket.onmessage = (m) => {
      console.log({ message: m });
      this.send(socket, socket.meetingId, socket.userId, m);
    };
    const clientsForMeeting = this.connectedClients.get(meetingId) ?? [];
    this.connectedClients.set(meetingId, [...clientsForMeeting, socket]);

    console.log(`New client connected: ${userId}`);
  }

  private send(
    sender: WebSocketWithUsername,
    meetingId: string,
    userId: string,
    message: any
  ) {
    const data = JSON.parse(message.data);
    if (data.type == "offer") {
      const connectedClients = this.connectedClients.get(meetingId);
      const otherClientList =
        connectedClients?.filter(
          (socket) => socket.userId !== userId && socket.sdp
        ) ?? [];

      sender.sdp = data.sdp;

      const receiver = otherClientList[0] ?? null;
      if (receiver) {
        const answerForReciever = {
          type: "answer",
          sdp: sender.sdp,
        };
        const answerForSender = {
          type: "answer",
          sdp: receiver.sdp,
        };

        receiver.send(JSON.stringify(answerForReciever));
        sender.send(JSON.stringify(answerForSender));
      }
    }
  }

  // private clientDisconnected(meetingId: string, userId: string) {
  //   if (!this.connectedClients.has(meetingId)) return;

  //   const clients = this.connectedClients.get(meetingId);
  //   const newClientList =
  //     clients?.filter((socket) => socket.userId !== userId) ?? [];
  //   this.connectedClients.set(meetingId, newClientList);

  //   console.log(`Client ${userId} disconnected`);
  // }

  // private broadcastUsernames() {
  //   const usernames = [...this.connectedClients.keys()];
  //   this.broadcast({ event: "update-users", usernames });

  //   console.log("Sent username list:", JSON.stringify(usernames));
  // }

  // private broadcast(message: AppEvent) {
  //   const messageString = JSON.stringify(message);
  //   for (const client of this.connectedClients.values()) {
  //     client[0].send(messageString);
  //   }
  // }
}
