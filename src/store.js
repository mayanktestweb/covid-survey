import { combineReducers, createStore } from 'redux'


import adminReducer from './reducers/admin'
import surveyOfficerReducer from './reducers/survey_officer'
import familyReducer from './reducers/family'
import membersReducer from './reducers/members'

let store = createStore(combineReducers({
    admin: adminReducer,
    survey_officer: surveyOfficerReducer,
    family: familyReducer,
    members: membersReducer
}))

export default store;