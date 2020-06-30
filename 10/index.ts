import * as assert from 'assert';
import {readFileSync} from 'fs';
import _ = require('lodash');

function main() {
  const input = _.trim(readFileSync(__dirname + '/input.txt', 'utf8'));

  assert.strictEqual(8, solveA(ex1).count);
  assert.strictEqual(33, solveA(ex2).count);
  assert.strictEqual(35, solveA(ex3).count);
  assert.strictEqual(41, solveA(ex4).count);

  const result5 = solveA(ex5);
  assert.strictEqual(210, result5.count);

  const resultInput = solveA(input)
  assert.strictEqual(314, resultInput.count);

  assert.strictEqual(1403, solveB(exB1, 8, 3));
  assert.strictEqual(802, solveB(ex5, result5.c, result5.r));
  assert.strictEqual(1513, solveB(input, resultInput.c, resultInput.r));
}

function solveA(input: string) {
  const grid = input.split('\n').map(it => it.split(''));
  let best = {c: -1, r: -1, count: 0};
  for (const [r, row] of grid.entries()) {
    for (const [c, char] of row.entries()) {
      if (char === '.') continue;
      let count = countVisibleAsteroids(grid, c, r)
      if (count > best.count) {
        best = {c, r, count}
      }
    }
  }
  return best;
}

function countVisibleAsteroids(grid: string[][], baseC: number, baseR: number) {
  const seenRatios = new Set<number>();

  for (const [r, row] of grid.entries()) {
    for (const [c, char] of row.entries()) {
      if (char === '.') continue;
      if (r === baseR && c === baseC) continue;
      seenRatios.add(Math.atan2(r - baseR, c - baseC));
    }
  }

  return seenRatios.size
}

function solveB(input: string, baseC: number, baseR: number) {
  const grid = input.split('\n').map(it => it.split(''));
  const countAsteroids = input.split('').filter(it=>it === '#').length - 1;

  const asteroidRadians = new Map<number, Array<{ r: number, c: number, dist: number }>>();
  for (const [r, row] of grid.entries()) {
    for (const [c, char] of row.entries()) {
      if (char === '.') continue;
      if(r === baseR && c === baseC) continue;

      const rad = Math.atan2(c - baseC, r - baseR);
      const dist = Math.abs(r - baseR) ** 2 + Math.abs(c - baseC) ** 2;

      let arr = asteroidRadians.get(rad);
      if (!arr) {
        arr = []
        asteroidRadians.set(rad, arr);
      }

      arr.push({c, r, dist})
    }
  }

  const allRadians = _.sortBy(Array.from(asteroidRadians.keys())).reverse();
  for (const rad of allRadians) {
    asteroidRadians.set(rad, _.sortBy(asteroidRadians.get(rad), it => it.dist));
  }

  const endPoint = Math.min(200, countAsteroids);
  let destroyedCount = 0;
  while (true) {
    for (const rad of allRadians){
      const remainingAtRadians = asteroidRadians.get(rad)!;
      if (remainingAtRadians.length === 0) continue;

      destroyedCount += 1;
      const toasted = remainingAtRadians.shift()!;

      if (destroyedCount === endPoint) {
        return toasted.c * 100 + toasted.r;
      }
    }
  }
}

const ex1 = `\
.#..#
.....
#####
....#
...##`;

const ex2 = `\
......#.#.
#..#.#....
..#######.
.#.#.###..
.#..#.....
..#....#.#
#..#....#.
.##.#..###
##...#..#.
.#....####`;

const ex3 = `\
#.#...#.#.
.###....#.
.#....#...
##.#.#.#.#
....#.#.#.
.##..###.#
..#...##..
..##....##
......#...
.####.###.`;

const ex4 = `\
.#..#..###
####.###.#
....###.#.
..###.##.#
##.##.#.#.
....###..#
..#.#..#.#
#..#.#.###
.##...##.#
.....#.#..`;

const ex5 = `\
.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##`;

const exB1 = `\
.#....#####...#..
##...##.#####..##
##...#...#.#####.
..#.....#...###..
..#.#.....#....##`;

main();
