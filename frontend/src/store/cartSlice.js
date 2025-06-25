import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    totalAmount: 0,
}
const cartSlice=createSlice({
    name:"cart",
    initialState,
    reducers:{
        totalAmount:(state,action)=>{
            state.totalAmount=action.payload;
        },
        increament:(state,action)=>{
            state.totalAmount= state.totalAmount + 1
        },
        decreament:(state,action)=>{
            state.totalAmount= state.totalAmount - 1
            if (state.totalAmount == 0) {
                state.totalAmount = 0;   
            }
        }
    }
})
export const { totalAmount, increament ,decreament } = cartSlice.actions;
export default cartSlice.reducer;