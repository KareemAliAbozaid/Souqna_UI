import { IPhoto } from "./photo"

export interface IProduct {
    id: number;
    name: string;
    description: string | null;
    /**
     * Some endpoints return `price`, others return `newPrice`.
     */
    price?: number;
    newPrice: number;
    oldPrice: number;
    categoryName: string;
    categoryId?: number;
    stock?: number;
    photos: IPhoto[];
}
