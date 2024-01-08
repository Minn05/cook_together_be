import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { connect } from '../database/connection';
import {
  ILikePost,
  INewComment,
  INewPost,
  ISavePost,
  IUidComment,
} from '../interfaces/post.interface';
import { RowDataPacket } from 'mysql2';
import {
  ICommentRecipe,
  IJoinRecipe,
  ILikeRecipe,
  INewRecipe,
  IRoleRecipe,
  ISaveRecipe,
} from '../interfaces/recipe.interface';

export const createNewRecipe = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      title,
      calories,
      category,
      description,
      ingreditents,
      steps,
      time,
      totalPeople,
    }: INewRecipe = req.body;
    console.log(steps, ingreditents);
    const files = req.files as Express.Multer.File[];

    const conn = await connect();
    const uidRecipe = uuidv4();
    await conn.query(
      'INSERT INTO recipe (uid,title,description,category,totalPeople,time,calories,person_uid) value (?,?,?,?,?,?,?,?)',
      [uidRecipe, title, description, category, totalPeople, time, calories, req.idPerson]
    );

    if (ingreditents) {
      console.log('================================================');

      const result = JSON.parse(JSON.parse(ingreditents));
      console.log(result.ingredients);
      console.log(result.steps);

      result?.ingredients?.forEach(async (ingredient: any, index: number) => {
        console.log(ingredient, index);

        await conn.query(
          'INSERT INTO recipe_ingredient (uid,recipe_uid,name, sort) VALUES (?,?,?,?)',
          [uuidv4(), uidRecipe, ingredient, index]
        );
      });
      result?.steps?.forEach(async (step: any, index: number) => {
        await conn.query('INSERT INTO recipe_steps (uid, recipe_uid, name,sort) VALUES (?,?,?,?)', [
          uuidv4(),
          uidRecipe,
          step,
          index,
        ]);
      });
    }

    files.forEach(async (img) => {
      await conn.query('INSERT INTO recipe_image (uid,recipe_uid,image_url) VALUES (?,?,?)', [
        uuidv4(),
        uidRecipe,
        img.filename,
      ]);
    });
    return res.json({
      resp: true,
      message: 'Recipe created success',
    });
  } catch (err) {
    return res.status(500).json({
      resp: false,
      message: err,
    });
  }
};

export const getAllRecipe = async (req: Request, res: Response): Promise<Response> => {
  try {
    const conn = await connect();

    const postdb = await conn.query<RowDataPacket[]>(`CALL 	SP_GET_ALL_RECIPE_HOME(?);`, [
      req.idPerson,
    ]);

    const imagesdb = postdb[0][0].testing;

    await conn.end();
    // console.log(postdb[0][0]);

    return res.json({
      resp: true,
      message: 'Get All recipes',
      recipes: postdb[0][0],
      imagesdb,
    });
  } catch (err) {
    return res.status(500).json({
      resp: false,
      message: err,
    });
  }
};

export const getAllRecipeschedule = async (req: Request, res: Response): Promise<Response> => {
  try {
    const conn = await connect();

    const postdb = await conn.query<RowDataPacket[]>(`CALL SP_GET_ALL_RECIPE_SCHEDULE(?);`, [
      req.idPerson,
    ]);

    const imagesdb = postdb[0][0].testing;

    await conn.end();

    return res.json({
      resp: true,
      message: 'Get all recipe schedule',
      recipes: postdb[0][0],
      imagesdb,
    });
  } catch (err) {
    return res.status(500).json({
      resp: false,
      message: err,
    });
  }
};

