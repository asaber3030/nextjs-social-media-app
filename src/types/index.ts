import { SavedPost as SavedPostClient } from "@prisma/client"

export type User = {
  id: number
  username: string
  name: string
  email: string
  password?: string
  picture: string
  bio: string
  website: string
  gender: string | ("Male" | "Female" )
  private: boolean
  createdAt: Date,
  updatedAt: Date
  sessions?: Session[]
}

export type Activity = {
  id: number;
  title: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  user?: User
}

export type Sessions = {
  id: number;
  client: string;
  browser: string;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  user?: User
}

export type Comment = {
  id: number
  comment: string
  userId: number
  postId: number
  createdAt: Date
  updatedAt: Date
  post?: Post
  user?: User, 
  replies?: CommentReply[]
  likes?: CommentLike[]
  _count?: {
    likes: number,
    replies: number
  }
}

export type CommentLike = {
  id: number;
  userId: number;
  commentId: number;
  createdAt: Date;
  updatedAt: Date;
  comment?: Comment,
  user?: User
}

export type Post = {
  id: number
  content: string
  private: boolean
  userId: number
  user?: User
  doing?: string
  feeling?: string
  trashed: boolean
  trashedAt: Date
  archived: boolean
  archivedAt: Date
  attachments: PostAttachment[]
  comments: Comment[]
  createdAt: Date
  updatedAt: Date
  _count: {
    saved: number,
    likes: number,
    comments: number,
    shared: number
  }
}

export type SavedPost = SavedPostClient & {
  post: Post
}

export type CommentReply = {
  id: number;
  reply: string;
  userId: number;
  user?: User;
  commentId: number;
  createdAt: Date;
  updatedAt: Date;
  comment?: Comment
  _count: {
    likes: number
  }
}

export type PostAttachment = {
  id: number
  path: string
  extension: string
  postId: number
  post?: Post
  createdAt: Date
  updatedAt: Date
}

export type Session = {
  id: number
  client: string
  browser: string
  userId: number
  createdAt: Date
  updatedAt: Date
}

export type Notification = {
  id: number
  title: string
  isRead: boolean
  description: string
  url: string
  createdAt: Date
  updatedAt: Date
  userId: number
  user?: User,
}

export type UserUpload = {
  id: number
  file: string
  extenstion: string
  userId: number
  createdAt: Date
  updatedAt: Date
}

export type Follower = {
  id: number
  followerId: number
  userId: number | null
  createdAt: Date
  updatedAt: Date
  follower?: User,
}

export type Following = {
  id: number
  followingId: number
  userId: number | null
  createdAt: Date
  updatedAt: Date
  following?: User
}

export type Collection = {
  id: number;
  title: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  order: number;
  items: CollectionItem[]
}

export type CollectionItem = {
  id: number;
  file: string;
  extenstion: string;
  collectionId: number;
  createdAt: Date;
  updatedAt: Date;
  collection: Collection
}