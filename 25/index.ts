import * as assert from 'assert';
import { readFileSync } from 'fs';
import _ = require('lodash');

function main() {
  const input = _.trim(readFileSync(__dirname + '/input.txt', 'utf8'));

  assert.strictEqual(null, solveA(""));
  assert.strictEqual(null, solveA(input));

  assert.strictEqual(null, solveB(""));
  assert.strictEqual(null, solveB(input));
}

main();

function solveA(input: string) {
  return input.length;
}

function solveB(input: string) {
  return input.length;
}
