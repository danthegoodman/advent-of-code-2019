import * as assert from 'assert';
import { readFileSync } from 'fs';
import _ = require('lodash');

function main() {
  const input = _.trim(readFileSync(__dirname + '/input.txt', 'utf8'));

  assert.strictEqual(13285749, solve(input, 1));
  assert.strictEqual(5000972, solve(input, 5));
}

main();

function solve(input: string, inputId: number) {
  const program = input.split(',').map(Number);

  let lastOutput = NaN;

  runIntcodeProgram(program, () => inputId, (output) => {
    if(!Number.isNaN(lastOutput) && lastOutput !== 0){
      throw `received output ${output} when lastOutput was ${lastOutput}`
    }
    lastOutput = output
  });

  return lastOutput;
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
      if(aV !== 0){
        ndx = bV;
      } else {
        ndx += 3;
      }
      continue;
    }
    if (code === '06') {
      if(aV === 0){
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
