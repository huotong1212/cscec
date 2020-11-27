import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    // mode: 'history',
    routes: [
        {
            path: '/',
            redirect: '/cscec'
        },
        // {
        //         //     path: '/',
        //         //     component: resolve => require(['../components/common/Home.vue'], resolve),
        //         //     meta: { title: '自述文件' },
        //         //     children:[
        //         //         {
        //         //             path: '/dashboard',
        //         //             component: resolve => require(['../components/page/Dashboard.vue'], resolve),
        //         //             meta: { title: '系统首页' }
        //         //         },
        //         //     ]
        //         // },
        {
            path: '/statistical',
            name: 'statistical',
            component: resolve => require(['../components/statistical.vue'], resolve)
        },
        {
            path: '/season',
            name: 'season',
            component: resolve => require(['../components/Process_Season.vue'], resolve)
        },
        {
            path: '/upload',
            name: 'upload',
            component: resolve => require(['../components/upload_csv.vue'], resolve)
        },
        {
            path: '/cscec',
            name: 'cscec',
            component: resolve => require(['../components/cscec.vue'], resolve)
        },
        {
            path: '/test_report',
            name: 'test_report',
            component: resolve => require(['../components/test_repot'], resolve)
        },
        {
            path: '/cscec_v2',
            name: 'cscec_v2',
            component: resolve => require(['../components/cscec_v2.vue'], resolve)
        },
    ]
})
