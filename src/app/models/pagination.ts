import { IProduct } from "./product"


export interface Pagination {
    pageNumber: number
    pageSize: number
    totalCount: number
    totalPages: number
    data: IProduct[]
}