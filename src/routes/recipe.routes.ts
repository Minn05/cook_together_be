import { Router } from 'express';
import { verifyToken } from '../middleware/verify_token';
import * as recipe from '../controllers/recipes_controller';
import { uploadsRecipe } from '../lib/multer';


const router = Router();

    router.post('/recipe/create-new-recipe', [ verifyToken, uploadsRecipe.array('imageRecipes') ], recipe.createNewRecipe);
    router.get('/recipe/get-all-recipes',verifyToken ,recipe.getAllRecipe)
    router.get('/recipe/get-recipes-schedule',verifyToken ,recipe.getAllRecipeschedule)
    router.get(
      '/recipe/get-recipe-by-id/:id',
      verifyToken,
      recipe.getDetailRecipeById
    )
    router.get(
      '/recipe/get-members-recipe-by-id/:id',
      verifyToken,
      recipe.getMemberRecipeById
    )
    router.get(
      '/recipe/get-recipe-by-id-extra/:id',
      verifyToken,
      recipe.getDetailExtraRecipeById
    )
    router.get(
      '/recipe/get-recipe-by-idPerson',
      verifyToken,
      recipe.getRecipeByIdPerson
    ) 
    // router.post('/recipe/join-recipe', verifyToken, recipe.joinRecipeByUser) 
    router.post('/recipe/save-recipe', verifyToken, recipe.saveAndUnSaveRecipeByUser) 
    // router.post('/recipe/add-role-user', verifyToken, recipe.addRoleForUserOfRecipe)
    router.post('/recipe/rate-recipe', verifyToken, recipe.addRateRecipe)
    router.get(
      '/recipe/get-list-saved-recipes',
      verifyToken,
      recipe.getListSavedRecipesByUser
    ) 
    router.get(
      '/recipe/get-all-recipes-for-search',
      verifyToken,
      recipe.getAllRecipesForSearch
    )
    router.post('/recipe/like-or-unlike-recipe', verifyToken, recipe.likeOrUnLikeRecipe)
    router.get(
      '/recipe/get-comments-by-idrecipe/:uidRecipe',
      verifyToken,
      recipe.getCommentsByIdRecipe
    )
    router.post('/recipe/add-new-comment', verifyToken, recipe.addNewComment)
    router.put(
      '/recipe/like-or-unlike-comment',
      verifyToken,
      recipe.likeOrUnLikeComment
    )
    router.get(
      '/recipe/get-all-recipe-by-user-id',
      verifyToken,
      recipe.getAllRecipeByUserID
    )
     router.get(
       '/recipe/get-all-message-recipe-by-id/:id',
       verifyToken,
       recipe.getAllMessagesById
     )


export default router;
