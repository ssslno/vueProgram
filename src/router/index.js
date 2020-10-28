import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('../components/Login')
const Home =() => import ('../components/Home')
const Users =() => import('../components/user/Users')
const Rights =() =>import('../components/power/Rights')
const Roles =() =>import('../components/power/Roles')
const Cate = () =>import('../components/goods/Cate')
const Params = ()=>import('../components/goods/Params')
const Order = () =>import('../components/order/Order')
const Report =() =>import('../components/report/Report')
const GoodList =() =>import('../components/goods/List.vue')
Vue.use(VueRouter)

const routes = [
 
]

const router = new VueRouter({
  routes:[
     {path:'/',redirect:'/login'},
    {path:'/login',component:Login},
    {path:'/home',
    component:Home,
    redirect:'/users',
    children:[
    {path:'/users',component:Users},
    {path:'/rights',component:Rights},
    {path:'/roles',component:Roles},
    {path:'/categories',component:Cate},
    {path:'/params',component:Params},
    {path:'/orders',component:Order},
    {path:'/reports',component:Report},
    {path:'/goods',component:GoodList}
  ]
  },
 
  
  ],
 
})
//阻止通过url跳转某些访问权限
router.beforeEach((to,from,next)=>{
  if(to.path==='/login') return next();
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()
})

export default router
