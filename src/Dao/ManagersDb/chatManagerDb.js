import chatModel from "../Models/chatModel.js";

class chatManagerDb {
  async getMessages() {
    try {
      const messages = await chatModel.find().lean();
      return messages ;
    } catch (error) {
      return "Error - Cannot restore messages";
    }
  }

  async newMessage(data) {
    try {
      const result = await chatModel.create(data);
      const messages = await this.getMessages();
      return messages;
      
    } catch (error) {
      return "Error - Cannot save message";
    }
  }
}

export default chatManagerDb;