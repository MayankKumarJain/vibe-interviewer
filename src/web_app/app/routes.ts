import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("signin", "routes/SignIn.tsx"),
  route("hirenauts/meet/:meetingId", "routes/PrivateRoute.tsx", [
    index("routes/Meeting.tsx"),
    route("join", "routes/JoinMeeting.tsx"),
  ]),
] satisfies RouteConfig;
