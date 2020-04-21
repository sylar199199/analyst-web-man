import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/view/redirect/index")
      }
    ]
  },
  {
    path: "/login",
    component: () => import("@/view/login/index"),
    hidden: true
  },
  {
    path: "/auth-redirect",
    component: () => import("@/view/login/auth-redirect"),
    hidden: true
  },
  {
    path: "/404",
    component: () => import("@/view/error-page/404"),
    hidden: true
  },
  {
    path: "/401",
    component: () => import("@/view/error-page/401"),
    hidden: true
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/view/dashboard/index"),
        name: "Dashboard",
        meta: {title: "仪表板", icon: "dashboard", affix: true}
      }
    ]
  },
  // {
  //   path: "/guidePageManger",
  //   component: Layout,
  //   redirect: "/guidePageManger/index",
  //   children: [
  //     {
  //       path: "index",
  //       component: () => import("@/view/guidePageManger/index"),
  //       name: "guidePageMangerList",
  //       meta: {title: "引导页管理", icon: "documentation", affix: true}
  //     }
  //   ]
  // },
  {
    path: "/accountManger",
    component: Layout,
    redirect: "/accountManger/index",
    children: [
      {
        path: "index",
        component: () => import("@/view/accountManger/list"),
        name: "accountMangerList",
        meta: {title: "用户管理", icon: "documentation", affix: true}
      }
    ]
  },
  {
    path: "/tagManager",
    component: Layout,
    redirect: "/tagManager/index",
    children: [
      {
        path: "index",
        component: () => import("@/view/tagManager/index"),
        name: "tagManager",
        meta: {title: "标签管理", icon: "guide", noCache: true}
      }
    ]
  },
  {
    path: "/sensitiveManger",
    component: Layout,
    redirect: "/sensitiveManger/index",
    children: [
      {
        path: "index",
        component: () => import("@/view/sensitiveManger/index"),
        name: "sensitiveManger",
        meta: {title: "敏感词管理", icon: "user", noCache: true}
      }
    ]
  },
  {
    path: "/certifyManger",
    component: Layout,
    redirect: "/certifyManger/index",
    children: [
      {
        path: "index",
        component: () => import("@/view/certifyManger/index"),
        name: "certifyManger",
        meta: {title: "认证管理", icon: "documentation", affix: true}
      }
    ]
  },
  {
    path: "/messageManger",
    component: Layout,
    redirect: "/messageManger/index",
    children: [
      {
        path: "index",
        component: () => import("@/view/messageManger/index"),
        name: "messageManger",
        meta: {title: "消息推送管理", icon: "guide", noCache: true}
      }
    ]
  },
  {
    path: "/helpCenter",
    component: Layout,
    redirect: "/helpCenter/index",
    children: [
      {
        path: "index",
        component: () => import("@/view/helpCenter/index"),
        name: "helpCenter",
        meta: {title: "换榜审核管理", icon: "user", noCache: true}
      }
    ]
  },
  {
    path: "/contentAccountManager",
    component: Layout,
    redirect: "/contentAccountManager/index",
    children: [
      {
        path: "index",
        component: () => import("@/view/contentAccountManager/index"),
        name: "contentAccountManager",
        meta: {title: "内容账号管理", icon: "documentation", affix: true}
      }
    ]
  },
  {
    path: "/contentReleaseManger",
    component: Layout,
    redirect: "/contentReleaseManger/index",
    children: [
      {
        path: "index",
        component: () => import("@/view/contentReleaseManger/index"),
        name: "contentReleaseManger",
        meta: {title: "内容发布管理", icon: "documentation", affix: true}
      }
    ]
  },
  {
    path: "/searchWordManager",
    component: Layout,
    redirect: "/searchWordManager/index",
    children: [
      {
        path: "index",
        component: () => import("@/view/searchWordManager/index"),
        name: "searchWordManager",
        meta: {title: "搜索词管理", icon: "guide", noCache: true}
      }
    ]
  },
  {
    path: "/downloadManager",
    component: Layout,
    redirect: "/downloadManager/index",
    children: [
      {
        path: "index",
        component: () => import("@/view/downloadManager/index"),
        name: "downloadManager",
        meta: {title: "应用下载管理", icon: "user", noCache: true}
      }
    ]
  },
  // {
  //   path: "/qualificationAuditManager",
  //   component: Layout,
  //   redirect: "/qualificationAuditManager/index",
  //   children: [
  //     {
  //       path: "index",
  //       component: () => import("@/view/qualificationAuditManager/index"),
  //       name: "qualificationAuditManager",
  //       meta: {title: "认证资格审核管理", icon: "documentation", affix: true}
  //     }
  //   ]
  // },
  {
    path: "/reportManger",
    component: Layout,
    redirect: "/reportManger/index",
    children: [
      {
        path: "index",
        component: () => import("@/view/reportManger/index"),
        name: "reportManger",
        meta: {title: "举报管理", icon: "guide", noCache: true}
      }
    ]
  },
  {
    path: "/feedbackManager",
    component: Layout,
    redirect: "/feedbackManager/index",
    children: [
      {
        path: "index",
        component: () => import("@/view/feedbackManager/index"),
        name: "feedbackManager",
        meta: {title: "反馈管理", icon: "user", noCache: true}
      }
    ]
  },
  {
    path: "/contentManager",
    component: Layout,
    redirect: "/contentManager/index",
    children: [
      {
        path: "index",
        component: () => import("@/view/contentManager/index"),
        name: "contentManager",
        meta: {title: "内容管理", icon: "documentation", affix: true}
      }
    ]
  },
  {
    path: "/commentManger",
    component: Layout,
    redirect: "/commentManger/index",
    children: [
      {
        path: "index",
        component: () => import("@/view/commentManger/index"),
        name: "commentManger",
        meta: {title: "评论管理", icon: "guide", noCache: true}
      }
    ]
  },
  {
    path: "/userAgreementManger",
    component: Layout,
    redirect: "/userAgreementManger/index",
    children: [
      {
        path: "index",
        component: () => import("@/view/userAgreementManger/index"),
        name: "userAgreementManger",
        meta: {title: "用户协议管理", icon: "user", noCache: true}
      }
    ]
  },
  {
    path: "/technicalManger",
    component: Layout,
    redirect: "/technicalManger/index",
    children: [
      {
        path: "index",
        component: () => import("@/view/technicalManger/index"),
        name: "technicalManger",
        meta: {title: "技术分析说明管理", icon: "user", noCache: true}
      }
    ]
  },
  {
    path: "/FAQManger",
    component: Layout,
    redirect: "/FAQManger/index",
    children: [
      {
        path: "index",
        component: () => import("@/view/FAQManger/index"),
        name: "FAQManger",
        meta: {title: "FAQ管理", icon: "user", noCache: true}
      }
    ]
  }
];

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // 404 page must be placed at the end !!!
  {path: "*", redirect: "/404", hidden: true}
];

const createRouter = () =>
  new Router({
    mode: "history", // require service support
    scrollBehavior: () => ({y: 0}),
    routes: constantRoutes
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
