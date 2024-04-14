import { getMyPosts } from "@/actions/post"
import { getFollowersByUsername, getFollowingsByUsername, getNotifications, getSavedPosts, getUserByUsername, getUserUploads, userLoggedData } from "@/actions/user"

import UserItemsProvider from "@/providers/user-items"

interface ProfileLayoutProps {
  children: React.ReactNode,
  params: {
    username: string
  }
}

const ProfileLayout = async ({ children, params }: ProfileLayoutProps) => {

  const { username } = params

  const current = await userLoggedData()
  const user = (await getUserByUsername(username)).user
  const followers = (await getFollowersByUsername(username)).followers
  const followings = (await getFollowingsByUsername(username)).followings
  const notifications = (await getNotifications()).notifications
  const savedPosts = (await getSavedPosts()).posts
  const archivedPosts = (await getMyPosts(user?.id as number, false, true)).data
  const trashedPosts = (await getMyPosts(user?.id as number, true, false)).data
  const posts = (await getMyPosts(user?.id as number)).data
  const uploads = await getUserUploads()
  const followersNumber = followers?.length
  const followingsNumber = followings?.length
  const postsNumber = posts?.length

  const value = {
    current,
    user,
    followers,
    followings,
    notifications,
    followersNumber,
    followingsNumber,
    uploads,
    postsNumber,
    posts,
    savedPosts,
    archivedPosts,
    trashedPosts
  }

  return (
    <UserItemsProvider value={value}>
      {children}
    </UserItemsProvider>
  );
}
 
export default ProfileLayout;