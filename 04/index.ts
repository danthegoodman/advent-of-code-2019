import * as assert from 'assert';
import { readFileSync } from 'fs';
import _ = require('lodash');

function main() {
  const input = _.trim(readFileSync(__dirname + '/input.txt', 'utf8'));

  assert.strictEqual(1, solveA("223449-223451"));
  assert.strictEqual(594, solveA(input));

  assert.strictEqual(0, solveB("123444-123444"));
  assert.strictEqual(1, solveB("111122-111122"));
  assert.strictEqual(364, solveB(input));
}

main();

function solveA(input: string) {
  let [low,high] = input.split('-').map(it=>it.split('').map(Number));

  let nums = low;
  let count = 0;
  while(true){
    if(isValidPass(nums)) count += 1;
    if(_.isEqual(nums, high)) break;
    incrementNums(nums, 5);
  }
  return count;

  function isValidPass(nums: number[]) {
    let last = 0;
    let hasDup = false;
    for(let n of nums){
      if(n < last) return false;
      if(n === last) hasDup = true;
      last = n;
    }

    return hasDup;
  }
}

function incrementNums(nums: number[], position: number){
  if(nums[position] >= 9){
    nums[position] = 0;
    incrementNums(nums, position - 1);
  } else {
    nums[position] += 1;
  }
}

function solveB(input: string) {
  let [low,high] = input.split('-').map(it=>it.split('').map(Number));

  let nums = low;
  let count = 0;
  while(true){
    if(isValidPass(nums)) count += 1;
    if(_.isEqual(nums, high)) break;
    incrementNums(nums, 5);
  }
  return count;

  function isValidPass(nums: number[]) {
    let last = 0;
    let seenDupLengthOfTwo = false;
    let dupLength = 1;
    for(let n of nums){
      if(n < last) return false;
      else if(n === last) dupLength += 1;
      else {
        if(dupLength === 2) seenDupLengthOfTwo = true;
        dupLength = 1;
      }
      last = n;
    }
    if(dupLength === 2) seenDupLengthOfTwo = true;

    return seenDupLengthOfTwo;
  }
}
