import { readFileSync, writeFileSync } from "fs";
import { parse as parseToml } from "toml";


interface Command {
    name: string,
    title: string,
    description: string,
    command: string,
    directions?: string[]
}


// commands we inject into package.json
// each command entry in `package.json` contains the following properties:
// {
//   "name": "",
//   "title": "",
//   "subtitle": "Yabai",
//   "description": "",
//   "mode": "no-view"
// }
interface OutCommand {
    name: string,
    title: string,
    // constant, alwys "Yabai"
    subtitle: string,
    description: string,
    // constant, always `no-view`
    mode: string,
}


function writeCommand(command: Command, outCommands: OutCommand[]) {
    // create file at path `src/${}`
    // not sure if you need to await at end of func
    writeFileSync(`src/${command.name}.tsx`, `import {defaultRunCommand} from "./yabai";
export default async (): Promise<void> => {
await defaultRunCommand("${command.command}");
};`);

    outCommands.push({
        name: command.name,
        title: command.title,
        subtitle: "Yabai",
        description: command.description,
        mode: "no-view"
    })
}

function capitalize(str: string): string {
    return `${str.charAt(0).toUpperCase()}${str.slice(1)}`
}

(() => {
    const content = readFileSync("extern/commands.toml").toString();
    let commands: Command[] = parseToml(content).commands;
    let outCommands: OutCommand[] = [];

    for (const command of commands) {
        if (command.directions) {
            for (const direction of command.directions) {
                writeCommand({
                    name: command.name.replace("DIRECTION", direction),
                    title: command.title.replace("DIRECTION", capitalize(direction)),
                    description: command.description.replace("DIRECTION", direction),
                    command: command.command.replace("DIRECTION", direction)
                }, outCommands);
            }
        } else {
            writeCommand(command, outCommands);
        }
    };

    // read in package.json
    let packageJson = JSON.parse(readFileSync("package.json").toString());
    packageJson.commands = outCommands;
    writeFileSync("package.json", JSON.stringify(packageJson));
})();
