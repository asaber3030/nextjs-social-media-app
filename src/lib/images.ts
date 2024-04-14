export const pictures: Record<string, string> = {
  private: '/defaults/private.svg',
  user: '/defaults/user-svg.svg',
  userPng: '/defaults/user.png',
  me: '/defaults/me3.jpg',
  empty: '/defaults/empty.svg',
  logo: '/logo.png',
  logoWhite: '/logo-white.png',
  error404: '/defaults/error404.svg',
}

export function picture(image: string): string {
  return pictures[image]
}