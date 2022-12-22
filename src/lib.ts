import * as fs from 'fs';
import * as YAML from 'yaml';
import * as core from '@actions/core';

type YamlerOptions = {
  file: string;
  path: string;
  set: any;
  get: boolean;
  append: boolean;
  flat: boolean;
  workspace: string;
};

function getOptions(): YamlerOptions {
  const inAct = !!process.env.ACT;
  return {
    file: core.getInput('file', { required: true }),
    path: core.getInput('path', { required: false }),
    set: core.getInput('set', { required: false }),
    get: core.getBooleanInput('get', { required: false }),
    append: core.getBooleanInput('append', { required: false }),
    flat: core.getBooleanInput('flat', { required: false }),
    workspace: `${process.env.GITHUB_WORKSPACE}${inAct ? '/action-yamler' : ''}`,
  };
}

export function handleAction() {
  try {
    const opts = getOptions();
    if (opts.flat) {
      core.info('Handling version in flat-file.');
      handleValueFile(opts);
    } else {
      core.info('Handling version in YAML.');
      handleYamlFile(opts);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

function handleValueFile(opts: YamlerOptions) {
  let contents = fs.readFileSync(opts.file, 'utf-8');
  if (contents) contents = contents.trim();

  if (opts.get) {
    core.setOutput('value_old', contents);
    core.info(`Found "${contents}" in "${opts.file}"`);
  }
  if (!!opts.set) {
    const setValue = opts.append ? `${contents}${opts.set}` : opts.set;
    contents = setValue;
    core.info(`Set "${setValue}" in "${opts.file}"`);
    if (opts.get) core.setOutput('value_new', contents);
  }
  fs.writeFileSync(opts.file, contents);
}

function handleYamlFile(opts: YamlerOptions) {
  if (!opts.path || opts.path == '') {
    throw Error('A path is required when flat is not set to true.');
  }

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
}
