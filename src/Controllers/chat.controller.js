
import {chatManagerDb} from "../Dao/Mongo/chatManagerDb.js";
// en caso de exportar el socket de chat
const groupMessages = new chatManagerDb();

const chatController = (socket) => {
  console.log("New client Connected")
    socket.on("new-message", async (data) => {
      const allMessages = await groupMessages.newMessage(data);
      io.emit("messages", allMessages);
    });

    socket.on("new-user", async (username)=>{
        const recovermesage = await groupMessages.getMessages();
        socket.emit("messages",recovermesage);
        socket.broadcast.emit("new-user",username);
    })  
};
export  {chatController};
