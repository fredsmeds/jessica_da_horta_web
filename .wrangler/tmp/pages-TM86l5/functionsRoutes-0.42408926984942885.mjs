import { onRequest as __api_admin_projects__id__tasks__taskId__js_onRequest } from "C:\\Users\\fredd\\Documents\\jessica_da_horta_web\\functions\\api\\admin\\projects\\[id]\\tasks\\[taskId].js"
import { onRequest as __api_admin_blog_posts__id__js_onRequest } from "C:\\Users\\fredd\\Documents\\jessica_da_horta_web\\functions\\api\\admin\\blog\\posts\\[id].js"
import { onRequest as __api_admin_calendar_appointments__id__js_onRequest } from "C:\\Users\\fredd\\Documents\\jessica_da_horta_web\\functions\\api\\admin\\calendar\\appointments\\[id].js"
import { onRequest as __api_admin_projects__id__tasks_js_onRequest } from "C:\\Users\\fredd\\Documents\\jessica_da_horta_web\\functions\\api\\admin\\projects\\[id]\\tasks.js"
import { onRequest as __api_admin_blog_categories_js_onRequest } from "C:\\Users\\fredd\\Documents\\jessica_da_horta_web\\functions\\api\\admin\\blog\\categories.js"
import { onRequest as __api_admin_blog_posts_js_onRequest } from "C:\\Users\\fredd\\Documents\\jessica_da_horta_web\\functions\\api\\admin\\blog\\posts.js"
import { onRequest as __api_admin_calendar_appointments_js_onRequest } from "C:\\Users\\fredd\\Documents\\jessica_da_horta_web\\functions\\api\\admin\\calendar\\appointments.js"
import { onRequestGet as __api_blog_posts__slug__js_onRequestGet } from "C:\\Users\\fredd\\Documents\\jessica_da_horta_web\\functions\\api\\blog\\posts\\[slug].js"
import { onRequest as __api_admin_projects__id__js_onRequest } from "C:\\Users\\fredd\\Documents\\jessica_da_horta_web\\functions\\api\\admin\\projects\\[id].js"
import { onRequestGet as __api_admin_attachment_js_onRequestGet } from "C:\\Users\\fredd\\Documents\\jessica_da_horta_web\\functions\\api\\admin\\attachment.js"
import { onRequestGet as __api_admin_leads_js_onRequestGet } from "C:\\Users\\fredd\\Documents\\jessica_da_horta_web\\functions\\api\\admin\\leads.js"
import { onRequestPost as __api_admin_login_js_onRequestPost } from "C:\\Users\\fredd\\Documents\\jessica_da_horta_web\\functions\\api\\admin\\login.js"
import { onRequestGet as __api_admin_prices_js_onRequestGet } from "C:\\Users\\fredd\\Documents\\jessica_da_horta_web\\functions\\api\\admin\\prices.js"
import { onRequestPut as __api_admin_prices_js_onRequestPut } from "C:\\Users\\fredd\\Documents\\jessica_da_horta_web\\functions\\api\\admin\\prices.js"
import { onRequestDelete as __api_admin_suppliers_js_onRequestDelete } from "C:\\Users\\fredd\\Documents\\jessica_da_horta_web\\functions\\api\\admin\\suppliers.js"
import { onRequestGet as __api_admin_suppliers_js_onRequestGet } from "C:\\Users\\fredd\\Documents\\jessica_da_horta_web\\functions\\api\\admin\\suppliers.js"
import { onRequestPost as __api_admin_suppliers_js_onRequestPost } from "C:\\Users\\fredd\\Documents\\jessica_da_horta_web\\functions\\api\\admin\\suppliers.js"
import { onRequestPut as __api_admin_suppliers_js_onRequestPut } from "C:\\Users\\fredd\\Documents\\jessica_da_horta_web\\functions\\api\\admin\\suppliers.js"
import { onRequestGet as __api_blog_categories_js_onRequestGet } from "C:\\Users\\fredd\\Documents\\jessica_da_horta_web\\functions\\api\\blog\\categories.js"
import { onRequestGet as __api_blog_posts_js_onRequestGet } from "C:\\Users\\fredd\\Documents\\jessica_da_horta_web\\functions\\api\\blog\\posts.js"
import { onRequest as __api_admin_projects_js_onRequest } from "C:\\Users\\fredd\\Documents\\jessica_da_horta_web\\functions\\api\\admin\\projects.js"
import { onRequestPost as __api_contact_js_onRequestPost } from "C:\\Users\\fredd\\Documents\\jessica_da_horta_web\\functions\\api\\contact.js"
import { onRequestPost as __api_schedule_js_onRequestPost } from "C:\\Users\\fredd\\Documents\\jessica_da_horta_web\\functions\\api\\schedule.js"

