import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            redirect: "/home",
        },
        {
            path: "/home",
            name: "home",
            component: HomeView,
        },
        {
            path: "/courses",
            name: "courses",
            component: () => import("../views/AllCourseView.vue"),
        },
        {
            path: "/course/:courseId",
            name: "course",
            component: () => import("../views/CourseView.vue"),
            props: true
        },
        {
            path: "/md/:contentUrl",
            name: "md",
            component: () => import("../views/MdView.vue"),
            props: true
        },
        {
            path: "/about",
            name: "about",
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import("../views/AboutView.vue"),
        },
        {
            path: "/administrator",
            name: "administrator",
            // auth: ["ADMIN"],
            redirect: "/administrator/classification",
            component: () => import("../views/AdministratorView.vue"),
            children: [
                {
                    path: "/administrator/classification",
                    name: "admin-classification",
                    component: () => import("../views/AdminClassificationView.vue"),
                },
                {
                    path: "/administrator/course",
                    name: "admin-course",
                    component: () => import("../views/AdminCourseView.vue"),
                },
                {
                    path: "/administrator/chapter/:id",
                    name: "admin-chapter",
                    component: () => import("../views/AdminChapterView.vue"),
                    props: true,
                },
                {
                    path: "/administrator/user",
                    name: "admin-user",
                    component: () => import("../views/AdminUserView.vue"),
                }
            ]
        }
    ],
});

export default router;