export const getDetailRecipeById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const conn = await connect();
    const { id } = req.params;
    const postdb = await conn.query<RowDataPacket[]>(`CALL SP_GET_RECIPE_BY_ID(?);`, [id]);

    await conn.end();
    // console.log(postdb)
    console.log({
      resp: true,
      message: 'Get detail recipes',
      recipes: postdb[0][0],
      images: postdb[0][1],
      ingredients: postdb[0][2],
      steps: postdb[0][3],
    });
    return res.json({
      resp: true,
      message: 'Get detail recipes',
      recipes: postdb[0][0],
      images: postdb[0][1],
      ingredients: postdb[0][2],
      steps: postdb[0][3],
    });
  } catch (err) {
    return res.status(500).json({
      resp: false,
      message: err,
    });
  }
};
export const getMemberRecipeById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const conn = await connect();
    const { id } = req.params;
    const postdb = await conn.query<RowDataPacket[]>(`CALL SP_GET_MEMBERS_RECIPE(?);`, [id]);

    const imagesdb = postdb[0][0].testing;

    await conn.end();
    // console.log(postdb)
    // console.log({
    //   resp: true,
    //   message: 'Get member recipe',
    //   recipeMembers: postdb[0][0],
    //   imagesdb,
    // });
    return res.json({
      resp: true,
      message: 'Get members recipe',
      recipeMembers: postdb[0][0],
      imagesdb,
    });
  } catch (err) {
    return res.status(500).json({
      resp: false,
      message: err,
    });
  }
};
export const getDetailExtraRecipeById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const conn = await connect();
    const { id } = req.params;

    console.log(id, req.idPerson);

    const postdb = await conn.query<RowDataPacket[]>(`CALL SP_GET_DETAIL_RECIPE_SCHEDULE(?,?);`, [
      id,
      req.idPerson,
    ]);

    const imagesdb = postdb[0][0].testing;

    await conn.end();
    console.log(postdb);
    console.log({
      resp: true,
      message: 'Get detail recipes',
      recipes: postdb[0][0],
      images: postdb[0][1],
      recipeRecommends: postdb[0][2],
      recipeMembers: postdb[0][3],
      imagesdb,
    });
    return res.json({
      resp: true,
      message: 'Get detail recipes',
      recipes: postdb[0][0],
      images: postdb[0][1],
      recipeRecommends: postdb[0][2],
      recipeMembers: postdb[0][3],
      imagesdb,
    });
  } catch (err) {
    return res.status(500).json({
      resp: false,
      message: err,
    });
  }
};

export const getRecipeByIdPerson = async (req: Request, res: Response): Promise<Response> => {
  try {
    const conn = await connect();

    const postdb = await conn.query<RowDataPacket[]>(`CALL SP_GET_POST_BY_ID_PERSON(?);`, [
      req.idPerson,
    ]);

    conn.end();

    return res.json({
      resp: true,
      message: 'Get Posts by IdPerson',
      post: postdb[0][0],
    });
  } catch (err) {
    return res.status(500).json({
      resp: false,
      message: err,
    });
  }
};

export const saveAndUnSaveRecipeByUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { recipe_uid, type }: ISaveRecipe = req.body;
    console.log(recipe_uid);
    
    const conn = await connect();

    if (type === 'save') {
      await conn.query('INSERT INTO recipe_save(uid, recipe_uid, person_uid) VALUE (?,?,?)', [
        uuidv4(),
        recipe_uid,
        req.idPerson,
      ]);
    }
    
    if (type === 'unsave') {
      await conn.query('DELETE FROM recipe_save WHERE recipe_uid = ? AND person_uid = ?', [
        recipe_uid,
        req.idPerson,
        
      ]);
    }

    conn.end();

    return res.json({
      resp: true,
      message: 'Recipe saved',
    });
  } catch (err) {
    return res.status(500).json({
      resp: false,
      message: err,
    });
  }
};
// export const joinRecipeByUser = async (req: Request, res: Response): Promise<Response> => {

//     try {

//         const { recipe_uid,type,date_start,date_end }: IJoinRecipe = req.body;

//         const conn = await connect();

//         const checkMatch = await conn.query<RowDataPacket[]>(
//           'CALL SP_CHECK_DUPLICATE_RECIPE(?,?,?)',
//           [req.idPerson, date_start, date_end]
//         )
//         console.log(checkMatch[0])
//         console.log(checkMatch[0][0])
//         console.log(checkMatch[0][1])

//         if (
//           checkMatch[0][0]?.countRecipeCreated !== 0 &&
//           checkMatch[0][1]?.countRecipeJoined
//         ) {
//           conn.end()
//           return res.status(500).json({
//             resp: false,
//             message: 'Lỗi đã trùng với chuyến đi khác.',
//           })
//         } else {
//           if (type === 'join') {
//             await conn.query(
//               'INSERT INTO recipe_members(uid, recipe_uid, person_uid) VALUE (?,?,?)',
//               [uuidv4(), recipe_uid, req.idPerson]
//             )
//           }

//           if (type === 'cancel') {
//             await conn.query(
//               ' DELETE FROM recipe_members WHERE recipe_uid = ? AND person_uid = ?',
//               [recipe_uid, req.idPerson]
//             )
//           }
//            conn.end()

