"use server";

import prisma from "@/lib/db";

import { addActivity, notify, unauthorized, userLogged, userLoggedData } from './user';
import { Send } from '@/lib/utils';
import { now } from "moment";
import { route } from "@/lib";

export async function findUser(userId: number) {
  return await prisma.user.findUnique({
    where: { id: userId }
  })
}

export async function changePostStatus(postId: number, status: boolean) {
  const user = await userLoggedData()
  const isLogged = await userLogged()

  const post = await prisma.post.findUnique({ where: { id: postId } })

  if (isLogged) {
    if (post?.userId === user?.id) {
      await prisma.post.update({
        where: { id: postId },
        data: { private: status }
      })
      return Send.response(Send.codes.ok, `Post privacy has been updated to ${status ? 'Private' : 'Public'}`)
    }
    return Send.response(Send.codes.notfound, `Post was not found!`)
  }
}

export async function archive(postId: number, status: boolean) {
  const user = await userLoggedData()
  const isLogged = await userLogged()

  const post = await prisma.post.findUnique({ where: { id: postId } })

  if (isLogged) {
    if (post?.userId === user?.id) {
      await prisma.post.update({
        where: { id: postId },
        data: { archived: status, archivedAt: new Date(now()), trashed: false, trashedAt: null }
      })
      return Send.response(Send.codes.ok, `Post has been ${status ? 'Archived' : 'Un archived'}`)
    }
    return Send.response(Send.codes.notfound, `Post was not found!`)
  }
}

export async function trashPost(postId: number) {
  const user = await userLoggedData()
  const isLogged = await userLogged()

  const post = await prisma.post.findUnique({ where: { id: postId } })

  if (isLogged) {
    if (post?.userId === user?.id) {
      await prisma.post.update({
        where: { id: postId },
        data: { trashed: true, trashedAt: new Date(now()), archived: false, archivedAt: null }
      })
      return Send.response(Send.codes.ok, `Post has been moved to trash!`)
    }
    return Send.response(Send.codes.notfound, `Post was not found!`)
  }
}

export async function restorePost(postId: number) {

  const user = await userLoggedData()
  const isLogged = await userLogged()

  const post = await prisma.post.findUnique({ where: { id: postId } })

  if (isLogged) {
    if (post?.userId === user?.id) {
      await prisma.post.update({
        where: { id: postId },
        data: { trashed: false, trashedAt: null, archived: false, archivedAt: null }
      })
      return Send.response(Send.codes.ok, `Post has been restored`)
    }
    return Send.response(Send.codes.notfound, `Post was not found!`)
  }
}

export async function forceDelete(postId: number) {
  const user = await userLoggedData()
  const isLogged = await userLogged()

  const post = await prisma.post.findUnique({ where: { id: postId } })

  if (isLogged) {
    if (post?.userId === user?.id) {
      await prisma.post.delete({
        where: { id: postId }
      })
      return Send.response(Send.codes.ok, `Post has been deleted!`)
    }
    return Send.response(Send.codes.notfound, `Post was not found!`)
  }
}

export async function findPost(postId: number) {
  return await prisma.post.findUnique({
    where: { id: postId }
  })
}

export async function findComment(commentId: number) {
  return await prisma.comment.findUnique({
    where: { id: commentId }
  })
}

export async function create(values: any) {
  const isLogged = await userLogged()
  const current = await userLoggedData()

  if (isLogged) {
    const userId = current?.id as number
    const post = {
      userId,
      private: values.private,
      content: values.content,
      doing: values.doing,
      feeling: values.feeling
    }
    const newPost = await prisma.post.create({
      data: post
    })
    return Send.response(Send.codes.created, "Post has been created!", newPost)
  }
  return Send.response(Send.codes.unauthorized, "Unauthorized!")
}

export async function getMyPosts(userId: number, trashed: boolean = false, archived: boolean = false) {
  const isLogged = await userLogged()
  const current = await userLoggedData()

  if (isLogged) {
    const posts = await prisma.post.findMany({
      where: { userId: userId as number, archived, trashed },
      orderBy: { createdAt: 'desc' },
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
      }
    })
    return Send.response(Send.codes.found, "Posts was found", posts)
  }
  return Send.response(Send.codes.unauthorized, "Unauthorized!")
}

