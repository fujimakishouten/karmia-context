# karmia-context

Context module of Karmia JavaScript library

## Installation

```Shell
npm install karmia-context
```

## Example

```JavaScript
const karmia_context = require('karmia-context'),
    context = karmia_context();
```

### Set parameter

```JavaScript
context.set('key', 'value');
```

### Get parameter

```JavaScript
context.get('key');
```

### Create child context

```JavaScript
const child_context = context.child();
```

### Call function

```JavaScript
const parameters = {key: value};
context.call(function, parameters, callback);
```

### Get async function

```JavaScript
const parameters = {key: value};
async.waterfall([
    context.async(function, parameters);
], callback);
```

### Get promise

```JavaScript
co(function* () {
    const parameters = {key: value};
    return yield context.promise(function, parameters);
}).then(function () {});
```
