import * as assert from 'assert';
import { readFileSync } from 'fs';
import _ = require('lodash');

function main() {
  const input = _.trim(readFileSync(__dirname + '/input.txt', 'utf8'));

  assert.strictEqual(43210, solveA("3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0"));
  assert.strictEqual(54321, solveA("3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0"));
  assert.strictEqual(65210, solveA("3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0"));
  assert.strictEqual(13848, solveA(input));

  assert.strictEqual(null, solveB(""));
  assert.strictEqual(null, solveB(input));
}

main();

function solveA(input: string) {
  let originalProgram = input.split(',').map(Number);

  let maxOutput = -1;
  for (let inputs of permutations([0, 1, 2, 3, 4])) {
    let lastOutput = 0;
    for(let i of inputs){
      let inputFetchCount = 0;
      runIntcodeProgram(Array.from(originalProgram), ()=> {
        inputFetchCount += 1;
        return inputFetchCount === 1 ? i : lastOutput;
      }, (n: number) => lastOutput = n)
    }
    if(maxOutput < lastOutput){
      maxOutput = lastOutput;
    }
  }

  return maxOutput;
}

function solveB(input: string) {
  return input.length;
}

function* permutations(options: number[]): Generator<number[]> {
  if (options.length === 1) {
    yield options;
    return;
  }

  for (let i = 0; i < options.length; i++) {
    let cur = options[i];
    let remainder = _.without(options, cur);
    for (let p of permutations(remainder)) {
      yield [cur, ...p];
    }
  }
}

function runIntcodeProgram(program: number[], getInput: () => number, pushOutput: (n: number) => void) {
  let ndx = 0;
  while (true) {
    let [, cM, bM, aM, code] = program[ndx].toString().padStart(5, '0').match(/(.)(.)(.)(..)/)!;
    let aP = program[ndx + 1];
    let bP = program[ndx + 2];
    let cP = program[ndx + 3];
    let aV = aM === '1' ? aP : program[aP];
    let bV = bM === '1' ? bP : program[bP];

    if (code === '99') break;
    if (code === '01') {
      program[cP] = aV + bV;
      ndx += 4;
      continue;
    }
    if (code === '02') {
      program[cP] = aV * bV;
      ndx += 4;
      continue;
    }
    if (code === '03') {
      program[aP] = getInput();
      ndx += 2;
      continue;
    }
    if (code === '04') {
      pushOutput(aV);
      ndx += 2;
      continue;
    }
    if (code === '05') {
      if (aV !== 0) {
        ndx = bV;
      } else {
        ndx += 3;
      }
      continue;
    }
    if (code === '06') {
      if (aV === 0) {
        ndx = bV;
      } else {
        ndx += 3;
      }
      continue;
    }
    if (code === '07') {
      program[cP] = aV < bV ? 1 : 0;
      ndx += 4;
      continue;
    }
    if (code === '08') {
      program[cP] = aV === bV ? 1 : 0;
      ndx += 4;
      continue;
    }
    throw `invalid code: ${cM},${bM},${aM},${code}`;
  }
}
