import * as assert from 'assert';
import { readFileSync } from 'fs';
import _ = require('lodash');

function main() {
  const input = _.trim(readFileSync(__dirname + '/input.txt', 'utf8'));

  assert.strictEqual(654, solveA("1969"));
  assert.strictEqual(33583, solveA("100756"));
  assert.strictEqual(3252897, solveA(input));

  assert.strictEqual(2, solveB("14"));
  assert.strictEqual(966, solveB("1969"));
  assert.strictEqual(50346, solveB("100756"));
  assert.strictEqual(4876469, solveB(input));
}

main();

function solveA(input: string) {
  let sum = 0;
  for (let n of input.split('\n').map(Number)) {
    sum += calcFuel(n);
  }
  return sum;
}


function solveB(input: string) {
  let sum = 0;
  for (let n of input.split('\n').map(Number)) {
    let lastFuel = calcFuel(n);
    while (lastFuel >= 0) {
      sum += lastFuel;
      lastFuel = calcFuel(lastFuel);
    }
  }
  return sum;
}

function calcFuel(mass: number) {
  return Math.floor(mass / 3) - 2;
}
