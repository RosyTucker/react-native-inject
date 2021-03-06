React Native Inject
-------------------

Babel plugin for react native that reads config from a dotenv file and injects it into the built application,
allowing you to build different versions of your application for different environments, without needing a
native dependency.

Installation
============

- Npm : `npm install react-native-inject --save-dev`
- Yarn: `yarn add -D react-native-inject`

Basic Usage
===========

Add the following to your `.babelrc`

```
"presets": ["react-native", "react-native-inject"]
```


Your `.env` file:
```
API_URL=https://some.endpoint.com
```

Your javascript:

``` javascript
import environment from 'react-native-inject'


makeCallTo(environment.API_URL);
```

Advanced Usage
==============

You can define a custom environment config by setting the INJECT variable before building e.g:
```
// Inject from the .env.qa file
export RN_INJECT=./some/path/to/.env.qa;

react-native run-ios
```

See the example for more details, to run the example you need to have `babel-cli` installed globally.

Technically there is no reason why this plugin cannot be used with react/JS in general
so long as the project uses babel and es0215


Further Reading
===============

For more information on writing babel plugins go
[here](https://github.com/thejameskyle/babel-handbook/blob/master/translations/en/plugin-handbook.md#toc-definitions)


Changelog
=========

### 0.0.10

Change environment variable name from INJECT to RN_INJECT to reduce chance of clash