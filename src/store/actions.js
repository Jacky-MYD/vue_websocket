import {get, post} from './ajax';
import api from './api';

const actions = {
    login({ commit }, data) {
        return post(api.login, data);
    },
    getFriends({ commit }, data) {
        return get(api.getFriends, data);
    },
    getMsg({ commit }, data) {
        return get(api.getMsg, data);
    },
};
export default actions;
