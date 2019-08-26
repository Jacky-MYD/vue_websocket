

export const state = {
    setSelfInfo: {},
};

export const mutations = {
    setSelfInfo(state, data) {
        localStorage.setItem('user', JSON.stringify(data));
    },
};

