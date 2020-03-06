"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Moment = require("moment");
const mustache_1 = require("mustache");
const fs_1 = require("fs");
require("path");
const path_1 = require("path");
class LicenseTemplate {
    get year() {
        return this._year;
    }
    set year(value) {
        this._year = value;
    }
    get author() {
        return this._author;
    }
    set author(value) {
        this._author = value;
    }
    constructor(year, author) {
        this._year = year;
        this._author = author;
    }
    render(licenseTemplateText) {
        return mustache_1.render(licenseTemplateText, { year: this._year, author: this._author });
    }
}
exports.LicenseTemplate = LicenseTemplate;
var LicenseType;
(function (LicenseType) {
    LicenseType[LicenseType["MIT"] = 0] = "MIT";
    LicenseType[LicenseType["APACHE_2_0"] = 1] = "APACHE_2_0";
    LicenseType[LicenseType["BSD_3_CLAUSE_LICENSE"] = 2] = "BSD_3_CLAUSE_LICENSE";
    LicenseType[LicenseType["GNU"] = 3] = "GNU";
})(LicenseType = exports.LicenseType || (exports.LicenseType = {}));
function getAsLicenseType(txt) {
    if (txt.toLowerCase() === 'mit')
        return LicenseType.MIT;
    if (txt.toLowerCase() === 'apache_2_0' || txt.toLowerCase() === 'apache2.0')
        return LicenseType.APACHE_2_0;
    if (txt.toLowerCase() === 'bsd_3_clause_license' || txt.toLowerCase() === 'bsd3')
        return LicenseType.BSD_3_CLAUSE_LICENSE;
    if (txt.toLowerCase() === 'gnu')
        return LicenseType.GNU;
    return LicenseType.MIT;
}
exports.getAsLicenseType = getAsLicenseType;
function createLicenseText(author, licenseType) {
    let year = Moment().format('YYYY');
    let licenseTemplate = new LicenseTemplate(year, author);
    switch (licenseType) {
        case LicenseType.BSD_3_CLAUSE_LICENSE:
            return getBsd3ClauseLicenseText(licenseTemplate);
        case LicenseType.GNU:
            return getGnuLicenseText(licenseTemplate);
        case LicenseType.APACHE_2_0:
            return getApache2LicenseText(licenseTemplate);
        case LicenseType.MIT:
        default:
            return getMitLicenseText(licenseTemplate);
    }
}
exports.createLicenseText = createLicenseText;
function getBsd3ClauseLicenseText(licenseTemplate) {
    try {
        let licenseText = fs_1.readFileSync(path_1.resolve(__dirname, '../resources/bsd-3.0.txt'), 'utf8');
        return licenseTemplate.render(licenseText);
    }
    catch (e) {
        console.error('Error: ', e.stack);
    }
    return `COULDN'T LOAD BSD 3 CLAUSE LICENSE`;
}
function getGnuLicenseText(licenseTemplate) {
    try {
        let licenseText = fs_1.readFileSync(path_1.resolve(__dirname, '../resources/gnu.txt'), 'utf8');
        return licenseTemplate.render(licenseText);
    }
    catch (e) {
        console.error('Error: ', e.stack);
    }
    return `COULDN'T LOAD GNU LICENSE`;
}
function getApache2LicenseText(licenseTemplate) {
    try {
        let licenseText = fs_1.readFileSync(path_1.resolve(__dirname, '../resources/apache-2.0.txt'), 'utf8');
        return licenseTemplate.render(licenseText);
    }
    catch (e) {
        console.error('Error: ', e.stack);
    }
    return `COULDN'T LOAD APACHE 2.0 LICENSE`;
}
function getMitLicenseText(licenseTemplate) {
    try {
        let licenseText = fs_1.readFileSync(path_1.resolve(__dirname, '../resources/mit.txt'), 'utf8');
        return licenseTemplate.render(licenseText);
    }
    catch (e) {
        console.error('Error: ', e.stack);
    }
    return `COULDN'T LOAD MIT LICENSE`;
}
//# sourceMappingURL=license.js.map