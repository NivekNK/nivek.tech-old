import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/about")({
    component: About,
});

export function About() {
    return <div className="p-2 flex-1">Hello from About!</div>;
}
