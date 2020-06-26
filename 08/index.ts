import * as assert from 'assert';
import {readFileSync} from 'fs';
import _ = require('lodash');

function main() {
  const input = _.trim(readFileSync(__dirname + '/input.txt', 'utf8'));

  assert.strictEqual(8, solveA("122221211012", 3, 2));
  assert.strictEqual(1716, solveA(input, 25, 6));

  assert.strictEqual(" #\n# ", solveB("0222112222120000", 2, 2));
  console.log(solveB(input, 25, 6));
}

main();

function solveA(input: string, width: number, height: number) {
  const layerSize = width * height;
  const digits = input.split('');

  let layerWithFewestZeros: string[] = [];
  let numZeros = Number.POSITIVE_INFINITY;

  for (let i = 0; i < digits.length; i += layerSize) {
    let layer = digits.slice(i, i + layerSize);
    let count = layer.filter(it => it === '0').length
    if (count < numZeros) {
      layerWithFewestZeros = layer;
      numZeros = count;
    }
  }
  return layerWithFewestZeros.filter(it => it === '1').length * layerWithFewestZeros.filter(it => it === '2').length
}

function solveB(input: string, width: number, height: number) {
  const layerSize = width * height;
  const digits = input.split('');
  const finalOut = digits.slice(0, layerSize);

  for (let i = layerSize; i < digits.length; i += layerSize) {
    let layer = digits.slice(i, i + layerSize);
    for (let [ndx, item] of layer.entries()) {
      if (finalOut[ndx] === '2') {
        finalOut[ndx] = item;
      }
    }
  }

  return _.chunk(finalOut.map(it=> it === '0' ? ' ' : '#'), width).map(it=>it.join('')).join('\n')
}
