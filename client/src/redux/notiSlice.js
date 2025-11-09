import { createSlice } from "@reduxjs/toolkit";
;

const notiSlice = createSlice({
    name:'realTimeNotification',
    initialState:{
        likeNotification :[]
    },
    reducers:{
        setLikeNotification(state,action){
            if(action.payload.type === 'like'){
                state.likeNotification.push(action.payload);
            }
            else if(action.payload.type === 'disliked'){
                state.likeNotification = state.likeNotification.filter((item)=>item.userId !== action.payload.userId)
            }
        }
    }
})

export const {setLikeNotification} = notiSlice.actions;
export default notiSlice.reducer;