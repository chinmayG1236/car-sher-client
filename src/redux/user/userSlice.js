import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser:null,
    loading:false,
    error:false,
    start:null,
    end:null,
    startOnMap:null,
    endOnMap:null,
    notifs:0
};

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        signInStart : (state,action)=>{
            state.loading = true;
        },
        signInSuccess:(state,action)=>{
            state.currentUser = action.payload;
            // action.payload = state.currentUser; 
            state.loading = false;
            state.error = false;
        },
        signInFailure:(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        },
        updateUserStart:(state)=>{
            state.loading = true;
        },
        updateUserSuccess:(state,action)=>{
            state.currentUser = action.payload;
            state.loading = false;
            state.error = false;
        },
        updateUserFailure:(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        },
        deleteUserStart:(state)=>{
            state.loading = true;
        },
        deleteUserSuccess:(state,action)=>{
            state.currentUser = null;
            state.loading = false;
            state.error = false;
        },
        deleteUserFailure:(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        },
        signOut:(state)=>{
            state.currentUser = null;
            state.loading = false;
            state.error = false;
        },
        addStart:(state,action)=>{
            state.start = action.payload;
        },
        addEnd:(state,action)=>{
            state.end = action.payload;
        },
        addStartOnMap:(state,action)=>{
            state.startOnMap = action.payload;
        },
        addEndOnMap:(state,action)=>{
            state.endOnMap = action.payload;
        },
        deleteStart:(state)=>{
            state.start = null;
        },
        deleteEnd:(state)=>{
            state.end = null;
        },
        deleteStartOnMap:(state)=>{
            state.startOnMap = null;
        },
        deleteEndOnMap:(state)=>{
            state.endOnMap = null;
        },
        setNotifs:(state,action)=>{
            state.notifs = action.payload;
        },

    }
})

export const {signInStart,signInSuccess,signInFailure,updateUserFailure,
    updateUserStart,updateUserSuccess,deleteUserFailure,deleteUserStart,
    deleteUserSuccess,signOut,addStart,addEnd,addStartOnMap,addEndOnMap,
    deleteStart,deleteEnd,deleteStartOnMap,deleteEndOnMap,setNotifs} = userSlice.actions;

export default userSlice.reducer;