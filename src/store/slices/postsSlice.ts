import { getMyPosts } from "@/actions/post";
import { userLoggedData } from "@/actions/user";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchPosts = createAsyncThunk('posts/fetch', async () => {
  const user = await userLoggedData()
  const posts = await getMyPosts(user?.id as number)
  return posts.data
})

const initialState: string[] = []

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    like: (state) => {
      state.push("1")
      return state
    },
    fetch: (state) => {

    }
  }
})

export const { like } = postsSlice.actions

export const postsReducer = postsSlice.reducer
