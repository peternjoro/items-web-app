import { createSlice } from "@reduxjs/toolkit";

// user session state
const initialState = {
    signedIn: false,
    items: {
        last_timestamp: null,
        products: {total:0,new:0,myproducts:0},
        users: {total:0,new:0},
        visits: {total:0,new:0},
        items:[]
    },
    auth_user: {userId:0,authToken: null,user_name:''},
    selected_item: {}
}
const userSession = createSlice({
    name: 'user',
    initialState,
    reducers: {
        activeState(state,action){
            const payload = action.payload;
            if("signedIn" in payload){
                state.signedIn = payload.signedIn;
            }
            if("items" in payload){
                state.items = payload.items;
            }
            if("user" in payload){
                state.auth_user = payload.user;
            }
            if("item" in payload){
                state.selected_item = payload.item;
            }
        }
    }
});
export const { activeState } = userSession.actions;
export const loginStatus = state => state.user.signedIn;
export const productItems = state => state.user.items;
export const authUser = state => state.user.auth_user;
export const selectedItem = state => state.user.selected_item;
export default userSession.reducer;