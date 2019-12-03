import * as assert from 'assert';
import { readFileSync } from 'fs';
import _ = require('lodash');

function main() {
  const input = _.trim(readFileSync(__dirname + '/input.txt', 'utf8'));

  assert.strictEqual(6, solveA("R8,U5,L5,D3\nU7,R6,D4,L4"));
  assert.strictEqual(159, solveA("R75,D30,R83,U83,L12,D49,R71,U7,L72\nU62,R66,U55,R34,D71,R55,D58,R83"));
  assert.strictEqual(135, solveA("R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51\nU98,R91,D20,R16,D67,R40,U7,R15,U6,R7"));
  assert.strictEqual(399, solveA(input));

  assert.strictEqual(30, solveB("R8,U5,L5,D3\nU7,R6,D4,L4"));
  assert.strictEqual(610, solveB("R75,D30,R83,U83,L12,D49,R71,U7,L72\nU62,R66,U55,R34,D71,R55,D58,R83"));
  assert.strictEqual(410, solveB("R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51\nU98,R91,D20,R16,D67,R40,U7,R15,U6,R7"));
  assert.strictEqual(15678, solveB(input));
}

main();
type Point = { x: number, y: number };

function parseInput(input: string) {
  let wires = input.split('\n');
  return wires.map(ln => {
    let last: Point = {x: 0, y: 0};
    return ln.split(',').map(it => {
      let [, dir, dist] = it.match(/([UDLR])(\d+)/)!;
      let prev = last;
      let next: Point;
      if (dir === 'U') {
        next = {x: last.x, y: last.y - Number(dist)};
      } else if (dir === 'D') {
        next = {x: last.x, y: last.y + Number(dist)};
      } else if (dir === 'L') {
        next = {x: last.x - Number(dist), y: last.y};
      } else if (dir === 'R') {
        next = {x: last.x + Number(dist), y: last.y};
      } else {
        throw 'up';
      }
      last = next;
      return [prev, next];
    })
  });
}

function intersection(vert1: Point, vert2: Point, horz1: Point, horz2: Point): Point | null {
  let [minX, maxX] = horz1.x < horz2.x ? [horz1.x, horz2.x] : [horz2.x, horz1.x];
  let [minY, maxY] = vert1.y < vert2.y ? [vert1.y, vert2.y] : [vert2.y, vert1.y];
  if (minX <= vert1.x && vert1.x <= maxX) {
    if (minY <= horz1.y && horz1.y <= maxY) {
      return {x: vert1.x, y: horz1.y};
    }
  }
  return null;
}

function distance(p1: Point, p2: Point) {
  return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y)
}

function solveA(input: string) {
  let [lines1, lines2] = parseInput(input);

  let minDistSeen = Number.POSITIVE_INFINITY;
  for (let [a1, a2] of lines1) {
    for (let [b1, b2] of lines2) {
      let intersect: Point | null = null;
      if (a1.x === a2.x && b1.y === b2.y) {
        intersect = intersection(a1, a2, b1, b2);
      } else if (a1.y === a2.y && b1.x === b2.x) {
        intersect = intersection(b1, b2, a1, a2);
      }
      if (!intersect) continue;
      if (intersect.x === 0 && intersect.y === 0) continue;

      let dist = Math.abs(intersect.x) + Math.abs(intersect.y);
      if (dist < minDistSeen) {
        minDistSeen = dist;
      }
    }
  }

  return minDistSeen;
}

function solveB(input: string) {
  let [lines1, lines2] = parseInput(input);
  let minStepsSeen = Number.POSITIVE_INFINITY;

  for (let [aNdx, [a1, a2]] of lines1.entries()) {
    for (let [bNdx, [b1, b2]] of lines2.entries()) {
      let intersect: Point | null = null;
      if (a1.x === a2.x && b1.y === b2.y) {
        intersect = intersection(a1, a2, b1, b2);
      } else if (a1.y === a2.y && b1.x === b2.x) {
        intersect = intersection(b1, b2, a1, a2);
      }
      if (!intersect) continue;
      if (intersect.x === 0 && intersect.y === 0) continue;

      let steps = 0;
      steps += _.sumBy(lines1.slice(0, aNdx).map(it => distance(it[0], it[1])));
      steps += _.sumBy(lines2.slice(0, bNdx).map(it => distance(it[0], it[1])));
      steps += distance(a1, intersect);
      steps += distance(b1, intersect);

      if (steps < minStepsSeen) {
        minStepsSeen = steps;
      }
    }
  }

  return minStepsSeen;
}
