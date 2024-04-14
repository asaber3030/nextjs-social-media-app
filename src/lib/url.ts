export const urls: any = {
  profile: (username: string) => `/profile/${username}`,
  followings: (username: string) => `/profile/${username}/followings`,
  followers: (username: string) => `/profile/${username}/followers`,
  editProfile: (username: string) => `/profile/${username}/edit-profile`,
  editPicture: (username: string) => `/profile/${username}/edit-picture`,
  settings: (username: string) => `/profile/${username}/settings`,
  archive: (username: string) => `/profile/${username}?tab=archive`,
  viewPost: (id: number) => `/posts/${id}`,
  login: () => `/login`,
  register: () => `/register`,
  notifications: () => `/notifications`,
  sessions: () => `/sessions`,
}

export const route = (key: string, param?: string | number) => {
  return urls[key](param)
}