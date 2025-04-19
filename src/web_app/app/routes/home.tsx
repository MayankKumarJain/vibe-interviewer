import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Grid Interview" },
    {
      name: "description",
      content: "Application to take interviews at Grid Dynamics",
    },
  ];
}

export default function Home() {
  return <Welcome />;
}
