"use server";

import * as zod from 'zod'
import prisma from "@/lib/db";
import bcrypt from 'bcryptjs'

import { cookies } from "next/headers";
import { CreateCollectionValidator, EditPasswordValidator, EditProfileValidator, UpdateCollectionValidator } from '@/schema/auth';
import { route } from '@/lib';
import { redirect } from 'next/navigation';
import { Send, now } from '@/lib/utils';
import moment from 'moment';
import { Following } from '@/types';

const userSelector = { website: true, bio: true, email: true, createdAt: true, id: true, gender: true, name: true, picture: true, private: true, username: true, updatedAt: true }

// Check
export async function userLogged() {
  const cookiesClient = cookies()
  const token = cookiesClient.get('social_token')?.value as string
  const session = await prisma.session.findFirst({
    where: { token }
  })

  if (session) {
    const user = await prisma.user.findUnique({
      where: { id: session.userId as number },
      select: userSelector
    })
    if (user) { return true }
    else { return false }
  } else {
    return false
  }
}
export async function userLoggedData() {
  const cookiesClient = cookies()
  const token = cookiesClient.get('social_token')?.value as string
  const session = await prisma.session.findFirst({
    where: { token }
  })

  if (session) {
    const user = await prisma.user.findUnique({
      where: { id: session.userId as number },
      select: userSelector
    })
    if (user) { return user }
    else { return null }
  } else {
    return null
  }
}

export async function unauthorized() {
  const isLogged = await userLogged()
  if (!isLogged) {
    throw new Error("Unauthorized!")
  }
}

// Fetch
export async function getUser() {
  const cookiesClient = cookies()
  const token = cookiesClient.get('social_token')?.value as string
  const session = await prisma.session.findFirst({
    where: { token }
  })

  if (session) {
    const user = await prisma.user.findUnique({
      where: { id: session.userId as number },
      select: userSelector
    })
    return {
      user,
      message: 'User found!',
      status: 200
    }
  } else {
    return {
      user: null,
      message: 'Session not found!',
      status: 404
    }
  }
}

export async function getSession() {
  const cookiesClient = cookies()
  const token = cookiesClient.get('social_token')?.value as string
  const session = await prisma.session.findFirst({
    where: { token }
  })
  if (session) {
    return {
      session,
      status: 200
    }
  } else {
    return {
      session: null,
      status: 404
    }
  }
}

export async function getSessions() {
  const user = await userLoggedData()
  const sessions = await prisma.session.findMany({ where: { userId: user?.id } })

  console.log(user)

  return Send.response(Send.codes.found, "Sessions available", sessions)
}

export async function getUsers() {
  const userData = await userLoggedData()
  const users = await prisma.user.findMany({ where: { id: { not: userData?.id as number } } })
  return {
    users,
    message: 'User found!',
    status: 200
  }
}

export async function getUsersPagination(filter: (string | null | undefined), page: number, limit: number = 10) {
  const current = await userLoggedData();
  const skip = ((page - 1) * limit) ?? 0;
  const users = await prisma.user.findMany({
    where: {
      AND: [
        { id: { not: current?.id } }
      ],
      OR: [
        { username: { contains: filter ?? '' } },
        { name: { contains: filter ?? '' } }
      ]
    },
    orderBy: {
      username: 'asc'
    },
    take: limit,
    skip
  })
  return {
    users,
    skip,
    page,
    filter,
    nextPage: page + 1
  }
}

