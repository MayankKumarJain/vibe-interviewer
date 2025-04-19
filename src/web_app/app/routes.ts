import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route(":meetingId", "routes/signin.tsx"),
] satisfies RouteConfig;
