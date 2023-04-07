// Copyright © 2023 TWTG R&D B.V.
// Use of this source code is governed by the MIT license that can be found in
// the LICENSE file.

const yargs = require('yargs');
const fs = require('fs');
const glob = require('glob');

// process.on('uncaughtException', function (err) {
//   console.log('Caught exception: ', err);
// });

const argv = yargs
  .usage(
    '$0 [source] [destination file]',
    'Combines examples from multiple files into one'
  )
  .option('g', {
    alias: 'glob',
    boolean: true,
    default: false,
    describe: 'Use source as glob'
  })
  .option('o', {
    alias: 'overwrite',
    boolean: true,
    default: false,
    describe: 'Continue if destination already exists'
  })
  .check((argv, options) => {
    if (
      !argv.glob &&
      (!fs.existsSync(argv.source) || !fs.lstatSync(argv.source).isDirectory())
    ) {
      throw new Error('source is not a directory');
    }
    if (!argv.destinationfile.endsWith('.json')) {
      throw new Error('destination has no .json postfix');
    }
    if (!argv.overwrite && fs.existsSync(argv.destinationfile)) {
      throw new Error('destination already exists');
    }
    return true;
  }).argv;

// Get a list of all the source files with examples
examplesFiles = (() => {
  if (argv.glob) {
    return glob.sync(argv.source);
  } else {
    // assume it is a folder
    return glob.sync(argv.source + '/**/*.json');
  }
})();

console.log(examplesFiles);

// Storing all the examples in an array
let examples = [];
for (const exampleFile of examplesFiles) {
  let example = fs.readFileSync(exampleFile, 'utf8', (err, content) => {
    if (err) {
      throw new Error(err.message);
    }
    return content;
  });
  const parsedExample = JSON.parse(example);
  examples = examples.concat(parsedExample);
}

fs.writeFileSync(argv.destinationfile, JSON.stringify(examples, null, 2));
