import * as assert from 'assert';
import { readFileSync } from 'fs';
import _ = require('lodash');

function main() {
  const input = _.trim(readFileSync(__dirname + '/input.txt', 'utf8'));

  const exQuine = '109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99';
  assert.strictEqual(exQuine, solveA(exQuine));
  assert.strictEqual(16, solveA("1102,34915192,34915192,7,4,7,99,0").length);
  assert.strictEqual("1125899906842624", solveA("104,1125899906842624,99"));
  assert.strictEqual("3839402290", solveA(input));

  assert.strictEqual("35734", solveB(input));
}

main();

function solveA(input: string) {
  const originalProgram = input.split(',').map(Number);
  const output = runIntcodeProgram(originalProgram, [1].values());
  return Array.from(output).join(',');
}

function solveB(input: string) {
  const originalProgram = input.split(',').map(Number);
  const output = runIntcodeProgram(originalProgram, [2].values());
  return Array.from(output).join(',');
}

function* runIntcodeProgram(program: number[], input: Iterator<number>): Generator<number> {
  let ndx = 0;
  let relBase = 0;
  while (true) {
    const [, cM, bM, aM, code] = program[ndx].toString().padStart(5, '0').match(/(.)(.)(.)(..)/)!;
    let aP = program[ndx + 1];
    let bP = program[ndx + 2];
    let cP = program[ndx + 3];
    if(aM === '2') aP += relBase;
    if(bM === '2') bP += relBase;
    if(cM === '2') cP += relBase;
    let aV = (aM === '1' ? aP : program[aP]) || 0;
    let bV = (bM === '1' ? bP : program[bP]) || 0;

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
      program[aP] = input.next().value;
      ndx += 2;
      continue;
    }
    if (code === '04') {
      yield aV;
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
    if (code === '09') {
      relBase += aV;
      ndx += 2;
      continue;
    }
    throw `invalid code: ${cM},${bM},${aM},${code}`;
  }
}
