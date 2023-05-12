import chatManagerDb from "../Dao/Mongo/chatManagerDb.js";

const groupMessages = new chatManagerDb();

export const chatController = (socket) => {
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