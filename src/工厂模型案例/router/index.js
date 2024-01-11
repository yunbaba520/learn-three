import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: "/main",
    },

    {
      path: "/main",
      name: "main",
      component: () => import("../pages/main.vue"),
    },
  ],
});

export default router;