export async function getPost(postId: number) {
  const isLogged = await userLogged()
  const current = await userLoggedData()

  if (isLogged) {
    const post = await prisma.post.findUnique({
      where: { id: postId as number },
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
      }
    })
    return Send.response(
      Send.codes.found, 
      'Post found', 
      post
    )
  }
  return Send.response(Send.codes.unauthorized, "Unauthorized!")
}

export async function getPostComments(postId: number) {
  const comments = await prisma.comment.findMany({ 
    where: { postId },
    orderBy: { id: 'desc' },
    include: { 
      user: true,
      _count: { select: { likes: true, replies: true } }
    },
  })
  return Send.response(Send.codes.found, 'Comments found!', comments)
}

export async function getCommentReplies(commentId: number) {
  const replies = await prisma.commentReply.findMany({ 
    where: { commentId },
    orderBy: { id: 'desc' },
    include: { 
      user: true,
      comment: true,
      _count: { select: { likes: true } }
    },
  })
  return Send.response(Send.codes.found, 'Replies found!', replies)
}

//// Like & Dislike ////
export async function like(postOwnerId: number, postId: number, userId: number) {
  const isLogged = await userLogged()
  const current = await userLoggedData()

  const findLike = await prisma.postLike.findFirst({
    where: { postId, userId }
  })

  if (!isLogged) {
    return Send.response(Send.codes.unauthorized, "Unauthorized")
  }

  if (findLike) {
    return Send.response(Send.codes.found, "Liked before!")
  }

  const owner = await prisma.user.findUnique({ where: { id: postOwnerId } })
  const newLike = await prisma.postLike.create({
    data: { userId, postId }
  })
  await notify(owner?.id as number, `@${current?.username} has liked your post!`, 'Likes of post!', `/profile/${current?.username}`)
  return Send.response(Send.codes.created, "Liked", newLike)
}

export async function dislike(postId: number, userId: number) {
  const isLogged = await userLogged()
  const current = await userLoggedData()

  const findLike = await prisma.postLike.findFirst({
    where: { postId, userId }
  })

  if (!isLogged) {
    return Send.response(Send.codes.unauthorized, "Unauthorized")
  }

  if (findLike) {
    await prisma.postLike.deleteMany({
      where: { postId, userId }
    })
    return Send.response(Send.codes.ok, "Disliked")
  }
}

export async function hasLiked(userId: number, postId: number) {
  const isLogged = await userLogged()

  const findLike = await prisma.postLike.findFirst({
    where: { postId, userId }
  })

  if (findLike && isLogged) {
    return true
  } else {
    return false
  }
}

//// Save & Unsave ////
export async function save(postOwnerId: number, postId: number, userId: number) {
  const isLogged = await userLogged()
  const current = await userLoggedData()

  const findSave = await prisma.savedPost.findFirst({
    where: { postId, userId }
  })

  if (!isLogged) {
    return Send.response(Send.codes.unauthorized, "Unauthorized")
  }

  if (findSave) {
    return Send.response(Send.codes.found, "Saved before!")
  }

  const owner = await prisma.user.findUnique({ where: { id: postOwnerId } })
  const newSaved = await prisma.savedPost.create({
    data: { userId, postId }
  })
  await notify(owner?.id as number, `@${current?.username} has saved your post!`, 'Likes of post!', `/profile/${current?.username}`)
  return Send.response(Send.codes.created, "Saved", newSaved)
}

export async function unsave(postId: number, userId: number) {
  const isLogged = await userLogged()
  const current = await userLoggedData()

  const findSaved = await prisma.savedPost.findFirst({
    where: { postId, userId }
  })

  if (!isLogged) {
    return Send.response(Send.codes.unauthorized, "Unauthorized")
  }

  if (findSaved) {
    await prisma.savedPost.deleteMany({
      where: { postId, userId }
    })
    return Send.response(Send.codes.ok, "Unsaved")
  }

}

