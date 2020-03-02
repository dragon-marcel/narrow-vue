import Vue from 'vue'
import VueRouter from 'vue-router'
import {store} from '../store/index'

Vue.use(VueRouter)
store.dispatch('autoLogin');
document.title ='Narrow-system'
const authGuard =(to,from,next) =>{

  if(store.getters.isAuth){
    next();
  }else{
    next({name:'login'});
    }
}
const notAuthGuard =(to,from,next) =>{

  if(!store.getters.isAuth){
    next();
  }else{
    next('/dashboard')
    }
}
const routes = [
  {
    path: '/',
    name: 'login',
    title:'Narrow-System',
    component: ()=> import('../views/Home.vue'),
    beforeEnter:notAuthGuard,
    
  },
  {
    path: '/dashboard/',
    title:'Narrow-System',
    component: ()=> import('../views/Dashboard.vue'),
    children:[
      { path:'', component: () =>import('../views/Dashboard/Home.vue')},
      { path:'users', component: () =>import('../views/Dashboard/Users.vue')},
      { path:'asortemnents', component: () =>import('../views/Dashboard/Asortements.vue')},
      { path:'orders', component: () =>import('../views/Dashboard/Orders.vue')},
      { path:'customers', component: () =>import('../views/Dashboard/Customers.vue')},
      {path:'providers', component: () =>import('../views/Dashboard/Providers.vue')},
      {path:'todo', component: () =>import('../views/Dashboard/Todo.vue')},
      { path:'currency', component: () =>import('../views/Dashboard/Currency.vue')},

      { path: '/*',component: () =>import('../views/Dashboard/Error404.vue')}
      
    ],
    beforeEnter:authGuard   
  },

]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
