import _ from "lodash";
import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";
const routes = [
  {
    // 首页是需要登录的
    path: "/",
    name: "home",
    component: () => import("../components/Home.vue"),
  },
  {
    // 首页是需要登录的
    path: '/demo',
    name: "demo",
    component: () => import("../demo/index.vue"),
  },
];
// 公共路由
export const constantRoutes = [];

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = [];
const router = createRouter({
  history: createWebHashHistory(),
  //   history: createWebHistory(),
  routes,
});

export function switchToRoute(path: string) {
  router.push({ path: path });
}
// addDemoRoutes()
export default router;
export { routes, router };
