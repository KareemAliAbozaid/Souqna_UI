export function buildAssetUrl(baseUrl: string, path: string): string {
  if (!path) {
    return '';
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const normalized = path.startsWith('/') ? path : `/${path}`;
  const encoded = normalized
    .split('/')
    .map((segment, index) => {
      if (segment === '' && index === 0) {
        return '';
      }
      return encodeURIComponent(segment);
    })
    .join('/');

  return `${baseUrl}${encoded}`;
}
