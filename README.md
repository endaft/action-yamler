# action-yamler

## GitHub Action

This GitHub Action helps to manipulate yaml files easily.

## Inputs

| name     | required | description                                                           | default |
| -------- | -------- | --------------------------------------------------------------------- | ------- |
| **file** | `true`   | The path to a yaml file                                               |         |
| **path** | `true`   | The dotted yaml path to edit. Ex: `object.item.name` or `list.0.name` |         |
| **get**  | `false`  | Whether or not to get the value into the output.                      | `true`  |
| **set**  | `false`  | The value to set at the path.                                         |         |

## Outputs

| name | description |
| --- | --- |
| value_old | If the `get` attribute is true, this holds the value found at the path before changing it or an empty string if the path doesn't exist. |
| value_new | If the `get` attribute is true, this holds the value set at the path after changing it. |
