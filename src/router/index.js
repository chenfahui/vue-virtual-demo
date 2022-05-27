
import Vue from 'vue'
import Router from 'vue-router'
let routes = [
    {
        path: '/',
        name: 'index',
        component: () => import('@/views/layout'),
        meta: { title: '主页' },
        redirect: '/treeDefault',
        children: [
            {
                path: '/treeDefault',
                name: 'treeDefault',
                meta: { title: '树' },
                component: () => import('@/views/treeDefault')
            },
            {
                path: '/treeBigdata',
                name: 'treeBigdata',
                meta: { title: '树-大数据' },
                component: () => import('@/views/treeBigdata')
            },
            {
                path: '/tableDefault',
                name: 'tableDefault',
                meta: { title: '表格' },
                component: () => import('@/views/tableDefault')
            },
            {
                path: '/tableBigdata',
                name: 'tableBigdata',
                meta: { title: '表格-大数据' },
                component: () => import('@/views/tableBigdata')
            },
            {
                path: '/virtualScrolling',
                name: 'virtualScrolling',
                meta: { title: '虚拟滚动' },
                component: () => import('@/views/virtualScrolling')
            }
        ]
    }
];
Vue.use(Router)
const router = new Router({
    mode: 'history',
    base: '/',
    scrollBehavior: () => ({ y: 0 }),
    routes // (缩写) 相当于 routes: routes
})

export default router