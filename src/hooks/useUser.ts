"use client"

import { getFollowersByUsername, getFollowingsByUsername, getSession, getUser, getUserByUsername, getUsers } from '@/actions/user'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

export function useUsername() {
  const { username }: { username: string } = useParams()
  return username
}

export function useUsers() {
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers()
  })
  return { 
    users: usersQuery.data?.users, 
    isLoading: usersQuery.isLoading,
    refetch: usersQuery.refetch,
    isFetched: usersQuery.isFetched
  }
}

export function useUser() {
  const queryUser = useQuery({
    queryKey: ['sessions', 'user'],
    queryFn: () => getUser(),
    retry: 4,
  })
  return { 
    user: queryUser.data?.user, 
    isLoading: queryUser.isLoading,
    refetch: queryUser.refetch,
    isFetched: queryUser.isFetched
  }
}

export function useGetUser(username: string) {
  const queryUser = useQuery({
    queryKey: ['users', username],
    queryFn: () => getUserByUsername(username),
    retry: 4,
  })

  return { 
    user: queryUser.data?.user, 
    isLoading: queryUser.isLoading,
    refetch: queryUser.refetch,
    isFetched: queryUser.isFetched
  }
}

export function useSession() {
  const queryUser = useQuery({
    queryKey: ['users', 'session'],
    queryFn: () => getSession(),
    retry: 4,
  })

  return { 
    session: queryUser.data?.session, 
    isLoading: queryUser.isLoading,
    refetch: queryUser.refetch,
    isFetched: queryUser.isFetched
  }
}

export function useFollowers(username: string) {
  const queryUser = useQuery({
    queryKey: ['users', username, 'followers'],
    queryFn: ({ queryKey }) => getFollowersByUsername(queryKey[1] as string),
    retry: 4,
  })

  return { 
    followers: queryUser.data?.followers, 
    isLoading: queryUser.isLoading,
    refetch: queryUser.refetch,
    isFetched: queryUser.isFetched
  }
}

export function useFollowings(username: string) {
  const queryUser = useQuery({
    queryKey: ['users', username, 'followings'],
    queryFn: ({ queryKey }) => getFollowingsByUsername(queryKey[1] as string),
    retry: 4,
  })
  return { 
    followings: queryUser.data?.followings, 
    isLoading: queryUser.isLoading,
    refetch: queryUser.refetch,
    isFetched: queryUser.isFetched
  }
}