import {
  type RouteConfig,
  route,
  index,
} from "@react-router/dev/routes";

export default [
  index("./routes/_index.tsx"),
  route("pokemon/:name", "./routes/pokemon.$name.tsx"),
] satisfies RouteConfig;
