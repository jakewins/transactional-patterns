
import {test_correctness} from './src/harness';
import {actions, valid_sequences} from './src/transaction_usecase';

import {naive_blocking, classic_blocking, neo_blocking} from './src/patterns/transaction_blocking';


function test(pattern) {
  let result = test_correctness(actions, valid_sequences, pattern);
  if(result.passed) {
    console.log("Testing: " + pattern.name + ".. OK!");
  } else {
    console.log("Testing: " + pattern.name + ".. FAIL!");
    console.log("  " + result.description.replace(/(?:\r\n|\r|\n)/g, "\n  "));
    console.log();
  }
}

test(naive_blocking);
test(classic_blocking);
test(neo_blocking);