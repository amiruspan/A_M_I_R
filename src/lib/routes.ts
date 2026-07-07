export type AppPage = 'explore' | 'publish' | 'shop' | 'profile' | 'settings';

export const pagePaths: Record<AppPage, string> = {
  explore: '/app',
  publish: '/create',
  shop: '/shop',
  profile: '/profile',
  settings: '/settings',
};

export function readPageFromPath(pathname: string): AppPage {
  if (pathname === pagePaths.publish) return 'publish';
  if (pathname === pagePaths.shop) return 'shop';
  if (pathname === pagePaths.profile) return 'profile';
  if (pathname === pagePaths.settings) return 'settings';
  return 'explore';
}

export function getPathForPage(page: AppPage) {
  return pagePaths[page];
}

export function isKnownAppPath(pathname: string) {
  return pathname === '/' || Object.values(pagePaths).includes(pathname);
}
