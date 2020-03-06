"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode_1 = require("vscode");
const topper_1 = require("./topper");
const optional_1 = require("../util/optional");
const fs_1 = require("fs");
const Moment = require("moment");
const BlueBird = require("bluebird");
const license_1 = require("./license");
function addTopHeader(profileName) {
    if (!profileName || profileName.length < 1) {
        console.error('profile name cannot be null or empty!');
        return;
    }
    const editor = vscode_1.window.activeTextEditor;
    if (!editor) {
        console.error("The reference to the TextEditor couldn't be fetched, bailing out...!");
        return;
    }
    const documentMetadata = extractFileMetadata(editor.document);
    const intrinsicParams = new topper_1.TopperProvidedParam(null, null, documentMetadata.fileName, documentMetadata.fileVersion);
    const headerTemplates = vscode_1.workspace.getConfiguration(topper_1.TOPPER).get(topper_1.HEADER_TEMPLATES);
    const customTemplateParameters = vscode_1.workspace.getConfiguration(topper_1.TOPPER).get(topper_1.CUSTOM_TEMPLATE_PARAMETERS);
    if (!customTemplateParameters || !headerTemplates) {
        console.error("Couldn't load the header templates or custom template parameters!");
        return;
    }
    let selectedTemplateParameter = customTemplateParameters
        .filter(customTemplateParameter => topper_1.getProfileName(customTemplateParameter) === profileName)
        .find((_, index) => index === 0);
    if (!selectedTemplateParameter) {
        console.info('Selecting the first custom template param in the list since no specific profile was selected!');
        selectedTemplateParameter = customTemplateParameters[0];
    }
    let profileTemplate = selectedTemplateParameter[profileName];
    if (!profileTemplate) {
        console.error("Couldn't fetch the desired profile template!");
        return;
    }
    let selectedHeaderTemplate = getSelectedHeaderTemplate(headerTemplates, documentMetadata.languageId);
    const headerLines = [];
    fetchAndUpdateCreatedAndModifiedDates(intrinsicParams, documentMetadata.filePath)
        .then(() => makeHeaderString(selectedHeaderTemplate, profileTemplate, intrinsicParams, headerLines))
        .then((value) => publishHeaderString(editor, value.r, value.c, headerLines.join('\n')))
        .catch(err => console.error(err));
}
exports.addTopHeader = addTopHeader;
function extractFileMetadata(doc) {
    return {
        filePath: doc.uri.fsPath,
        fileName: path.parse(doc.uri.fsPath).base,
        fileVersion: doc.version,
        languageId: doc.languageId,
    };
}
function getSelectedHeaderTemplate(headerTemplates, languageId) {
    for (let headerTemplate of headerTemplates) {
        for (let key in headerTemplate) {
            if (languageId.toLowerCase() === key.toLowerCase()) {
                return headerTemplate[languageId];
            }
        }
    }
    return getDefaultHeaderTemplate();
}
function getDefaultHeaderTemplate() {
    const defaultHeaderTemplate = vscode_1.workspace.getConfiguration(topper_1.TOPPER).get(topper_1.DEFAULT_HEADER_TEMPLATE);
    if (defaultHeaderTemplate) {
        return defaultHeaderTemplate[topper_1.DEFAULT_LANGUAGE_ID];
    }
    return new topper_1.LanguageHeaderTemplate('/**', '*', '*/', [
        '${headerBegin}',
        '${headerPrefix} ${fileName}',
        '${headerPrefix} @author ${author}',
        '${headerPrefix} @description ${description}',
        '${headerPrefix} @created ${createdDate}',
        '${headerPrefix} @copyright ${copyright}',
        '${headerPrefix} @last-modified ${lastModifiedDate}',
        '${headerEnd}',
    ]);
}
function fetchAndUpdateCreatedAndModifiedDates(intrinsicParams, filePath) {
    return BlueBird.promisify(fs_1.stat)(filePath).then(fileStats => {
        let dateFormat = vscode_1.workspace.getConfiguration(topper_1.TOPPER).get(topper_1.DATE_FORMAT);
        if (!dateFormat) {
            dateFormat = topper_1.DEFAULT_DATETIME_FORMAT;
        }
        if (!fileStats) {
            let now = Moment().format(dateFormat);
            if (!now) {
                console.error("Couldn't fetch the last modified datetime!");
                return;
            }
            intrinsicParams.createdDate = now;
            intrinsicParams.lastModifiedDate = now;
        }
        else {
            const createdDateTime = fileStats.birthtime;
            const modifiedDateTime = fileStats.mtime;
            intrinsicParams.createdDate = Moment(createdDateTime).format(dateFormat);
            intrinsicParams.lastModifiedDate = Moment(modifiedDateTime).format(dateFormat);
        }
    });
}
function makeHeaderString(selectedHeaderTemplate, selectedTemplateParameter, intrinsicParams, headerLines) {
    const template = selectedHeaderTemplate.template;
    template.forEach(templateLine => {
        let tokens = templateLine.split(' ');
        let headerLine = [];
        tokens.filter(token => {
            if (!token.startsWith('${')) {
                headerLine.push(token);
                return;
            }
            let tokenName = optional_1.Optional.ofNullable(token.match(/\$\{(.*)\}/))
                .map(match => {
                if (match)
                    return match[1];
            })
                .orElse(token);
            let tokenValue = '';
            let author = selectedTemplateParameter['author'];
            if (!author)
                author = "Author's Full Name goes here";
            if (tokenName in selectedTemplateParameter) {
                tokenValue = selectedTemplateParameter[tokenName];
                if (tokenName === 'license') {
                    let licenseText = license_1.createLicenseText(author, license_1.getAsLicenseType(tokenValue));
                    tokenValue = licenseText;
                }
            }
            else if (tokenName in selectedHeaderTemplate) {
                switch (tokenName) {
                    case 'headerBegin':
                        tokenValue = selectedHeaderTemplate.headerBegin;
                        break;
                    case 'headerPrefix':
                        tokenValue = selectedHeaderTemplate.headerPrefix;
                        break;
                    case 'headerEnd':
                        tokenValue = selectedHeaderTemplate.headerEnd;
                        break;
                    default:
                        tokenValue = token;
                        break;
                }
            }
            else if (tokenName in intrinsicParams) {
                switch (tokenName) {
                    case 'createdDate':
                        tokenValue = intrinsicParams.createdDate;
                        break;
                    case 'fileName':
                        tokenValue = intrinsicParams.fileName;
                        break;
                    case 'fileVersion':
                        tokenValue = `${intrinsicParams.fileVersion}`;
                        break;
                    case 'lastModifiedDate':
                        tokenValue = intrinsicParams.lastModifiedDate;
                        break;
                    default:
                        tokenValue = token;
                        break;
                }
            }
            tokenValue = tokenValue.replace(/\n/g, `\n${selectedHeaderTemplate.headerPrefix}`);
            headerLine.push(tokenValue);
        });
        headerLines.push(headerLine.join(' '));
    });
    let rowIndex = vscode_1.workspace.getConfiguration(topper_1.TOPPER).get(topper_1.INSERT_AT_ROW);
    if (!rowIndex || rowIndex < -1) {
        rowIndex = 0;
    }
    let colIndex = vscode_1.workspace.getConfiguration(topper_1.TOPPER).get(topper_1.INSERT_AT_COL);
    if (!colIndex || colIndex < -1) {
        colIndex = 0;
    }
    return new BlueBird((resolve, _2) => {
        if (rowIndex != undefined && colIndex != undefined) {
            console.debug(`rowIndex = ${rowIndex} and colIndex = ${colIndex}`);
            resolve({ r: rowIndex, c: colIndex });
        }
        else {
            BlueBird.reject(new Error('rowIndex and colIndex were not numbers!'));
        }
    });
}
function publishHeaderString(editor, rowIndex, colIndex, headerString) {
    editor.edit(editBuilder => {
        editBuilder.insert(new vscode_1.Position(rowIndex, colIndex), `${headerString}\n\n`);
    });
    return new BlueBird((_1, _2) => null);
}
//# sourceMappingURL=service.js.map