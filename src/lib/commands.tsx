import React from "react";
import { Index } from "@/routes/index.lazy";
import { About } from "@/routes/about.lazy";

type Fn = (...args: any[]) => any;
type PipeInput = any[] | number | string | Fn | undefined;

type PipeReturnType<T extends any[]> =
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    T extends [...infer _, infer Last]
        ? Last extends (...args: any[]) => infer FunctionReturn
            ? FunctionReturn
            : Last
        : never;

const canBeNumber = (str: string): boolean => {
    if (str.trim() === "") {
        return false; // An empty string cannot be cast to a number
    }
    const num = parseFloat(str);
    return !isNaN(num);
};

const realPipe = <Value, Ops extends PipeInput[]>(value: Value, operations: Ops) => {
    if (!operations) return value;

    let results: any[] = [];
    return operations.reduce<any>((prev, next) => {
        if (
            Array.isArray(prev) &&
            (typeof next === "number" || (typeof next === "string" && canBeNumber(next)))
        ) {
            const index = typeof next === "number" ? next : parseFloat(next);
            return prev[index];
        } else if (Array.isArray(prev) && typeof next === "string") {
            results = prev;
            return next;
        } else if (typeof next === "function") {
            if (results.length > 0) {
                const values = results.concat(next(prev));
                results = [];
                return values;
            } else {
                return next(prev);
            }
        } else {
            return undefined;
        }
    }, value) as PipeReturnType<Ops>;
};

interface IRoute {
    name: string;
    href: string;
    component: React.FC;
}

type GetValue = "routes" | "projects";
export type GetReturn = IRoute[] | undefined;

function get(value: GetValue): GetReturn {
    switch (value) {
        case "routes":
            return [
                {
                    name: "Home",
                    href: "/",
                    component: Index,
                },
                {
                    name: "About",
                    href: "/about",
                    component: About,
                },
            ];
        case "projects":
            return [
                {
                    name: "nk-engine",
                    href: "/projects/nk-engine",
                    component: About,
                },
            ];
        default:
            return [];
    }
}

interface RenderData {
    component: React.FC;
}

function render<T extends RenderData>(data: T[] | T | undefined): JSX.Element {
    if (Array.isArray(data)) {
        return (
            <div className="w-full flex">
                {data.map((value, index) => (
                    <value.component key={index}></value.component>
                ))}
            </div>
        );
    } else if (!data) {
        return <div className="p-2 flex-1">ERROR</div>;
    } else {
        return <data.component></data.component>;
    }
}

function getCommand(value: CommandType) {
    switch (value) {
        case "get":
            return get;
        case "render":
            return render;
        default:
            return value;
    }
}

export const keywords = ["get", "render"] as const;

// Define the type based on the array elements
export type CommandType = (typeof keywords)[number];

export interface ICommand {
    keyword: CommandType;
    action?: string | number;
}

export interface CurrentCommand {
    type: CommandType | "none";
    commands: ICommand[];
}

export const pipe = (currentCommand: CurrentCommand) => {
    const values = [];
    for (let i = 0; i < currentCommand.commands.length; i++) {
        if (currentCommand.commands[i].action) {
            values.push(currentCommand.commands[i].action);
        }
        values.push(getCommand(currentCommand.commands[i].keyword));
    }

    switch (currentCommand.type) {
        case "get":
            return realPipe(values[0], values.slice(1)) as GetReturn;
        case "render":
            return realPipe(values[0], values.slice(1)) as unknown as JSX.Element;
        default:
            return undefined;
    }
};
