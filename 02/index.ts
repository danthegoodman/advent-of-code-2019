import * as assert from 'assert';
import { readFileSync } from 'fs';
import _ = require('lodash');

function main() {
  const input = _.trim(readFileSync(__dirname + '/input.txt', 'utf8'));

  assert.strictEqual(3500, solveA("1,9,10,3,2,3,11,0,99,30,40,50"));
  assert.strictEqual(30, solveA("1,1,1,4,99,5,6,0,99"));
  assert.strictEqual(3085697, solveA(input, 12, 2));

  assert.strictEqual(9425, solveB(input));
}

main();

function solveA(input: string, noun?: number, verb?: number) {
  let program = input.split(',').map(Number);
  if (noun != null) program[1] = noun;
  if (verb != null) program[2] = verb;
  runIntcodeProgram(program);

  return program[0];
}

function solveB(input: string) {
  for (let noun = 0; noun <= 99; noun++) {
    for (let verb = 0; verb <= 99; verb++) {
      let result = solveA(input, noun, verb);
      if (result === 19690720) {
        return 100 * noun + verb;
      }
    }
  }
  throw `no results found`;
}

function runIntcodeProgram(program: number[]){
  let ndx = 0;
  while (true) {
    let v = program[ndx];
    if (v === 99) break;
    if (v === 1) {
      let a = program[ndx + 1];
      let b = program[ndx + 2];
      let c = program[ndx + 3];
      program[c] = program[a] + program[b];
      ndx += 4;
      continue;
    }
    if (v === 2) {
      let a = program[ndx + 1];
      let b = program[ndx + 2];
      let c = program[ndx + 3];
      program[c] = program[a] * program[b];
      ndx += 4;
      continue;
    }
    throw `invalid code: ${v}`;
  }
}
