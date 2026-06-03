import { IProduct } from '../../models/product';
import { buildAssetUrl } from './asset-url';

export function getProductImageUrls(product: IProduct, assetsBaseURL: string): string[] {
  return (product.photos ?? [])
    .map((photo) => photo.imageName)
    .filter((imageName): imageName is string => !!imageName)
    .map((imageName) => buildAssetUrl(assetsBaseURL, imageName));
}
