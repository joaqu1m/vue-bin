import Vue from "vue"
import VueRouter from "vue-router"

Vue.use(VueRouter)

export default new VueRouter({
    mode: "history",
    routes: [{
        path: "/",
        name: "home",
        component: () => import("./views/Home.vue")
    }, {
        path: "/con4",
        name: "connect-4",
        component: () => import("./components/Con4.vue")
    }, {
        path: "/fisherman",
        name: "fisherman",
        component: () => import("./components/Fisherman.vue")
    }]
})