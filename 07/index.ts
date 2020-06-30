import * as assert from 'assert';
import { readFileSync } from 'fs';
import _ = require('lodash');

function main() {
  const input = _.trim(readFileSync(__dirname + '/input.txt', 'utf8'));

  assert.strictEqual(43210, solveA("3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0"));
  assert.strictEqual(54321, solveA("3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0"));
  assert.strictEqual(65210, solveA("3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0"));
  assert.strictEqual(13848, solveA(input));

  assert.strictEqual(139629729, solveB("3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5"));
  assert.strictEqual(null, solveB(input));
}

main();

function solveA(input: string) {
  const originalProgram = input.split(',').map(Number);

  let maxOutput = -1;
  for (const inputs of permutations([0, 1, 2, 3, 4])) {
    let lastOutput = 0;
    for(const i of inputs){
      const input = [i, lastOutput];
      const gen = runIntcodeProgram({
        program: Array.from(originalProgram),
        input: input.values(),
      })
      lastOutput = gen.next().value;
      gen.return(null);
    }
    if(maxOutput < lastOutput){
      maxOutput = lastOutput;
    }
  }

  return maxOutput;
}

function solveB(input: string) {
  const originalProgram = input.split(',').map(Number);

  let maxOutput = -1;
  for (const inputs of permutations([5,6,7,8,9])) {
    const inputA = [inputs[0], 0];
    const genA = runIntcodeProgram({program: Array.from(originalProgram), input: inputA.values()})
    const genB = runIntcodeProgram({program: Array.from(originalProgram), input: prefixedIterator([inputs[1]], genA)})
    const genC = runIntcodeProgram({program: Array.from(originalProgram), input: prefixedIterator([inputs[2]], genB)})
    const genD = runIntcodeProgram({program: Array.from(originalProgram), input: prefixedIterator([inputs[3]], genC)})
    const genE = runIntcodeProgram({program: Array.from(originalProgram), input: prefixedIterator([inputs[4]], genD)})

    for(let value of genE){
      inputA.push(value);
    }
    maxOutput = Math.max(inputA[inputA.length - 1], maxOutput)
  }

  return maxOutput;
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

function* prefixedIterator(values: number[], iterator: IterableIterator<number>){
  yield* values;
  yield* iterator;
}

function* runIntcodeProgram(options: {program: number[], input: Iterator<number>}): Generator<number> {
  const {program, input} = options;

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
    throw `invalid code: ${cM},${bM},${aM},${code}`;
  }
}
