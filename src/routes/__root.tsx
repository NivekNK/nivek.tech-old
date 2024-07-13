import { createRootRoute } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CommandType, keywords, ICommand, CurrentCommand } from "@/lib/commands";
import { Navbar } from "@/components/navbar";
import { Renderer } from "@/components/renderer";

function Root() {
    const editableDiv = useRef<HTMLDivElement>(null);
    const [divText, setDivText] = useState<string[]>([]);
    const [commands, setCommands] = useState<ICommand[]>([]);
    const [currentCommand, setCurrentCommand] = useState<CurrentCommand>({
        type: "none",
        commands: [],
    });

    const highlightText = (text: string[]) => {
        let content: string = "";

        for (let i = 0; i < text.length; i++) {
            if ((i === 0 || text[i - 2] === "|") && keywords.includes(text[i] as CommandType)) {
                content += `<p class="text-red-500">${text[i]}</p>`;
            } else if (text[i] === " ") {
                content += "<div class='pl-1'></div>";
            } else {
                content += `<p class="text-white">${text[i]}</p>`;
            }
        }

        return content;
    };

    const setCaretToEnd = () => {
        const el = editableDiv.current;
        if (!el) return;

        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(el);
        range.collapse(false);
        sel?.removeAllRanges();
        sel?.addRange(range);
        el.focus();
    };

    const parseCommands = (text: string[]): ICommand[] => {
        text = text.filter(str => str.trim() !== "");
        const commands: ICommand[] = [];

        const lastCommand = text.reduce((prev, next) => {
            if (keywords.find(v => v === prev)) {
                commands.push({
                    keyword: prev as CommandType,
                    action: next === "|" ? undefined : next,
                });
                return "commited-command";
            } else if (prev === "commited-command" || prev === "|") {
                return next;
            }
            return "commited-command";
        });
        
        if (keywords.find(v => v === lastCommand)) {
            commands.push({
                keyword: lastCommand as CommandType,
                action: undefined,
            })
        }

        return commands;
    };

    useEffect(() => {
        if (!editableDiv.current) return;

        editableDiv.current.innerHTML = highlightText(divText);
        setCaretToEnd();

        if (divText.length < 3) return;

        const commands = parseCommands(divText);
        setCommands(commands);
    }, [divText]);

    const onInput = () => {
        if (!editableDiv.current) return;

        // Split the oration by words and whitespaces
        const parts = editableDiv.current.innerText.match(/\S+|\s+/g) || [];

        let sendCommand = false;
        if (parts[parts.length - 1].includes("\n")) {
            parts.pop();
            sendCommand = true;
        }

        // Iterate over the parts and replace any whitespace with a single space
        const result = parts.map((part) => (part.trim() === "" ? " " : part));
        setDivText(result);

        if (sendCommand && commands.length > 0) {
            setCurrentCommand({
                type: commands[commands.length - 1].keyword,
                commands: commands,
            });
        }
    };

    return (
        <div className="h-screen bg-[#181a1b] text-[#cecac3]">
            <div className="flex flex-col h-full">
                <div>
                    <div className="flex items-center">
                        <ChevronRight className="mr-1" />
                        <div
                            className="bg-transparent h-6 w-full border-none flex"
                            contentEditable="true"
                            ref={editableDiv}
                            onInput={onInput}
                        ></div>
                    </div>
                    {currentCommand.type === "get" && (
                        <Navbar currentCommand={currentCommand}/>
                    )}
                </div>
                <Renderer currentCommand={currentCommand}/>
            </div>
        </div>
    );
}

export const Route = createRootRoute({
    component: Root,
});
