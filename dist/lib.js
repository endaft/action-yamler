"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAction = void 0;
const fs = require("fs");
const YAML = require("yaml");
const core = require("@actions/core");
function getOptions() {
    return {
        file: core.getInput('file', { required: true }),
        path: core.getInput('path', { required: true }),
        set: core.getInput('set', { required: false }),
        get: core.getBooleanInput('get', { required: false }),
        append: core.getBooleanInput('append', { required: false }),
    };
}
function handleAction() {
    try {
        const opts = getOptions();
        const yaml = YAML.parse(fs.readFileSync(opts.file, 'utf-8'));
        var node = yaml;
        const parts = opts.path.split('.');
        while (parts.length > 1) {
            const part = parts.shift();
            node = node[part];
        }
        const part = parts.shift();
        const pathValue = node[part];
        if (opts.get)
            core.setOutput('value_old', pathValue);
        if (!!opts.set) {
            node[part] = opts.append ? `${node[part]}${opts.set}` : opts.set;
            if (opts.get)
                core.setOutput('value_new', node[part]);
        }
        fs.writeFileSync(opts.file, YAML.stringify(yaml));
    }
    catch (error) {
        core.setFailed(error.message);
    }
}
exports.handleAction = handleAction;
