import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
    name:'post',
    initialState:{
        posts:[]
    },
    reducers:{
        setPostSlice(state,action){
            state.posts = action.payload 
        }
    }
})

export const {setPostSlice} = postSlice.actions;

export default postSlice.reducer