import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("@/views/home/index.vue")
  },
  {
    path: "/icons",
    component: () => import("@/views/icons/index.vue")
  }
];

export default routes;
