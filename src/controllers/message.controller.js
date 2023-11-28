import messagesModel from "../DAOs/models/messages.model.js";
import MessageDto from '../DTOs/MessageDto.js';

class MessagesController {
  getMessages = async () => {
    try {
      const messages = await messagesModel.find().lean().exec();
      return messages.map(message => new MessageDto(message.user, message.message, message.time));
    } catch (error) {
      console.error(`Error trying to get messages: ${error}`);
    };
  };

  addMessage = async (msg) => {
    try {
      const user = msg.user.trim();
      const message = msg.text.trim();
      if(user.length < 1 || message.length < 1) return;
      const formattedMessage = {
        user: user,
        message: message
      };  
      const newMessage = new messagesModel(formattedMessage);
      await newMessage.save();
      return new MessageDto(newMessage.user, newMessage.message, newMessage.time);
    } catch (error) {
      console.error(`Error al enviar mensaje: ${error}`);
    };
  };
};

const messagesController = new MessagesController();

export default messagesController;
