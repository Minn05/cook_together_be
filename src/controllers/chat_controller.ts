import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { connect } from '../database/connection';
import { RowDataPacket } from 'mysql2';

export const getListMessagesByUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const conn = await connect();

    const listdb = await conn.query<RowDataPacket[]>(`CALL SP_GET_ALL_MESSAGE_BY_USER(?);`, [
      req.idPerson,
    ]);

    conn.end();

    return res.json({
      resp: true,
      message: 'Danh sách tin nhắn của người dùng',
      listChat: listdb[0][0],
    });
  } catch (err) {
    return res.status(500).json({
      resp: false,
      message: err,
    });
  }
};


export const InsertListChat = async (uidSource: string, uidTarget: string) => {
  const conn = await connect();

  const verifyExistsSourceone = await conn.query<RowDataPacket[]>(
    'SELECT COUNT(uid_list_chat) AS chat FROM list_chats WHERE source_uid = ? AND target_uid = ? LIMIT 1',
    [uidSource, uidTarget]
  );

  if (verifyExistsSourceone[0][0].chat == 0) {
    await conn.query(
      'INSERT INTO list_chats (uid_list_chat, source_uid, target_uid) VALUE (?,?,?)',
      [uuidv4(), uidSource, uidTarget]
    );
  }

  conn.end();
};
export const InsertListChatRecipe = async (uidSource: string, uidTarget: string) => {
  const conn = await connect();

  const verifyExistsSourceone = await conn.query<RowDataPacket[]>(
    'SELECT COUNT(uid) AS chat FROM list_recipe_chat WHERE source_uid = ? AND recipe_uid = ? LIMIT 1',
    [uidSource, uidTarget]
  );

  if (verifyExistsSourceone[0][0].chat == 0) {
    // INSERT INTO `list_recipe_chat`(`uid`, `soure_uid`, `recipe_uid`, `last_message`, `update_at`) VALUES ()
    await conn.query('INSERT INTO list_recipe_chat (uid, source_uid, recipe_uid) VALUE (?,?,?)', [
      uuidv4(),
      uidSource,
      uidTarget,
    ]);
  }

  conn.end();
};

export const updateLastMessage = async (uidTarget: string, uidPerson: string, message: string) => {
  const conn = await connect();

  const update = new Date().toISOString().slice(0, 19).replace('T', ' ');

  await conn.query(
    'UPDATE list_chats SET last_message = ?, updated_at = ? WHERE source_uid = ? AND target_uid = ?',
    [message, update, uidPerson, uidTarget]
  );

  conn.end();
};
export const updateLastMessageRecipe = async (
  uidTarget: string,
  uidPerson: string,
  message: string
) => {
  const conn = await connect();

  const update = new Date().toISOString().slice(0, 19).replace('T', ' ');

  await conn.query(
    'UPDATE list_recipe_chat SET last_message = ?, updated_at = ? WHERE source_uid = ? AND recipe_uid = ?',
    [message, update, uidPerson, uidTarget]
  );
  conn.end();
};

export const addNewMessage = async (uidSource: string, uidTarget: string, message: string) => {
  const conn = await connect();

  await conn.query(
    'INSERT INTO messages (uid_messages, source_uid, target_uid, message) VALUE (?,?,?,?)',
    [uuidv4(), uidSource, uidTarget, message]
  );

  conn.end();
};
export const addNewMessageRecipe = async (userId: string, recipeId: string, message: string) => {
  const conn = await connect();
  // `recipe_messages`(`uid_message_recipe`, `soure_uid`, `target_recipe_uid`, `message`
  await conn.query(
    'INSERT INTO recipe_messages (uid_message_recipe, source_uid, target_recipe_uid, message) VALUE (?,?,?,?)',
    [uuidv4(), userId, recipeId, message]
  );

  conn.end();
};

export const getAllMessagesByUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const conn = await connect();

    const messagesdb = await conn.query<RowDataPacket[]>(`CALL SP_ALL_MESSAGE_BY_USER(?,?);`, [
      req.idPerson,
      req.params.from,
    ]);

    conn.end();

    return res.json({
      resp: true,
      message: 'get all messages by user',
      listMessage: messagesdb[0][0],
    });
  } catch (err) {
    return res.status(500).json({
      resp: false,
      message: err,
    });
  }
};

export const getCallByUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const conn = await connect();
    const messagesdb = await conn.query<RowDataPacket[]>(`SELECT * FROM call_video WHERE uid = ?`, [
      req.params.id,
    ]);

    conn.end();

    return res.json({
      resp: true,
      message: 'Get call by user',
      caller: messagesdb[0][0],
    });
  } catch (err) {
    return res.status(500).json({
      resp: false,
      message: err,
    });
  }
};

export const addNewCalling = async (call: ICalling) => {
  const conn = await connect();
  await conn.query(
    'INSERT INTO call_video (uid,caller_uid,receiver_id,call_name,receiver_name,caller_avatar,receiver_avatar,channel_id,channel_name,is_disabled) VALUE (?,?,?,?,?,?,?,?,?,?)',
    [
      uuidv4(),
      call.callerId,
      call.receiverId,
      call.callerName,
      call.receiverName,
      call.callerAvatar,
      call.receiverAvatar,
      call.channelId,
      call.channelName,
      call.isDisabled,
    ]
  );
  conn.end();
};

export interface ICalling {
  isDisabled: boolean;
  callerId: string;
  callerName: string;
  callerAvatar: string;
  receiverId: string;
  receiverName: string;
  receiverAvatar: string;
  channelId: string;
  channelName: string;
}
// export const getAllMessagesByRecipe = async (req: Request, res: Response): Promise<Response> => {

//     try {

//         const conn = await connect();

//         const messagesdb = await conn.query<RowDataPacket[]>(
//           `CALL SP_ALL_MESSAGE_BY_RECIPE(?,?);`,
//           [req.idPerson, req.params.from]
//         )

//         conn.end();

//         return res.json({
//             resp: true,
//             message: 'get all messages by user',
//             listMessage: messagesdb[0][0]
//         });

//     } catch(err) {
//         console.log(err);

//         return res.status(500).json({
//             resp: false,
//             message: err
//         });
//     }

// }
