import { Link } from "@tanstack/react-router";
import { CurrentCommand, GetReturn, pipe } from "@/lib/commands";

interface Props {
    currentCommand: CurrentCommand;
}

export function Navbar({ currentCommand }: Props) {
    let result = pipe(currentCommand) as GetReturn;
    result = result?.filter((value) => value !== undefined);

    return (
        <div className="px-7 pt-1 flex flex-col">
            {result &&
                result.map((value) => (
                    <Link key={value.name} to={value.href} className="[&.active]:font-bold">
                        {value.name}
                    </Link>
                ))}
        </div>
    );
}
