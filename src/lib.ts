import * as fs from 'fs';
import * as YAML from 'yaml';
import * as core from '@actions/core';

type YamlerOptions = {
  file: string;
  path: string;
  set: any;
  get: boolean;
  append: boolean;
};

function getOptions(): YamlerOptions {
  return {
    file: core.getInput('file', { required: true }),
    path: core.getInput('path', { required: true }),
    set: core.getInput('set', { required: false }),
    get: core.getBooleanInput('get', { required: false }),
    append: core.getBooleanInput('append', { required: false }),
  };
}

export function handleAction() {
  try {
    const opts = getOptions();
    const yaml = YAML.parse(fs.readFileSync(opts.file, 'utf-8'));

    var node = yaml;
    const parts = opts.path.split('.');
    while (parts.length > 1 && !!node) {
      const part = parts.shift();
      node = node[part];
    }
    const part = parts.shift();
    const pathValue = node[part];

    if (opts.get) {
      core.setOutput('value_old', pathValue);
      core.info(`Found "${pathValue}" @ "${opts.path}"`);
    }
    if (!!opts.set) {
      const setValue = opts.append ? `${node[part]}${opts.set}` : opts.set;
      node[part] = setValue;
      core.info(`Set "${setValue}" @ "${opts.path}"`);
      if (opts.get) core.setOutput('value_new', node[part]);
    }
    fs.writeFileSync(opts.file, YAML.stringify(yaml));
  } catch (error) {
    core.setFailed(error.message);
  }
}
