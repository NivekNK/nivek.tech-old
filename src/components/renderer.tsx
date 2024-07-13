import { Outlet } from "@tanstack/react-router";
import { CurrentCommand, pipe } from "@/lib/commands";

interface Props {
    currentCommand: CurrentCommand;
}

export function Renderer({ currentCommand }: Props) {
    if (currentCommand.type === "render") {
        const result = pipe(currentCommand) as JSX.Element;
        return <div>{result}</div>;
    }

    return <Outlet />;
}
