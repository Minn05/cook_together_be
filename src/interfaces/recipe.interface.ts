export interface INewRecipe {
  // uid	title	description	category	totalPeople	time	calories	person_uid	
  title: string
  description: string
  category: string
  totalPeople: number
  time: number
  calories: number
  // recipe_uid	name	unit	
  steps: string
  ingreditents: string

}

// INSERT INTO `recipe_schedule`(`uid`, `recipe_uid`, `lat`, `lng`, `address_short`, `address_detail`, `isGasStation`, `isRepairMotobike`) VALUES ('[value-1]','[value-2]','[value-3]','[value-4]','[value-5]','[value-6]','[value-7]','[value-8]')
export interface RecipeSchedule {
  uid: string
  recipe_uid: string
  lat: number
  lng: number
  address_short: string
  address_detail: string
  isGasStation: boolean
  isRepairMotobike: boolean
}

export interface IMemberRecipe {
  recipe_uid: string
  person_uid: string
  recipe_role: 'member' | 'pho_nhom' | 'thu_quy'
  recipe_rate?: number
  recipe_comment?: string
}
export interface ISaveRecipe {
  recipe_uid: string
  type: 'save' | 'unsave'
}

export interface ILikeRecipe{
  recipe_uid: string
  // person_uid: string
  type: 'like' | 'unlike'
}

export interface IRecommendRecipe {
 recipe_uid: string
 recipe_point: string
 recipe_des_point: string
}

export interface IJoinRecipe {
 recipe_uid: string
 type: 'cancel' | 'join'
 date_start?: Date
 date_end?: Date
}
export interface ICommentRecipe {
  recipe_member_uid: string
  recipe_uid: string
  recipe_rate: number
  recipe_comment: string
}
export interface IRoleRecipe {
  role: 'member' | 'pho_nhom' | 'thu_quy'
  recipe_uid: string
  recipe_member_uid:  string
}