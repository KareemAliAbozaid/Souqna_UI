export interface ProductFormModel {
  name: string;
  description: string;
  newPrice: number;
  oldPrice: number;
  categoryId: number;
  photos: File[];
}
