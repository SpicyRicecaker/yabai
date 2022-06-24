import { closeMainWindow } from "@raycast/api";
import { execSync } from "child_process";
import { showHUD } from "@raycast/api";
import path from "path";

// for some reason yabai requires the $USER environment variable to be set, so
// we get it from the home path
const userEnvironment: string = `env USER=${path.basename(process.env.HOME as string)}`;
// TODO ideally this should probably be a user config, since not all users
// install with brew
const yabaiExecutable: string = "/opt/homebrew/bin/yabai";
const prefix = `${userEnvironment} ${yabaiExecutable}`

export async function defaultRunCommand(command: string) {  
    await closeMainWindow();
    try {
        execSync(`${prefix} -m ${command}`);
    } catch (e) {
        await showHUD(`${e.stderr}`);
    };
}
