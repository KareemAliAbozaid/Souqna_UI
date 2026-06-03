import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    // Use server rendering for all routes at runtime.
    // This avoids prerendering parameterized routes like `products/:id/edit`
    // which would otherwise require getPrerenderParams.
    path: '**',
    renderMode: RenderMode.Server
  }
];