export async function hasSaved(userId: number, postId: number) {
  const findSaved = await prisma.savedPost.findFirst({
    where: { postId, userId }
  })

  if (findSaved) {
    return true
  } else {
    return false
  }
}

export async function hasArchived(userId: number, postId: number) {
  const isLogged = await userLogged()

  const findArchived = await prisma.post.findUnique({
    where: { id: postId, userId, archived: true }
  })

  if (findArchived && isLogged) {
    return true
  } else {
    return false
  }
}

//// Comments ////

export async function addComment(comment: string, postId: number, userId: number, postOwnerId: number) {
  const isLogged = await userLogged()

  if (isLogged) {
    if (!comment) {
      return Send.response(
        Send.codes.forbidden,
        'Empty Content!',
      )
    }
    const newComment = await prisma.comment.create({
      data: { postId, userId, comment }
    })
    const owner = await findUser(postOwnerId)
    const commentor = await findUser(userId)
    const post = await findPost(postId)

    await notify(
      owner?.id as number, 
      `${commentor?.username} has commented on your post: ${post?.content.slice(0, 10)}...`,
      `${commentor?.username} has commented on your post: ${post?.content.slice(0, 10)}...`,
      route('viewPost', post?.id)
    )

    return Send.response(
      Send.codes.created,
      'Comment added!',
      newComment
    )
  }
  return Send.unauthorized()
}

export async function addReply(reply: string, commentId: number, userId: number, commentOwnerId: number) {
  const isLogged = await userLogged()

  if (isLogged) {
    if (!reply) {
      return Send.response(
        Send.codes.forbidden,
        'Empty Reply!',
      )
    }
    const newReply = await prisma.commentReply.create({
      data: { commentId, userId, reply }
    })
    const owner = await findUser(commentOwnerId)
    const commentor = await findUser(userId)
    const comment = await findComment(commentId)

    await notify(
      owner?.id as number, 
      `${commentor?.username} has replied to your comment: ${comment?.comment.slice(0, 10)}...`,
      `${commentor?.username} has commented on your post: ${comment?.comment.slice(0, 10)}...`,
      `/profile/${commentor?.username}/posts/${comment?.id}`
    )

    return Send.response(
      Send.codes.created,
      'Reply added!',
      newReply
    )
  }
  return Send.unauthorized()
}

//// Like & Dislike ////
export async function likeComment(commentOwnerId: number, commentId: number, userId: number) {
  const isLogged = await userLogged()
  const current = await userLoggedData()

  const findLike = await prisma.commentLike.findFirst({
    where: { commentId, userId }
  })

  if (!isLogged) {
    return Send.response(Send.codes.unauthorized, "Unauthorized")
  }

  if (findLike) {
    return Send.response(Send.codes.found, "Liked before!")
  }

  const owner = await prisma.user.findUnique({ where: { id: commentOwnerId } })
  const newComment = await prisma.commentLike.create({
    data: { userId, commentId }
  })
  if (owner?.id != userId) {
    await notify(owner?.id as number, `@${current?.username} has liked your comment!`, `@${current?.username} has liked your comment!`, `/profile/${current?.username}`)
  }
  return Send.response(Send.codes.created, "Liked", newComment)
}

export async function dislikeComment(commentId: number, userId: number) {
  const isLogged = await userLogged()
  const current = await userLoggedData()

  const findLike = await prisma.commentLike.findFirst({
    where: { commentId, userId }
  })

  if (!isLogged) {
    return Send.response(Send.codes.unauthorized, "Unauthorized")
  }

  if (findLike) {
    await prisma.commentLike.deleteMany({
      where: { commentId, userId }
    })
    return Send.response(Send.codes.ok, "Disliked")
  }
 
}

export async function hasLikedComment(userId: number, commentId: number) {
  const isLogged = await userLogged()

  const findLike = await prisma.commentLike.findFirst({
    where: { commentId, userId }
  })

  if (findLike && isLogged) {
    return true
  } else {
    return false
  }
}

