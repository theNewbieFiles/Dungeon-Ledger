import { createSlice } from "@reduxjs/toolkit";



const authSlice = createSlice({
    name: "auth",
    initialState: {
        state: "unknown", // "unknown" | "authenticated" | "unauthenticated", 
        loading: false,
    }, 
    reducers: {
        setAuth_unknown(state){
            return {...state, state: "unknown"};
        }, 
        setAuth_authenticated(state){
            return {...state, state: "authenticated"};
        }, 
        setAuth_unauthenticated(state){
            return {...state, state: "unauthenticated"};
        }, 
        setAuthLoading(state, action){
            return { ...state, loading: action.payload};
        }

    }
});

export const { setAuth_unknown, setAuth_authenticated, setAuth_unauthenticated, setAuthLoading } = authSlice.actions;

export default authSlice.reducer;