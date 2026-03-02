import { IPhoto } from "./photo"

export interface IProduct {
    id: number
    name: string
    description: any
    newPrice: number
    oldPrice: number
    categoryName: string
    photos: IPhoto[]
}