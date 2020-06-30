import * as assert from 'assert';
import {readFileSync} from 'fs';
import _ = require('lodash');

function main() {
  const input = _.trim(readFileSync(__dirname + '/input.txt', 'utf8'));

  assert.strictEqual(179, solveA(`\
<x=-1, y=0, z=2>
<x=2, y=-10, z=-7>
<x=4, y=-8, z=8>
<x=3, y=5, z=-1>`, 10));
  assert.strictEqual(1940, solveA(`\
<x=-8, y=-10, z=0>
<x=5, y=5, z=10>
<x=2, y=-7, z=3>
<x=9, y=-8, z=-3>`, 100));
  assert.strictEqual(12070, solveA(input, 1000));

  assert.strictEqual(null, solveB(""));
  assert.strictEqual(null, solveB(input));
}

main();

function solveA(input: string, steps: number) {
  const positions = input.split('\n').map(it=> it.match(/(-?\d+)/g)!.map(Number))
  const velocity = _.times(4, ()=>[0,0,0]);

  for(let i = 0; i < steps; i++){
    applyGravity();
    applyVelocity();
  }

  return _.sum(_.times(4, i => _.sum(positions[i].map(Math.abs)) * _.sum(velocity[i].map(Math.abs))));

  function applyGravity() {
    for(let i = 0; i < 3; i++){
      const a = positions[i];
      for(let j = i + 1; j < 4; j++){
        const b = positions[j];
        for(let n = 0; n < 3; n++){
          if(a[n] > b[n]){
            velocity[i][n] -= 1;
            velocity[j][n] += 1;
          } else if(b[n] > a[n]){
            velocity[i][n] += 1;
            velocity[j][n] -= 1;
          }
        }
      }
    }
  }

  function applyVelocity() {
    for(let i = 0; i < 4; i++){
      for(let n = 0; n < 3; n++){
        positions[i][n] += velocity[i][n];
      }
    }
  }
}

function solveB(input: string) {
  return input.length;
}
