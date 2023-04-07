// Copyright © 2023 TWTG R&D B.V.
// Use of this source code is governed by the MIT license that can be found in
// the LICENSE file.

const yargs = require('yargs');
const fs = require('fs');
const glob = require('glob');
const Validator = require('jsonschema').Validator;

const argv = yargs
  .usage('$0 [source]', 'Validates examples schema')
  .option('g', {
    alias: 'glob',
    boolean: true,
    default: false,
    describe: 'Use source as glob'
  })
  .check((argv, options) => {
    if (!argv.glob && !fs.existsSync(argv.source)) {
      throw new Error('source does not exist');
    }
    lstat = fs.lstatSync(argv.source);
    if (lstat.isFile()) {
      if (!argv.source.endsWith('.json')) {
        throw new Error('source file does not have json extension');
      }
    } else if (!lstat.isDirectory()) {
      throw new Error('source is neither a file or directory');
    }
    return true;
  }).argv;

// Get a list of all the source files with examples
const examplesFiles = (() => {
  if (argv.glob) {
    return glob.sync(argv.source);
  } else if (fs.lstatSync(argv.source).isFile()) {
    return [argv.source];
  } else {
    // assume it is a folder
    return glob.sync(argv.source + '/**/*.json');
  }
})();

// Setup schema validator
const schemaValidator = new Validator();
for (const schemaFile of glob.sync(__dirname + '/../schemas/*.json')) {
  const schema = JSON.parse(
    fs.readFileSync(schemaFile, {
      encoding: 'utf8',
      flag: 'r'
    })
  );
  schemaValidator.addSchema(schema);
}
const schema = {
  $id: '/ExamplesArray',
  type: 'array',
  items: {
    $ref: '/Example'
  }
};

console.log(examplesFiles);

// Validate file for file
for (const exampleFile of examplesFiles) {
  try {
    const jut = JSON.parse(
      fs.readFileSync(exampleFile, {
        encoding: 'utf8',
        flag: 'r'
      })
    );
    schemaValidator.validate(jut, schema, { throwError: true });
  } catch (err) {
    console.error(err);
    console.error('Failed on file: ' + exampleFile);
    process.exit(1);
  }
}
