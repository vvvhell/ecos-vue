const LoginPage = () => import('./components/LoginPage-Bio')
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
        path:'/Console/:username',
        name:'Console',
        component:Console,
        meta:{
            requireAuth:true
        }
    }
]

export default routers;

