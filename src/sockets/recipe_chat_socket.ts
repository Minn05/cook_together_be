import { Server } from 'socket.io'
import {
  addNewMessageRecipe,
  InsertListChatRecipe,
  updateLastMessageRecipe,
} from '../controllers/recipes_controller'
import {
  updateOfflineUser,
  updateOnlineUser,
} from '../controllers/user_controller'
import { verifyTokenSocket } from '../middleware/verify_token'

export const socketChatMessagesRecipe = (io: Server) => {
  const nameSpaceChat = io.of('/socket-chat-message-recipe')

  nameSpaceChat.on('connection', async client => {
    const [verify, uidPerson] = verifyTokenSocket(
      client.handshake.headers['xxx-token']
    )

    if (!verify) {
      return client.disconnect()
    }

    console.log('RECIPE CONECTED')

    await updateOnlineUser(uidPerson)

    client.join(uidPerson)

    client.on('message-recipe', async payload => {
      console.log(payload)

      // await InsertListChat(payload.from, payload.to)

      // await updateLastMessage(payload.to, payload.from, payload.message)

      await addNewMessageRecipe(payload.from, payload.to, payload.message)

      nameSpaceChat.to(payload.to).emit('message-recipe', payload)
    })

    
    client.on('disconnect', async _ => {
      await updateOfflineUser(uidPerson)
      console.log('USER DISCONNECT')
    })
  })
}
