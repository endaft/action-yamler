# action-yamler

This GitHub Action helps to manipulate yaml files easily.

## Example

This example demonstrates using this action to update the `version` in a `pubspec.yaml` by appending `-dev.NNNNN`.

```yaml
- name: ✍🏼 version
  uses: endaft/action-yamler@v1.0.5
  with:
    file: ./pubspec.yaml
    path: version
    set: -dev.${{ github.run_number }}
    get: true
    append: true
```

## Inputs

| name       | required | description                                                           | default |
| ---------- | -------- | --------------------------------------------------------------------- | ------- |
| **file**   | `true`   | The path to a yaml file                                               |         |
| **path**   | `true`   | The dotted yaml path to edit. Ex: `object.item.name` or `list.0.name` |         |
| **get**    | `false`  | Whether or not to get the value into the output.                      | `true`  |
| **set**    | `false`  | The value to set at the path.                                         |         |
| **append** | `false`  | Whether or not the set value is appended or put at the path.          | `false` |

## Outputs

| name | description |
| --- | --- |
| value_old | If the `get` attribute is true, this holds the value found at the path before changing it or an empty string if the path doesn't exist. |
| value_new | If the `get` attribute is true, this holds the value set at the path after changing it. |
