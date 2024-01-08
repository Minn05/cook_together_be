// import { Server } from 'socket.io';
// import { addNewMessage, InsertListChat, updateLastMessage } from '../controllers/chat_controller';
// import { updateOfflineUser, updateOnlineUser } from '../controllers/user_controller';
// import { verifyTokenSocket } from '../middleware/verify_token';
// import { addNewMessageRecipe } from '../controllers/recipes_controller';


// export const socketChatMessages = ( io: Server ) => {


//     const nameSpaceChat = io.of('/socket-chat-message');


//     nameSpaceChat.on('connection', async client => {

//         const [ verify, uidPerson ] = verifyTokenSocket( client.handshake.headers['xxx-token'] );

//         if( !verify ) { return client.disconnect(); }

//         console.log('USER CONECTED');

//         await updateOnlineUser( uidPerson );


//         client.join( uidPerson );

//         client.on('message-personal', async payload => {

//             console.log(payload);

//             await InsertListChat(payload.from, payload.to);

//             await updateLastMessage(payload.to, payload.from, payload.message);

//             await addNewMessage(payload.from, payload.to, payload.message);
            
//             nameSpaceChat.to( payload.to ).emit('message-personal', payload );
//         });

//         client.on('message-recipe', async payload => {
//         console.log(payload)

//         // await InsertListChat(payload.from, payload.to)

//         // await updateLastMessage(payload.to, payload.from, payload.message)

//         await addNewMessageRecipe(payload.from, payload.to, payload.message)

//         nameSpaceChat.to(payload.to).emit('message-recipe', payload)
//         })

//         client.on('disconnect', async _ => {

//             await updateOfflineUser( uidPerson );
//             console.log('USER DISCONNECT');

//         });

//     });

// }
import { Server } from 'socket.io';
import { addNewMessage, addNewMessageRecipe, InsertListChat, InsertListChatRecipe, updateLastMessage, updateLastMessageRecipe } from '../controllers/chat_controller';
import { updateOfflineUser, updateOnlineUser } from '../controllers/user_controller';
import { verifyTokenSocket } from '../middleware/verify_token';
export const socketChatMessages = ( io: Server ) => {
    const nameSpaceChat = io.of('/socket-chat-message');
    nameSpaceChat.on('connection', async client => {
        const [ verify, uidPerson ] = verifyTokenSocket( client.handshake.headers['xxx-token'] );
        if( !verify ) { return client.disconnect(); }
        console.log('USER CONECTED');
        client.join( uidPerson );
        client.on('message-personal', async payload => {
            console.log(payload);
            await InsertListChat(payload.from, payload.to);
            await updateLastMessage(payload.to, payload.from, payload.message);
            await addNewMessage(payload.from, payload.to, payload.message);
            
            nameSpaceChat.to( payload.to ).emit('message-personal', payload );
        });
        client.on('message-recipe', async payload => {
        console.log(payload)
        await InsertListChatRecipe(payload.from, payload.to)
        await updateLastMessageRecipe(payload.to, payload.from, payload.message)
        await addNewMessageRecipe(payload.from, payload.to, payload.message)
        nameSpaceChat.to(payload.to).emit('message-recipe', payload)
        })
        client.on('start-recipe', async payload => {
          console.log("start recipe:",payload)

          await InsertListChat(payload.from, payload.to)

          await updateLastMessage(payload.to, payload.from, payload.message)

          await addNewMessageRecipe(payload.from, payload.to, payload.message)
          console.log("Start recipe");


          nameSpaceChat.to(payload.to).emit('start-recipe', payload)
        })
        client.on('disconnect', async _ => {
            console.log('USER DISCONNECT');
        });
    });
}