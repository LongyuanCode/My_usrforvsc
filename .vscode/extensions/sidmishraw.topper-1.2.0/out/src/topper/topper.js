"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOPPER = 'topper';
exports.TOPPER_ADD_TOP_HEADER_CMD_BASE = 'topper.addTopHeader';
function makeAddTopHeaderCmd(profileName) {
    return `${exports.TOPPER_ADD_TOP_HEADER_CMD_BASE}.${profileName}`;
}
exports.makeAddTopHeaderCmd = makeAddTopHeaderCmd;
function defaultAddTopHeaderCmd() {
    return `${exports.TOPPER_ADD_TOP_HEADER_CMD_BASE}`;
}
exports.defaultAddTopHeaderCmd = defaultAddTopHeaderCmd;
exports.CUSTOM_TEMPLATE_PARAMETERS = 'customTemplateParameters';
exports.HEADER_TEMPLATES = 'headerTemplates';
exports.DEFAULT_HEADER_TEMPLATE = 'defaultHeaderTemplate';
exports.DEFAULT_LANGUAGE_ID = 'default';
exports.FILE_NAME = 'fileName';
exports.CREATED_DATE = 'createdDate';
exports.LAST_MODIFIED_DATE = 'lastModifiedDate';
exports.LAST_MODIFIED_DATE_KEY = 'lastModified';
exports.DEFAULT_LAST_MODIFIED_KEY = '@last-modified';
exports.LAST_MODIFIED_CAPTURE_REGEX = 'lastModifiedRegex';
exports.DEFAULT_LAST_MODIFIED_CAPURE_REGEX = new RegExp('[ ]*\\@last\\-modified\\s*.?\\s+((\\d{4}-\\d{2}-\\d{2})T(\\d{2}:\\d{2}:\\d{2}\\.\\d{3})Z([\\+\\-]?\\d{2}:\\d{2}))\\n*');
exports.DATE_FORMAT = 'dateFormat';
exports.DEFAULT_DATETIME_FORMAT = 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]Z';
exports.INSERT_AT_ROW = 'insertAtRow';
exports.INSERT_AT_COL = 'insertAtCol';
function getProfileName(customTemplateParameter) {
    return Object.getOwnPropertyNames(customTemplateParameter)[0];
}
exports.getProfileName = getProfileName;
class LanguageHeaderTemplate {
    constructor(headerBegin, headerPrefix, headerEnd, template) {
        this._headerBegin = headerBegin;
        this._headerPrefix = headerPrefix;
        this._headerEnd = headerEnd;
        this._template = template;
    }
    get headerBegin() {
        return this._headerBegin;
    }
    set headerBegin(headerBegin) {
        this._headerBegin = headerBegin;
    }
    get headerPrefix() {
        return this._headerPrefix;
    }
    set headerPrefix(headerPrefix) {
        this._headerPrefix = headerPrefix;
    }
    get headerEnd() {
        return this._headerEnd;
    }
    set headerEnd(headerEnd) {
        this._headerEnd = headerEnd;
    }
    get template() {
        return this._template;
    }
    set template(template) {
        this._template = template;
    }
}
exports.LanguageHeaderTemplate = LanguageHeaderTemplate;
class TopperProvidedParam {
    constructor(createdDate, lastModifiedDate, fileName, fileVersion) {
        if (createdDate)
            this._createdDate = createdDate;
        else
            this._createdDate = '';
        if (lastModifiedDate)
            this._lastModifiedDate = lastModifiedDate;
        else
            this._lastModifiedDate = '';
        this._fileName = fileName;
        this._fileVersion = fileVersion;
    }
    get createdDate() {
        return this._createdDate;
    }
    set createdDate(s) {
        this._createdDate = s;
    }
    get lastModifiedDate() {
        return this._lastModifiedDate;
    }
    set lastModifiedDate(s) {
        this._lastModifiedDate = s;
    }
    get fileName() {
        return this._fileName;
    }
    get fileVersion() {
        return this._fileVersion;
    }
}
exports.TopperProvidedParam = TopperProvidedParam;
//# sourceMappingURL=topper.js.map