//            return res.json({
//              resp: true,
//              message: 'Joined Recipe',
//            })
//         }

//     } catch(err) {
//         return res.status(500).json({
//             resp: false,
//             message: err
//         });
//     }

// }

export const addRateRecipe = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { recipe_uid, recipe_comment, recipe_rate, recipe_member_uid }: ICommentRecipe = req.body;

    const conn = await connect();

    await conn.query(
      'UPDATE recipe_members SET recipe_comment = ?, recipe_rate = ? WHERE uid = ? AND recipe_uid = ? AND person_uid = ? ',
      [recipe_comment, recipe_rate, recipe_member_uid, recipe_uid, req.idPerson]
    );

    conn.end();

    return res.json({
      resp: true,
      message: 'Joined Recipe',
    });
  } catch (err) {
    return res.status(500).json({
      resp: false,
      message: err,
    });
  }
};

// export const addRoleForUserOfRecipe = async (
//   req: Request,
//   res: Response
// ): Promise<Response> => {
//   try {
//     const { recipe_uid, role, recipe_member_uid }: IRoleRecipe =
//       req.body
//       console.log(req.body);

//     const conn = await connect()

//     await conn.query(
//       'UPDATE recipe_members SET recipe_role = ? WHERE uid = ?',
//       [role,recipe_member_uid]
//     )

//     conn.end()

//     return res.json({
//       resp: true,
//       message: 'Added role Recipe',
//     })
//   } catch (err) {
//     return res.status(500).json({
//       resp: false,
//       message: err,
//     })
//   }
// }

export const getListSavedRecipesByUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const conn = await connect();

    const listSavedPost = await conn.query<RowDataPacket[]>(
      `CALL SP_GET_LIST_POST_SAVED_BY_USER(?);`,
      [req.idPerson]
    );

    conn.end();

    return res.json({
      resp: true,
      message: 'List Saved Post',
      listSavedPost: listSavedPost[0][0],
    });
  } catch (err) {
    return res.status(500).json({
      resp: false,
      message: err,
    });
  }
};

export const getAllRecipesForSearch = async (req: Request, res: Response): Promise<Response> => {
  try {
    const conn = await connect();

    const postsdb = await conn.query<RowDataPacket[]>(`CALL SP_GET_ALL_POSTS_FOR_SEARCH(?);`, [
      req.idPerson,
    ]);

    conn.end();

    return res.json({
      resp: true,
      message: 'Get All Post For Search',
      posts: postsdb[0][0],
    });
  } catch (err) {
    return res.status(500).json({
      resp: false,
      message: err,
    });
  }
};

export const likeOrUnLikeRecipe = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { recipe_uid, type }: ILikeRecipe = req.body;
    const conn = await connect();

    if (type === 'like') {
      await conn.query('INSERT INTO recipe_wishlist(uid, recipe_uid, person_uid) VALUE (?,?,?)', [
        uuidv4(),
        recipe_uid,
        req.idPerson,
      ]);
    }
    if (type === 'unlike') {
      await conn.query('DELETE FROM recipe_wishlist WHERE recipe_uid = ? AND person_uid = ?', [
        recipe_uid,
        req.idPerson,
      ]);
    }

    conn.end();

    return res.json({
      resp: true,
      message: 'Recipe Liked',
    });
  } catch (err) {
    return res.status(500).json({
      resp: false,
      message: err,
    });
  }

  // try {

  //     const { recipe_uid, person_uid }: ILikePost = req.body;

  //     const conn = await connect();

  //     const isLikedb = await conn.query<RowDataPacket[]>('SELECT COUNT(uid) AS uid FROM recipe_wishlist WHERE person_uid = ? AND recipe_uid = ? LIMIT 1', [ req.idPerson, recipe_uid ]);

  //     if( isLikedb[0][0].uid > 0 ){

  //         await conn.query('DELETE FROM recipe_wishlist WHERE person_uid  = ? AND recipe_uid = ?', [ req.idPerson, recipe_uid ]);

  //         await conn.query('DELETE FROM notifications WHERE type_notification = 2 AND person_uid = ? AND recipe_uid = ?', [ person_uid, recipe_uid ]);

  //         conn.end();

  //         return res.json({
  //             resp: true,
  //             message: 'unlike',
  //         });

  //     }

  //     await conn.query('INSERT INTO recipe_wishlist (uid, person_uid, recipe_uid) VALUE (?,?,?)', [ uuidv4(), req.idPerson, recipe_uid ]);

  //     await conn.query('INSERT INTO notifications (uid_notification, type_notification, person_uid, followers_uid, recipe_uid) VALUE (?,?,?,?,?)', [uuidv4(), 2, person_uid, req.idPerson, recipe_uid ]);

  //     conn.end();

  //     return res.json({
  //         resp: true,
  //         message: 'like',
  //     });

  // } catch(err) {
  //     return res.status(500).json({
  //         resp: false,
  //         message: err
  //     });
  // }
};

