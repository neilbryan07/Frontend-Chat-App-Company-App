import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';

import { thunk } from 'redux-thunk';
import storage from 'redux-persist/lib/storage';

import groupChatReducer from "../redux/GroupChat/GroupChatSlice";
import messageReducer from "../redux/Message/MessageSlice";
import userReducer from "../redux/userSlice";
import groupSelectedReducer from "../redux/GroupChat/SelectedGroupChatSlice";
import drawerReducer from "../redux/GroupChat/ToggleDrawerSlice";
import messageToggleReducer from "../redux/GroupChat/ToggleMessageSlice";

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    blacklist: ['navigation']
}

const reducer = combineReducers({
    groupChat: groupChatReducer,
    message: messageReducer,
    user: userReducer,
    groupSelected: groupSelectedReducer,
    drawerSelected: drawerReducer,
    messageSelected: messageToggleReducer
});

const persistedReducer = persistReducer(persistConfig, reducer)

export const store = configureStore({
    reducer: persistedReducer,
    devTools: true,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
})

export const persistor = persistStore(store)