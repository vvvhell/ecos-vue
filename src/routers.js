import LoginPage from './components/LoginPage.vue'
import Console from './components/Console.vue'

const routers = [
    {
        path:'/LoginPage',
        name:'LoginPage',
        component:LoginPage
    },
    {
        path:'/Console',
        name:'Console',
        component:Console
    }
]
export default routers;

