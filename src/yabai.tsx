import { closeMainWindow } from "@raycast/api";
import { exec, execSync } from "child_process";
import path from "path";

// ideally this should probably be a user config


// for some reason yabai requires the $USER environment variable to be set, so
// we get it from the home path
const userEnvironment: string = `env USER=${path.basename(process.env.HOME as string)}`;
const yabaiExecutable: string = "/opt/homebrew/bin/yabai";
const prefix = `${userEnvironment} ${yabaiExecutable}`

export function yabaiMaximize() {
    closeMainWindow();
    execSync(`${prefix} -m window --toggle zoom-fullscreen`);
}