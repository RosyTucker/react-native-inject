const dotEnv = require('dotenv');
const process = require('process');

const MODULE_NAME = 'react-native-inject';

module.exports = function (data) {
  const types = data.types;

  function getImportVariableName(path) {
    return Object.keys(path.scope.bindings)[0];
  }

  // Only supports strings
  function createObjectProperty(key, value) {
    const keyNode = types.identifier(key);
    const valueNode = types.stringLiteral(value);
    return types.objectProperty(keyNode, valueNode);
  }

  return {
    visitor: {
      // ImportDeclaration is the type of the syntax tree token to modify
      ImportDeclaration(path) {
        const currentNode = path.node;

        // Ignore any imports that are not the 'react-native-inject' module
        if (currentNode.source.value !== MODULE_NAME) {
          return;
        }

        // Make sure its a default import
        if (currentNode.specifiers.length != 1 || currentNode.specifiers[0].type !== "ImportDefaultSpecifier") {
          throw new Error(`You must import ${MODULE_NAME} as default e.g: import env from \'${MODULE_NAME}\'`);
        }

        // Read the env config
        const injectFilePath = process.env.INJECT || '.env';
        const environmentConfig = dotEnv.config({ path: injectFilePath, silent: true });

        if (!environmentConfig) {
          throw new Error('Failed to load INJECT file at location: ', injectFilePath);
        }

        // Turn the config into an abstract syntax tree
        const configEntries = Object
          .keys(environmentConfig.parsed)
          .map(key => createObjectProperty(key, environmentConfig.parsed[key]));

        const configAst = types.objectExpression(configEntries);

        const nameOfImport = getImportVariableName(path);

        // Swap the import declaration for a var declaration of the environment config
        const replacement = types.variableDeclaration('var', [
          types.variableDeclarator(types.identifier(nameOfImport), configAst)
        ]);

        path.replaceWith(replacement);
      }
    }
  };
};