import * as assert from 'assert';
import { readFileSync } from 'fs';
import _ = require('lodash');

function main() {
  const input = _.trim(readFileSync(__dirname + '/input.txt', 'utf8'));

  assert.strictEqual(42, solveA("COM)B\nB)C\nC)D\nD)E\nE)F\nB)G\nG)H\nD)I\nE)J\nJ)K\nK)L"));
  assert.strictEqual(387356, solveA(input));

  assert.strictEqual(4, solveB("COM)B\nB)C\nC)D\nD)E\nE)F\nB)G\nG)H\nD)I\nE)J\nJ)K\nK)L\nK)YOU\nI)SAN"));
  assert.strictEqual(532, solveB(input));
}

main();

function solveA(input: string) {
  const things = new Map(input.split('\n').map(it => it.split(')').reverse() as [string, string]));

  let count = 0;
  for (let k of things.keys()) {
    let node = k;
    while (node != 'COM') {
      node = things.get(node)!
      count += 1;
    }
  }

  return count;
}

function solveB(input: string) {
  const things = new Map(input.split('\n').map(it => it.split(')').reverse() as [string, string]));

  const remaining = new Set(things.keys());
  const distances = new Map<string, number | null>(Array.from(things.keys(), (it => [it, null])));

  let dist = 0;
  let node = 'YOU';
  while(node !== 'COM'){
    remaining.delete(node);
    distances.set(node, dist);
    node = things.get(node)!;
    dist += 1;
  }

  while(remaining.size){
    let items = Array.from(remaining);
    for(let k of items){
      let target = things.get(k)!;
      let dist = distances.get(target);
      if(dist == null) continue;
      distances.set(k, dist + 1);
      remaining.delete(k);
    }
  }

  return distances.get('SAN')! - 2;
}