export async function likeReply(replyOwnerId: number, replyId: number, userId: number) {
  const isLogged = await userLogged()
  const current = await userLoggedData()

  const findLike = await prisma.replyLike.findFirst({
    where: { replyId, userId }
  })

  if (!isLogged) {
    return Send.response(Send.codes.unauthorized, "Unauthorized")
  }

  if (findLike) {
    return Send.response(Send.codes.found, "Liked before!")
  }

  const owner = await prisma.user.findUnique({ where: { id: replyOwnerId } })
  const newLike = await prisma.replyLike.create({
    data: { userId, replyId }
  })
  if (owner?.id != userId) {
    await notify(owner?.id as number, `@${current?.username} has liked your reply!`, `@${current?.username} has liked your reply!`, `/profile/${current?.username}`)
  }
  return Send.response(Send.codes.created, "Liked", newLike)
}

export async function dislikeReply(replyId: number, userId: number) {
  const isLogged = await userLogged()
  const current = await userLoggedData()

  const findLike = await prisma.replyLike.findFirst({
    where: { replyId, userId }
  })

  if (!isLogged) {
    return Send.response(Send.codes.unauthorized, "Unauthorized")
  }

  if (findLike) {
    await prisma.replyLike.deleteMany({
      where: { replyId, userId }
    })
    return Send.response(Send.codes.ok, "Disliked")
  }
 
}

export async function hasLikedReply(userId: number, replyId: number) {
  const isLogged = await userLogged()
  const findLike = await prisma.replyLike.findFirst({
    where: { replyId, userId }
  })

  if (findLike && isLogged) {
    return true
  } else {
    return false
  }
}

export async function deleteComment(commentId: number) {
  await unauthorized();
  const user = await userLoggedData()
  const comment = await prisma.comment.findUnique({ where: { id: commentId } })

  if (comment?.userId !== user?.id) {
    return Send.response(Send.codes.notfound, "Unauthorized action submitted!")
  }

  await addActivity(`You have deleted your comment ${comment}`, `/posts/${comment?.postId}`)
  await prisma.comment.delete({ where: { id: commentId } })
  return Send.response(Send.codes.ok, "Comment has been deleted!")
}

export async function updateComment(commentId: number, content: string) {
  await unauthorized();
  const user = await userLoggedData()
  const comment = await prisma.comment.findUnique({ where: { id: commentId }, select: { postId: true, userId: true, comment: true } })

  if (comment?.userId !== user?.id) {
    return Send.response(Send.codes.notfound, "Unauthorized action submitted!")
  }

  await addActivity(`You have Updated your comment ${comment}`, `/posts/${comment?.postId}`)
  await prisma.comment.update({ where: { id: commentId }, data: { comment: content } })
  return Send.response(Send.codes.ok, "Comment has been deleted!", comment)
}

export async function deleteReply(replyId: number) {
  await unauthorized();
  const user = await userLoggedData()
  const reply = await prisma.commentReply.findUnique({ where: { id: replyId } })
  const comment = await prisma.comment.findUnique({ where: { id: reply?.commentId }, select: { postId: true } })

  if (reply?.userId !== user?.id) {
    return Send.response(Send.codes.notfound, "Unauthorized action submitted!")
  }

  await addActivity(`You have deleted your reply ${reply}`, `/posts/${comment?.postId}`)
  await prisma.commentReply.delete({ where: { id: replyId } })
  return Send.response(Send.codes.ok, "Reply has been deleted!")
}

export async function updateReply(replyId: number, content: string) {
  await unauthorized();
  const user = await userLoggedData()
  const reply = await prisma.commentReply.findUnique({ where: { id: replyId } })
  const comment = await prisma.comment.findUnique({ where: { id: reply?.commentId }, select: { postId: true } })

  if (reply?.userId !== user?.id) {
    return Send.response(Send.codes.notfound, "Unauthorized action submitted!")
  }

  await addActivity(`You have updated your reply ${reply}`, `/posts/${comment?.postId}`)
  await prisma.commentReply.update({ where: { id: replyId }, data: { reply: content } })
  return Send.response(Send.codes.ok, "Reply has been deleted!")
}