import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import router from '../router';



const alert = {
    state: {
        type: null,
        message: null

    },

    actions: {
        success({ commit }, message) {
            commit('success', message);
        },
        error({ commit }, message) {
            commit('error', message);
        },
        clear({ commit }) {
            commit('clear');
        }
    }, mutations: {
        success(state, message) {
            state.type = 'success';
            state.message = message;

        },
        error(state, message) {
            state.type = 'error';
            state.message = message;
        },
        clear(state) {
            
            state.type = null;
            state.message = null;
        }
    }
}


const account = {

    state: {
        role:null,
        token: null,
        username: null,
        userid: null,
        avatar:null,
        name:null,
        surname:null,
    },
    getters: {
        isAuth: state => state.token !== null,
        isAdmin: state => state.role === 'ADMIN',
        userName: state =>state.username,
        token: state =>state.token,
        idUser: state =>state.userid,
        avatar: state =>state.avatar,
        nameSurname : state =>state.name + ' ' + state.surname
    },

    mutations: {
        auth(state, payload) {
            state.token = payload.token,
                state.userid = payload.id,
                state.username = payload.username,
                state.avatar = payload.avatar,
                state.role = payload.role,
                state.name = payload.name,
                state.surname = payload.surname

        },
        clearAuth(state) {
            state.token = null,
                state.username = null,
                state.userid = null,
                state.avatar = null,
                state.role =null,
                state.name = null,
                state.surname = null

        }
    },
    actions: {
        setAvatar(idAvatar){
            this.avatar =idAvatar
        },
    
        async login({ commit }, payload) {
            try {
                let { data } = await axios.post('http://localhost:8088/api/login', payload)
                if (data !== null) {

                    commit('auth', {
                        token: data.token,
                        id: data.id,
                        username: data.userName,
                        avatar:data.avatar,
                        role:data.roles[0].name,
                        name:data.name,
                        surname:data.surname

                    })
                    const endDate = new Date(data.expiration);
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userId', data.id);
                    localStorage.setItem('userName', data.userName);
                    localStorage.setItem('expires', endDate);
                    localStorage.setItem('expires', endDate);
                    localStorage.setItem('avatar',data.avatar);
                    localStorage.setItem('role', data.roles[0].name);
                    localStorage.setItem('name',data.name);
                    localStorage.setItem('surname',data.surname);
                }
                this.loading = false;
            } catch (error) {
                if(!error.response){
                
                const message = 'Brak połączenia z serwerem.'
                store.dispatch('error', message)
            }else{
                const message = 'Podaj poprawny login i hasło.'
                store.dispatch('error', message)
            }
        }

        },
        autoLogin({ commit }) {
            const token = localStorage.getItem('token');
            if (!token) {
                return;
            }
            const expiration = new Date(localStorage.getItem('expires'));
            const now = new Date();
            
            if (now >= expiration) {
            localStorage.removeItem('token');
            localStorage.removeItem('expires');
            localStorage.removeItem('userId');
            localStorage.removeItem('userName');
            localStorage.removeItem('role');
            localStorage.removeItem('avatar');
            localStorage.removeItem('name');
            localStorage.removeItem('surname');
               return  
               
            }
            const userid = localStorage.getItem('userId');
            const userName = localStorage.getItem('userName');
            const role = localStorage.getItem('role');
            const avatar = localStorage.getItem('avatar');
            const name = localStorage.getItem('name');
            const surname = localStorage.getItem('surname');
            
            
            commit('auth', {
                token,
                id: userid,
                username: userName,
                avatar,
                role, 
                name,
                surname


            });

        },
        checkExpiration(){
            const expiration = new Date(localStorage.getItem('expires'));
            const now = new Date();           
            if (now >= expiration) {
            window.location.reload()
            }
        },

        logout({ commit }) {
            commit('clearAuth')
            localStorage.removeItem('token');
            localStorage.removeItem('expires');
            localStorage.removeItem('userId');
            localStorage.removeItem('userName');
            localStorage.removeItem('role');
            localStorage.removeItem('avatar');
            router.push('/');

        }

    },
}

Vue.use(Vuex);

export const store = new Vuex.Store({
    modules: {
        alert,
        account,
    }
});