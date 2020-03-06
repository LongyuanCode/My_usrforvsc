"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const topperwatcher_1 = require("./topper/topperwatcher");
const topper_1 = require("./topper/topper");
const service_1 = require("./topper/service");
function activate(context) {
    console.info('topper is active!');
    topperwatcher_1.startWatcher();
    let customTemplateParameters = vscode_1.workspace.getConfiguration(topper_1.TOPPER).get(topper_1.CUSTOM_TEMPLATE_PARAMETERS);
    if (!customTemplateParameters) {
        console.info("Couldn't load the custom template parameters!");
        return;
    }
    customTemplateParameters.forEach((customTemplateParameter, index) => {
        let profileName = topper_1.getProfileName(customTemplateParameter);
        let addTopHeaderCmd = topper_1.makeAddTopHeaderCmd(profileName);
        console.info(`Registering the command with vscode:  ${addTopHeaderCmd}`);
        context.subscriptions.push(vscode_1.commands.registerCommand(addTopHeaderCmd, () => service_1.addTopHeader(profileName)));
        if (index === 0) {
            context.subscriptions.push(vscode_1.commands.registerCommand(topper_1.defaultAddTopHeaderCmd(), () => service_1.addTopHeader(profileName)));
        }
    });
}
exports.activate = activate;
function deactivate() {
    console.info('topper has deactivated! Bye!');
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map