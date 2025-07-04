import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
// slices
import mailReducer from './slices/mail'
import chatReducer from './slices/chat'
import blogReducer from './slices/blog'
import productReducer from './slices/product'
import calendarReducer from './slices/calendar'
import kanbanReducer from './slices/kanban'

// ----------------------------------------------------------------------

const rootPersistConfig = {
    key: 'root',
    storage,
    keyPrefix: 'redux-',
    whitelist: [
        'NewProgram',
        'Profile',
        'ProgramList',
        'AtheletePlan',
        'Chat',
        'Notifications',
        'Library',
    ],
}

const productPersistConfig = {
    key: 'product',
    storage,
    keyPrefix: 'redux-',
    whitelist: ['sortBy', 'checkout'],
}

const rootReducer = combineReducers({
    mail: mailReducer,
    chat: chatReducer,
    blog: blogReducer,
    calendar: calendarReducer,
    kanban: kanbanReducer,
    product: persistReducer(productPersistConfig, productReducer),
})

export { rootPersistConfig, rootReducer }
