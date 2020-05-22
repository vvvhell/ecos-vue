import store from './store';

const LoginPage = () => import('./components/LoginPage-SMS')
const Console = () => import('./components/Console')

const routers = [
    {
        path:'',
        redirect:'/LoginPage'
    },
    {
        path:'/LoginPage',
        name:'LoginPage',
        component:LoginPage
    },
    {
        path:'/Console/'+store.state.username,
        name:'Console',
        component:Console,
        meta:{
            requireAuth:true
        }
    }
]
export default routers;

