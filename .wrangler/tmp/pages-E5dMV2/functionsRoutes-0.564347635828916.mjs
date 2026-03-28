import { onRequestGet as __api_admin_attachment_js_onRequestGet } from "C:\\Users\\fredd\\Documents\\jessica_da_horta_web\\functions\\api\\admin\\attachment.js"
import { onRequestGet as __api_admin_leads_js_onRequestGet } from "C:\\Users\\fredd\\Documents\\jessica_da_horta_web\\functions\\api\\admin\\leads.js"
import { onRequestPost as __api_admin_login_js_onRequestPost } from "C:\\Users\\fredd\\Documents\\jessica_da_horta_web\\functions\\api\\admin\\login.js"
import { onRequestGet as __api_admin_prices_js_onRequestGet } from "C:\\Users\\fredd\\Documents\\jessica_da_horta_web\\functions\\api\\admin\\prices.js"
import { onRequestPut as __api_admin_prices_js_onRequestPut } from "C:\\Users\\fredd\\Documents\\jessica_da_horta_web\\functions\\api\\admin\\prices.js"
import { onRequestDelete as __api_admin_suppliers_js_onRequestDelete } from "C:\\Users\\fredd\\Documents\\jessica_da_horta_web\\functions\\api\\admin\\suppliers.js"
import { onRequestGet as __api_admin_suppliers_js_onRequestGet } from "C:\\Users\\fredd\\Documents\\jessica_da_horta_web\\functions\\api\\admin\\suppliers.js"
import { onRequestPost as __api_admin_suppliers_js_onRequestPost } from "C:\\Users\\fredd\\Documents\\jessica_da_horta_web\\functions\\api\\admin\\suppliers.js"
import { onRequestPut as __api_admin_suppliers_js_onRequestPut } from "C:\\Users\\fredd\\Documents\\jessica_da_horta_web\\functions\\api\\admin\\suppliers.js"
import { onRequestPost as __api_contact_js_onRequestPost } from "C:\\Users\\fredd\\Documents\\jessica_da_horta_web\\functions\\api\\contact.js"
import { onRequestPost as __api_schedule_js_onRequestPost } from "C:\\Users\\fredd\\Documents\\jessica_da_horta_web\\functions\\api\\schedule.js"

export const routes = [
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