export async function getUserFeed(page: number, limit: number = 10) {

  await unauthorized()

  const current = await userLoggedData();
  const skip = ((page - 1) * limit) ?? 0;
  const { followings  } = await getFollowingsByUsername(current?.username as string)

  const followingsIds = followings?.map((item: Following) => item.followingId)

  const posts = await prisma.post.findMany({
    where: {
      userId: { in: followingsIds }
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: { 
      attachments: true,
      user: true,
      likes: true, 
      comments: { 
        include: {
          _count: { select: { likes: true } },
          user: true,
          likes: true,
          replies: { include: { user: true }, orderBy: { id: 'desc' } }, 
        }, 
        orderBy: { id: 'desc' } 
      }, 
      saved: true,
      shared: true,
      _count: {
        select: { likes: true, comments: true, saved: true, shared: true }
      } 
    },
    take: limit,
    skip
  })
  return {
    posts,
    followingsIds,
    skip,
    page,
    nextPage: page + 1
  }
}

export async function getUserByUsername(username: string) {
  const user = await prisma.user.findUnique({
    where: { username: username },
    select: userSelector
  })
  return {
    user,
    message: 'User found!',
    status: 200
  }
}

export async function getUserByEmail(email: string) {
  const user = await prisma.user.findFirst({
    where: { email: email },
    select: { bio: true, email: true, createdAt: true, id: true, gender: true, name: true, picture: true, private: true, username: true, updatedAt: true },
  })
  return {
    user,
    message: 'User found!',
    status: 200
  }
}

export async function getUserUploads() {
  const isLogged = await userLogged()
  if (isLogged) {
    const user = await userLoggedData()
    const uploads = await prisma.userUploads.findMany({ where: { userId: user?.id } })
    return uploads
  } else {
    return null
  }
}

export async function getFollowersByUsername(username: string) {
  const isLogged = await userLogged()
  const current = await userLoggedData()
  if (isLogged) {
    const followers = await prisma.followers.findMany({ 
      where: { user: { username } },
      include: { follower: true },
      orderBy: { createdAt: 'asc' }
    })
    return {
      message: 'Followers found!',
      status: 200,
      followers
    }
  }
  return {
    message: 'Not authorized',
    status: 403
  }
}

export async function getFollowingsByUsername(username: string) {
  const isLogged = await userLogged()
  if (isLogged) {
    const followings = await prisma.followings.findMany({ 
      where: { user: { username } },
      include: { following: true },
      orderBy: { createdAt: 'asc' }
    })
    return {
      message: 'Followings found!',
      status: 200,
      followings
    }
  }
  return {
    message: 'Not authorized',
    status: 403
  }
}

export async function isFollowing(userId: number, follower: number) {
  const findFollowing = await prisma.followings.findFirst({ 
    where: { userId: follower, followingId: userId }, 
    include: { following: true } 
  })
  if (findFollowing) return true;
  return false
}

export async function isFollowingData(userId: number, follower: number) {
  const findFollowing = await prisma.followings.findFirst({ 
    where: { userId: follower, followingId: userId }, 
    include: { following: true } 
  })
  if (findFollowing) {
    return {
      isFollowing: true,
      data: findFollowing,
      follower,
      userId
    }
  };
  return {
    isFollowing: false,
    data: null,
    follower,
    userId
  }
}

export async function getNotifications() {
  const user = await userLoggedData()
  const userId = user?.id

  if (user) {

    const notifications = await prisma.notification.findMany({ where: { userId }, orderBy: { id: 'desc' } })

    return {
      notifications,
      message: 'Notifications found!',
      status: 200
    }
  }
  return {
    message: 'Not Authorized',
    status: 403
  }
}

export async function getSavedPosts() {
  const user = await userLoggedData()
  const userId = user?.id

  if (user) {
    const posts = await prisma.savedPost.findMany({
       where: { userId, post: { archived: false, trashed: false, } }, 
       include: { 
        post: { 
          include: { 
            attachments: true,
            likes: true, 
            user: true,
            comments: { 
              include: {
                _count: { select: { likes: true } },
                user: true,
                likes: true,
                replies: { include: { user: true }, orderBy: { id: 'desc' } }, 
              }, 
              orderBy: { id: 'desc' } 
            }, 
            saved: true,
            shared: true,
            _count: {
              select: { likes: true, comments: true, saved: true, shared: true }
            } 
          } 
        },
        user: true,
      },
       orderBy: { id: 'desc' }
    })
    return {
      posts,
      message: 'Notifications found!',
      status: 200
    }
  }
  return {
    message: 'Not Authorized',
    status: 403
  }
}

export async function getActivity() {
  const current = await userLoggedData()
  if (!current) {
    return Send.response(Send.codes.unauthorized, "Unauthorized")
  }
  const activities = await prisma.activity.findMany({ where: { userId: current.id }, orderBy: { id: 'desc' } })
  return Send.response(Send.codes.found, "Activities Found", activities)
}

export async function checkRelationship(firstUser: number, secondUser: number) {
  const findFollower1 = await prisma.followers.findFirst({ where: { followerId: firstUser, userId: secondUser } })
  const findFollower2 = await prisma.followers.findFirst({ where: { followerId: secondUser, userId: firstUser } })

  const findFollowing1 = await prisma.followings.findFirst({ where: { followingId: firstUser, userId: secondUser } })
  const findFollowing2 = await prisma.followings.findFirst({ where: { followingId: secondUser, userId: firstUser } })

  if (findFollower1 && findFollower2 && findFollowing1 && findFollowing2) return true

  return false
}

// Update
export async function update(values: zod.infer<typeof EditProfileValidator>, id: number) {
  
  const isLogged = await userLogged()
  const current = await userLoggedData()

  if (isLogged) {
    const findByUsername = await prisma.user.findFirst({
      where: { 
        username: values.username,
        id: { not: current?.id }
      },
    })
    await addActivity(`Personal Information has been updated at ${now()}`, route('settings', current?.username))
    if (findByUsername) {
      return Send.response(Send.codes.found, "Username exists!")
    }

    const user = await prisma.user.update({
      where: { id: id },
      data: {
        username: values.username,
        name: values.name,
        email: values.email,
        bio: values.bio,
        gender: values.gender,
        website: values.website,
      }
    })
    return {
      message: "User updated successfully!",
      user,
      values
    }
  } else {
    return {
      message: 'Not Authorized',
      status: 403,
    }
  }
}

export async function changePictureFromExistingFile(picture: string, id: number) {
  const isLogged = await userLogged()
  const current = await userLoggedData()
  if (isLogged) {
    const user = await prisma.user.update({
      where: { id: id },
      data: {
        picture,
      }
    })
    await addActivity(`Profile picture changed at ${now()}`, route('settings', current?.username))
    await notify(current?.id as number, `Profile picture!`, `New profile picture has been added in your account`, route('editPicture', current?.username))
    return {
      message: "Profile picture updated successfully!",
      user,
    }
  } else {
    return {
      message: 'Not Authorized',
      status: 403,
    }
  }
}

export async function changePrivacy(value: boolean) {
  const isLogged = await userLogged()
  const current = await userLoggedData()
  if (isLogged) {
    const user = await prisma.user.update({
      where: { id: current?.id },
      data: {
        private: value,
      }
    })
    await addActivity(`You have changed your account privacy to ${value ? 'private' : 'public'} at ${now()}`, route('settings', current?.username))
    await notify(current?.id as number, `Account privacy`, `Your account has been changed to ${value ? 'private' : 'public'}`, route('settings', current?.username))
    return {
      status: 200,
      message: value ? `Account has been changed to private` : 'Account has been made public!',
    }
  } else {
    return {
      message: 'Not Authorized',
      status: 403,
    }
  }
}

export async function changePassword(values: zod.infer<typeof EditPasswordValidator>) {
  const isLogged = await userLogged()
  const current = await userLoggedData()

  if (isLogged) {

    const currentPassword = values.password
    const allUser = await prisma.user.findUnique({ where: { id: current?.id }, select: { password: true } })
    const comparePasswords = await bcrypt.compare(currentPassword, allUser?.password as string)

    if (comparePasswords) {
      const hashedNewPassword = await bcrypt.hash(values.newPassword, 10)
      await prisma.user.update({
        where: { id: current?.id },
        data: { password: hashedNewPassword }
      })
      await addActivity(`You have changed your password at ${now()}`, route('settings', current?.username))
      await notify(current?.id as number, `Your password has been changed successfully`, `Your password has been changed and you can logout from all devices!`, route('settings', current?.username))
      return {
        status: 200,
        message: 'Password has been updated!',
      }
    } else {
      return {
        status: 403,
        message: 'Incorrect password please try again!',
      }
    }
  } else {
    return {
      message: 'Not Authorized',
      status: 403,
    }
  }
}

export async function deleteNotification(id: number) {
  const isLogged = await userLogged()

  if (isLogged) {
    const notification = await prisma.notification.delete({
      where: { id },
    })
    await addActivity(`You have deleted a notification: "${notification.title}" at ${now()}`, route('notifications'))
    return {
      message: 'Notification has been deleted',
      status: 200,
    }
  }

  return {
    message: 'Not Authorized',
    status: 403,
    notification: null
  }
}

export async function deleteAllNotification(userId: number) {
  const isLogged = await userLogged()

  if (isLogged) {
    await prisma.notification.deleteMany({
      where: { userId },
    })
    await addActivity(`You have deleted all notifications at ${now()}`, route('notifications'))
    return {
      message: 'All Notifications has been deleted!',
      status: 200,
    }
  }

  return {
    message: 'Not Authorized',
    status: 403,
  }
}

export async function changeNotification(id: number, status: boolean) {
  const isLogged = await userLogged()

  if (isLogged) {
    const notification = await prisma.notification.update({
      where: { id },
      data: { isRead: status }
    })
    await addActivity(`You have update notification: "${notification.title}" to ${status == true ? 'read' : 'unread'} at ${now()}`, route('notifications'))
  
    return {
      message: status ? 'Marked as read' : 'Marked as unread',
      status: 200,
      notification
    }
  }

  return {
    message: 'Not Authorized',
    status: 403,
    notification: null
  }
}

export async function changeAllNotification(userId: number, status: boolean) {
  const isLogged = await userLogged()
  await addActivity(`You have changed all notifications to ${status == true ? 'read' : 'unread'} at ${now()}`, route('notifications'))

  if (isLogged) {
    await prisma.notification.updateMany({
      where: { userId },
      data: { isRead: status }
    })
    return {
      message: status ? 'All Marked as read' : 'All Marked as unread',
      status: 200,
    }
  }

  return {
    message: 'Not Authorized',
    status: 403,
  }
}

// Add
export async function follow(userId: number, follower: number) {

  const isLogged = await userLogged()
  const current = await userLoggedData()

  const who = await prisma.user.findUnique({ where: { id: follower } })

  if (isLogged) {
    
    const isUserFollowing = await isFollowing(userId, follower)

    if (!isUserFollowing) {

      await prisma.followings.create({
        data: { userId: follower, followingId: userId }
      })

      await prisma.followers.create({
        data: { userId: userId, followerId: follower }
      })

      const followerData = await prisma.user.findUnique({ where: { id: userId } })

      await notify(
        who?.id as number, 
        `${followerData?.username} followed you!`, 
        `You have a new follower added to your list - ${followerData?.name}`, 
        route('followings', current?.username),
      )

      return {
        followedByUser: follower,
        message: 'Followed!',
        status: 201
      }
    } else {
      return {
        message: 'Followed',
        status: 403,
        isLogged
      }
    }
  } else {
    return {
      message: 'Failed to unfollow - unauthorized',
      status: 403,
      isLogged
    }
  }
  
}

// Remove
export async function unfollow(followId: number, followingId: number) {
  const isLogged = await userLogged()
  const user = await userLoggedData()
  const who = await prisma.user.findUnique({ where: { id: followingId }, select: { name: true, username: true, id: true } })

  await addActivity(`You have unfollowed ${who?.name} at ${now()}`, route('profile', who?.username))

  if (isLogged) {
    const findFollowing = await prisma.followings.findUnique({ where: { id: followId }, include: { following: true } })
    if (findFollowing?.userId === user?.id) {
      await prisma.followings.delete({ where: { id: followId } })
      await prisma.followers.deleteMany({ where: { userId: followingId, followerId: user?.id as number } })
      return {
        message: 'Unfollowed @' + findFollowing?.following.username,
        status: 200
      }
    }
  }
  return {
    message: 'Failed to unfollow - unauthorized',
    status: 403
  }
}

export async function notify(userId: number, title: string, description: string, url: string, sendToCurrent: boolean = true) {

  const user = await userLoggedData()
  
  if (!user) {
    return {
      notification: null,
      message: 'Not Authorized',
      status: 403,
    }
  }

  if (sendToCurrent) {
    const notification = await prisma.notification.create({
      data: { userId, title, description, url }
    })
    return {
      notification,
      message: 'Notification Sent',
      status: 200,
    }
  }
  
}

export async function addActivity(title: string, url: string) {
  await unauthorized();
  const user = await userLoggedData()

  const newActivity = await prisma.activity.create({
    data: { userId: user?.id as number , title, url }
  })

  if (!newActivity) Send.response(Send.codes.error, "Couldn't save activity")

  return Send.response(Send.codes.created, "Activity saved", newActivity)
}

export async function logout() {
  await addActivity("You have logged out in " + moment().format("MMMM Do YYYY, h:mm:ss a"), route('login'));
  cookies().delete('social_token')
  return redirect('/login')
}

export async function testF() {
  console.log("S")
}

// User Collections
export async function getCollections(userId: number) {
  await unauthorized();
  const collections = await prisma.userCollection.findMany({ 
    where: { userId },
    include: { items: true },
    orderBy: { id: 'desc' }
  })

  return Send.response(Send.codes.found, "User collections data", collections)
}

export async function getCollection(id: number) {
  await unauthorized();
  const user = await userLoggedData()
  const collection = await prisma.userCollection.findUnique({ 
    where: { id },
    include: { items: true },
  })
  if (user?.id !== collection?.userId) {
    return Send.response(Send.codes.notfound, "Not Found ERROR404")
  }
  return Send.response(Send.codes.found, "Collection data", collection)
}

export async function newCollection(values: zod.infer<typeof CreateCollectionValidator>) {

  await unauthorized();
  
  const user = await userLoggedData()
  const { title } = values
  
  const collection = await prisma.userCollection.create({ 
    data: { title, userId: user?.id as number }
  }) 
  
  return Send.response(Send.codes.created, "New Collection Created", collection)
}

export async function updateCollection(id: number, values: zod.infer<typeof UpdateCollectionValidator>) {
  
  await unauthorized();
  const { title, order } = values
  
  const collection = await prisma.userCollection.update({
    where: { id },
    data: { title, order }
  }) 
  
  return Send.response(Send.codes.ok, `Collection Update - #${collection.id}`, collection)
}

export async function deleteCollection(id: number) {
  
  await unauthorized();
  const user = await userLoggedData()

  const collection = await prisma.userCollection.findUnique({
    where: { id },
  }) 

  if (user?.id !== collection?.userId) {
    return Send.response(Send.codes.notfound, "Not Found ERROR404")
  }

  await prisma.userCollection.delete({
    where: { id },
  })
  
  return Send.response(Send.codes.ok, `Collection Deleted`)
}

export async function deleteCollectionItem(id: number) {
  
  await unauthorized();
  
  await prisma.collectionItems.delete({
    where: { id }
  }) 
  
  return Send.response(Send.codes.ok, `Collection Item deleted`)
}