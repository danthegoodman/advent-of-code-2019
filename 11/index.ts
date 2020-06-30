import * as assert from 'assert';
import { readFileSync } from 'fs';
import _ = require('lodash');

function main() {
  const input = _.trim(readFileSync(__dirname + '/input.txt', 'utf8'));

  assert.strictEqual(1876, solveA(input));

  console.log(solveB(input));
  console.log("Expecting: CGPJCGCL")
}

const DIRECTIONS = [
  {x: 0, y:-1},
  {x:+1, y: 0},
  {x: 0, y:+1},
  {x:-1, y: 0},
]
const TURN_LEFT = [DIRECTIONS[3], DIRECTIONS[0], DIRECTIONS[1], DIRECTIONS[2]];
const TURN_RIGHT = [DIRECTIONS[1], DIRECTIONS[2], DIRECTIONS[3], DIRECTIONS[0]];

function solveA(input: string) {
  const originalProgram = input.split(',').map(Number);
  const paintedPanels = new Set<string>();
  const whitePanels = new Set<string>();
  let x = 0;
  let y = 0;
  let dir = DIRECTIONS[0];

  function* camera(){
    while(true){
      yield whitePanels.has(`${x},${y}`) ? 1 : 0
    }
  }

  const output = runIntcodeProgram(originalProgram, camera())
  while(true){
    const result = output.next()
    if(result.done) break;

    const position = `${x},${y}`;
    paintedPanels.add(position)
    if(result.value === 1){
      whitePanels.add(position)
    } else {
      whitePanels.delete(position)
    }

    const turnValue = output.next().value;
    const turnDirections = turnValue ? TURN_RIGHT : TURN_LEFT;
    dir = turnDirections[DIRECTIONS.indexOf(dir)]
    x += dir.x;
    y += dir.y;
  }

  return paintedPanels.size;
}

function solveB(input: string) {
  const originalProgram = input.split(',').map(Number);
  const whitePanels = new Set<string>(['0,0']);
  let x = 0;
  let y = 0;
  let dir = DIRECTIONS[0];

  function* camera(){
    while(true){
      yield whitePanels.has(`${x},${y}`) ? 1 : 0
    }
  }

  const output = runIntcodeProgram(originalProgram, camera())
  while(true){
    const result = output.next()
    if(result.done) break;

    const position = `${x},${y}`;
    if(position === ',') console.log("???????");
    if(result.value === 1){
      whitePanels.add(position)
    } else {
      whitePanels.delete(position)
    }

    const turnValue = output.next().value;
    const turnDirections = turnValue ? TURN_RIGHT : TURN_LEFT;
    dir = turnDirections[DIRECTIONS.indexOf(dir)]
    x += dir.x;
    y += dir.y;
  }

  const spots = Array.from(whitePanels).map(it=>it.split(',').map(Number));
  let allX = spots.map(it=>it[0]);
  let allY = spots.map(it=>it[1]);
  const minX = _.min(allX) || 0;
  const maxX = _.max(allX) || 0;
  const minY = _.min(allY) || 0;
  const maxY = _.max(allY) || 0;

  return _.times(maxY - minY + 1, y=> _.times(maxX - minX  + 1, x=> whitePanels.has(`${x + minX},${y + minY}`) ? '#' : ' ').join('')).join('\n')
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

main();
