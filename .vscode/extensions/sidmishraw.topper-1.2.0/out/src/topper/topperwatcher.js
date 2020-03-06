"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const topper_1 = require("./topper");
const Moment = require("moment");
function startWatcher() {
    vscode_1.workspace.onWillSaveTextDocument(willSaveEvent => {
        try {
            const changedFileUri = willSaveEvent.document.uri;
            console.info(`Going to update the file at: ${changedFileUri.fsPath}`);
            updateLastModifiedDate(changedFileUri.fsPath);
        }
        catch (err) {
            console.log(`Error:: ${err}`);
        }
    });
}
exports.startWatcher = startWatcher;
function updateLastModifiedDate(filePath) {
    try {
        vscode_1.workspace.openTextDocument(filePath).then(modifiedTextDocument => {
            try {
                let lines = modifiedTextDocument.getText().split(/\n/);
                let lastModifiedKey = vscode_1.workspace.getConfiguration(topper_1.TOPPER).get(topper_1.LAST_MODIFIED_DATE_KEY);
                if (!lastModifiedKey) {
                    lastModifiedKey = topper_1.DEFAULT_LAST_MODIFIED_KEY;
                }
                let lastModifiedRegexPattern = vscode_1.workspace.getConfiguration(topper_1.TOPPER).get(topper_1.LAST_MODIFIED_CAPTURE_REGEX);
                let lastModifiedRegex;
                if (lastModifiedRegexPattern) {
                    lastModifiedRegex = new RegExp(lastModifiedRegexPattern);
                }
                else {
                    lastModifiedRegex = topper_1.DEFAULT_LAST_MODIFIED_CAPURE_REGEX;
                }
                let lastModifiedDateLine = lines.filter(line => line.match(lastModifiedRegex)).find((_, index) => index == 0);
                if (!lastModifiedDateLine) {
                    console.info('no topper header present with last-updated field');
                    return;
                }
                let modifiedDateLineIndex = lines.indexOf(lastModifiedDateLine);
                let matchedDateTime = lastModifiedDateLine.match(lastModifiedRegex);
                let matchedDateTimeText;
                if (matchedDateTime) {
                    matchedDateTimeText = matchedDateTime[1];
                }
                else {
                    console.info("couldn't extract the date time part, bailing out!");
                    return;
                }
                let startIndex = lastModifiedDateLine.indexOf(matchedDateTimeText);
                let endIndex = startIndex + matchedDateTimeText.length;
                let replaceRange = new vscode_1.Range(new vscode_1.Position(modifiedDateLineIndex, startIndex), new vscode_1.Position(modifiedDateLineIndex, endIndex));
                const editor = vscode_1.window.activeTextEditor;
                if (!editor) {
                    console.info("couldn't get the reference to the active text editor, bailing out!");
                    return;
                }
                if (editor && editor.document !== modifiedTextDocument) {
                    console.info('the active file is not the modified file!');
                    return;
                }
                editor.edit(edit => {
                    try {
                        let dateFormat = vscode_1.workspace.getConfiguration(topper_1.TOPPER).get(topper_1.DATE_FORMAT);
                        if (!dateFormat) {
                            dateFormat = topper_1.DEFAULT_DATETIME_FORMAT;
                        }
                        edit.replace(replaceRange, Moment().format(dateFormat));
                    }
                    catch (err) {
                        console.error(`Failed to replace the old last modified date with new one! ${err}`);
                    }
                });
            }
            catch (err) {
                console.error(`Failed to extract and update the last modified date-time in the header.. ${err}`);
            }
        });
    }
    catch (err) {
        console.error(`Error while updating last modified date :: ${err}`);
    }
}
//# sourceMappingURL=topperwatcher.js.map