
export interface INewPost {
  description: string
  user_uid: string
  type_privacy: string
}

export interface ISavePost {
    post_uid: string
}
export interface IUnSavePost {
  post_save_ui: string
}

export interface ILikePost {
    recipe_uid: string,
    person_uid: string
}

export interface INewComment {
  uidRecipe: string,
    comment: string
}

export interface IUidComment {
    uidComment: string
}