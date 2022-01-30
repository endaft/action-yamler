import * as fs from 'fs';
import * as core from '@actions/core';
import { handleAction } from '../src/lib';

describe('Basic Tests', () => {
  it('Basic Top-level Op Works As Expected', () => {
    const patch = Date.now();
    const outputs: Record<string, string> = {};
    const inputs: Record<string, string> = {
      file: 'fake.yaml',
      path: 'version',
      set: `1.0.${patch}`,
      get: 'true',
      'fake.yaml': `name: endaft_core
description: The core library behind the EnDaft 'shared' library. Chock full of goodness within.
version: 0.0.1
homepage: https://endaft.dev

dependencies:
  meta: ^1.7.0
`,
    };

    const getInputSpy = jest.spyOn(core, 'getInput').mockImplementation((name: string) => {
      return inputs[name];
    });
    const getBooleanInputSpy = jest.spyOn(core, 'getBooleanInput').mockImplementation((name: string) => {
      return inputs[name]?.toLowerCase() === 'true';
    });
    const setOutputSpy = jest.spyOn(core, 'setOutput').mockImplementation((name: string, value: any) => {
      outputs[name] = value;
    });
    const setFailedSpy = jest.spyOn(core, 'setFailed').mockImplementation((message: string | Error) => {
      throw message instanceof Error ? message : new Error(message);
    });
    const readFileSyncSpy = jest.spyOn(fs, 'readFileSync').mockImplementation((path: string) => {
      return inputs[path];
    });
    const writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation((path: string, data: string) => {
      outputs[path] = data;
    });

    expect(handleAction).not.toThrow();

    expect(getInputSpy).toBeCalledTimes(3);
    expect(getBooleanInputSpy).toBeCalledTimes(1);
    expect(readFileSyncSpy).toBeCalled();
    expect(setOutputSpy).toBeCalledTimes(2);
    expect(setFailedSpy).toBeCalledTimes(0);
    expect(writeFileSyncSpy).toBeCalled();
    expect(outputs['value_old']).toEqual('0.0.1');
    expect(outputs['value_new']).toEqual(`1.0.${patch}`);
    expect(outputs[inputs['file']]).toBeDefined();
    [getInputSpy, getBooleanInputSpy, setOutputSpy, setFailedSpy, readFileSyncSpy, writeFileSyncSpy].forEach((s) => {
      s.mockRestore();
    });
  });

  it('Basic Nested-Path Op Works As Expected', () => {
    const patch = Date.now();
    const outputs: Record<string, string> = {};
    const inputs: Record<string, string> = {
      file: 'fake.yaml',
      path: 'dependencies.meta',
      set: `^2.0.${patch}`,
      get: 'true',
      'fake.yaml': `name: endaft_core
description: The core library behind the EnDaft 'shared' library. Chock full of goodness within.
version: 0.0.1
homepage: https://endaft.dev

dependencies:
  meta: ^1.7.0
`,
    };

    const getInputSpy = jest.spyOn(core, 'getInput').mockImplementation((name: string) => {
      return inputs[name];
    });
    const getBooleanInputSpy = jest.spyOn(core, 'getBooleanInput').mockImplementation((name: string) => {
      return inputs[name]?.toLowerCase() === 'true';
    });
    const setOutputSpy = jest.spyOn(core, 'setOutput').mockImplementation((name: string, value: any) => {
      outputs[name] = value;
    });
    const setFailedSpy = jest.spyOn(core, 'setFailed').mockImplementation((message: string | Error) => {
      throw message instanceof Error ? message : new Error(message);
    });
    const readFileSyncSpy = jest.spyOn(fs, 'readFileSync').mockImplementation((path: string) => {
      return inputs[path];
    });
    const writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation((path: string, data: string) => {
      outputs[path] = data;
    });

    expect(handleAction).not.toThrow();

    expect(getInputSpy).toBeCalledTimes(3);
    expect(getBooleanInputSpy).toBeCalledTimes(1);
    expect(readFileSyncSpy).toBeCalled();
    expect(setOutputSpy).toBeCalledTimes(2);
    expect(setFailedSpy).toBeCalledTimes(0);
    expect(writeFileSyncSpy).toBeCalled();
    expect(outputs['value_old']).toEqual('^1.7.0');
    expect(outputs['value_new']).toEqual(`^2.0.${patch}`);
    expect(outputs[inputs['file']]).toBeDefined();
    [getInputSpy, getBooleanInputSpy, setOutputSpy, setFailedSpy, readFileSyncSpy, writeFileSyncSpy].forEach((s) => {
      s.mockRestore();
    });
  });
});