export const getCommentsByIdRecipe = async (req: Request, res: Response): Promise<Response> => {
  try {
    const conn = await connect();

    const commentsdb = await conn.query<RowDataPacket[]>(`CALL SP_GET_COMMNETS_BY_UIDPOST(?);`, [
      req.params.uidPost,
    ]);

    conn.end();

    return res.json({
      resp: true,
      message: 'Get Commets',
      comments: commentsdb[0][0],
    });
  } catch (err) {
    return res.status(500).json({
      resp: false,
      message: err,
    });
  }
};

export const addNewComment = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { uidPost, comment }: INewComment = req.body;

    const conn = await connect();

    await conn.query('INSERT INTO comments (uid, comment, person_uid, post_uid) VALUE (?,?,?,?)', [
      uuidv4(),
      comment,
      req.idPerson,
      uidPost,
    ]);

    conn.end();

    return res.json({
      resp: true,
      message: 'New comment',
    });
  } catch (err) {
    return res.status(500).json({
      resp: false,
      message: err,
    });
  }
};

export const likeOrUnLikeComment = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { uidComment }: IUidComment = req.body;

    const conn = await connect();

    const isLikedb = await conn.query<RowDataPacket[]>(
      'SELECT is_like FROM comments WHERE uid = ? LIMIT 1',
      [uidComment]
    );

    if (isLikedb[0][0].is_like > 0) {
      await conn.query('UPDATE comments SET is_like = ? WHERE uid = ?', [0, uidComment]);

      conn.end();

      return res.json({
        resp: true,
        message: 'unlike comment',
      });
    }

    await conn.query('UPDATE comments SET is_like = ? WHERE uid = ?', [1, uidComment]);

    conn.end();

    return res.json({
      resp: true,
      message: 'like comment',
    });
  } catch (err) {
    return res.status(500).json({
      resp: false,
      message: err,
    });
  }
};

export const getAllRecipeByUserID = async (req: Request, res: Response): Promise<Response> => {
  try {
    const conn = await connect();

    const postsdb = await conn.query<RowDataPacket[]>(`CALL SP_GET_ALL_POST_BY_USER(?);`, [
      req.idPerson,
    ]);

    conn.end();

    return res.json({
      resp: true,
      message: 'Posts By User ID',
      postUser: postsdb[0][0],
    });
  } catch (err) {
    return res.status(500).json({
      resp: false,
      message: err,
    });
  }
};

export const InsertListChatRecipe = async (uidSource: string, uidTarget: string) => {
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

export const updateLastMessageRecipe = async (
  uidTarget: string,
  uidPerson: string,
  message: string
) => {
  const conn = await connect();

  const update = new Date().toISOString().slice(0, 19).replace('T', ' ');

  await conn.query(
    'UPDATE list_chats SET last_message = ?, updated_at = ? WHERE source_uid = ? AND target_uid = ?',
    [message, update, uidPerson, uidTarget]
  );

  conn.end();
};

export const addNewMessageRecipe = async (
  uidSource: string,
  uidTargetRecipe: string,
  message: string
) => {
  const conn = await connect();
  await conn.query(
    'INSERT INTO recipe_messages (uid_message_recipe, soure_uid, target_recipe_uid, message) VALUE (?,?,?,?)',
    [uuidv4(), uidSource, uidTargetRecipe, message]
  );

  conn.end();
};

export const getAllMessagesById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const conn = await connect();

    const messagesdb = await conn.query<RowDataPacket[]>(`CALL SP_ALL_MESSAGE_RECIPE_BY_ID(?);`, [
      req.params.id,
    ]);

    conn.end();

    return res.json({
      resp: true,
      message: 'get all messages by recipe id',
      listMessage: messagesdb[0][0],
    });
  } catch (err) {
    return res.status(500).json({
      resp: false,
      message: err,
    });
  }
};