export const routes = [
    {
      routePath: "/api/admin/projects/:id/tasks/:taskId",
      mountPath: "/api/admin/projects/:id/tasks",
      method: "",
      middlewares: [],
      modules: [__api_admin_projects__id__tasks__taskId__js_onRequest],
    },
  {
      routePath: "/api/admin/blog/posts/:id",
      mountPath: "/api/admin/blog/posts",
      method: "",
      middlewares: [],
      modules: [__api_admin_blog_posts__id__js_onRequest],
    },
  {
      routePath: "/api/admin/calendar/appointments/:id",
      mountPath: "/api/admin/calendar/appointments",
      method: "",
      middlewares: [],
      modules: [__api_admin_calendar_appointments__id__js_onRequest],
    },
  {
      routePath: "/api/admin/projects/:id/tasks",
      mountPath: "/api/admin/projects/:id",
      method: "",
      middlewares: [],
      modules: [__api_admin_projects__id__tasks_js_onRequest],
    },
  {
      routePath: "/api/admin/blog/categories",
      mountPath: "/api/admin/blog",
      method: "",
      middlewares: [],
      modules: [__api_admin_blog_categories_js_onRequest],
    },
  {
      routePath: "/api/admin/blog/posts",
      mountPath: "/api/admin/blog",
      method: "",
      middlewares: [],
      modules: [__api_admin_blog_posts_js_onRequest],
    },
  {
      routePath: "/api/admin/calendar/appointments",
      mountPath: "/api/admin/calendar",
      method: "",
      middlewares: [],
      modules: [__api_admin_calendar_appointments_js_onRequest],
    },
  {
      routePath: "/api/blog/posts/:slug",
      mountPath: "/api/blog/posts",
      method: "GET",
      middlewares: [],
      modules: [__api_blog_posts__slug__js_onRequestGet],
    },
  {
      routePath: "/api/admin/projects/:id",
      mountPath: "/api/admin/projects",
      method: "",
      middlewares: [],
      modules: [__api_admin_projects__id__js_onRequest],
    },
  {
      routePath: "/api/admin/attachment",
      mountPath: "/api/admin",
      method: "GET",
      middlewares: [],
      modules: [__api_admin_attachment_js_onRequestGet],
    },
  {
      routePath: "/api/admin/leads",
      mountPath: "/api/admin",
      method: "GET",
      middlewares: [],
      modules: [__api_admin_leads_js_onRequestGet],
    },
  {
      routePath: "/api/admin/login",
      mountPath: "/api/admin",
      method: "POST",
      middlewares: [],
      modules: [__api_admin_login_js_onRequestPost],
    },
  {
      routePath: "/api/admin/prices",
      mountPath: "/api/admin",
      method: "GET",
      middlewares: [],
      modules: [__api_admin_prices_js_onRequestGet],
    },
  {
      routePath: "/api/admin/prices",
      mountPath: "/api/admin",
      method: "PUT",
      middlewares: [],
      modules: [__api_admin_prices_js_onRequestPut],
    },
  {
      routePath: "/api/admin/suppliers",
      mountPath: "/api/admin",
      method: "DELETE",
      middlewares: [],
      modules: [__api_admin_suppliers_js_onRequestDelete],
    },
  {
      routePath: "/api/admin/suppliers",
      mountPath: "/api/admin",
      method: "GET",
      middlewares: [],
      modules: [__api_admin_suppliers_js_onRequestGet],
    },
  {
      routePath: "/api/admin/suppliers",
      mountPath: "/api/admin",
      method: "POST",
      middlewares: [],
      modules: [__api_admin_suppliers_js_onRequestPost],
    },
  {
      routePath: "/api/admin/suppliers",
      mountPath: "/api/admin",
      method: "PUT",
      middlewares: [],
      modules: [__api_admin_suppliers_js_onRequestPut],
    },
  {
      routePath: "/api/blog/categories",
      mountPath: "/api/blog",
      method: "GET",
      middlewares: [],
      modules: [__api_blog_categories_js_onRequestGet],
    },
  {
      routePath: "/api/blog/posts",
      mountPath: "/api/blog",
      method: "GET",
      middlewares: [],
      modules: [__api_blog_posts_js_onRequestGet],
    },
  {
      routePath: "/api/admin/projects",
      mountPath: "/api/admin",
      method: "",
      middlewares: [],
      modules: [__api_admin_projects_js_onRequest],
    },
  {
      routePath: "/api/contact",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_contact_js_onRequestPost],
    },
  {
      routePath: "/api/schedule",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_schedule_js_onRequestPost],
    },
  ]