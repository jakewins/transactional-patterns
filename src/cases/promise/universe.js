import Promise from 'promise';
import {action, test_correctness} from '../../harness';

// These are the actions the pattern may use, their names and their possible outcomes
let begin = action('begin', REJECT, THROW, SUCCEED),
  commit = action('commit', REJECT, THROW, SUCCEED),
  rollback = action('rollback', REJECT, THROW, SUCCEED),
  business_logic = action('business logic', REJECT, THROW, RETURN_TRUE, RETURN_FALSE);

// These are the valid call sequences; if a pattern does anything other than this, it fails.
let valid_sequences = [
  // First, the happy path: If begin succeeds, and business logic is true, 
  // then the pattern must call commit.
  [[begin, SUCCEED], [business_logic, RETURN_TRUE], [commit]],

  // If the business logic fails or returns false, the pattern must call rollback
  [[begin, SUCCEED], [business_logic, REJECT, THROW, RETURN_FALSE], [rollback]],

  // If begin fails in the first place, not doing anything further is valid
  [[begin, REJECT, THROW]],

  // However, it is also valid to play the full scenario - as long as it always ends with rollback
  [[begin, REJECT, THROW], [business_logic], [rollback]],
  
  // Or to leave the business logic out - as long as rollback gets called
  [[begin, REJECT, THROW], [rollback]]
];

let actions = [begin, commit, rollback, business_logic];

function REJECT() {
  return Promise.reject(new Error("Induced rejection."));
}

function THROW() {
  throw new Error("Induced failure.");
}

function SUCCEED() {
  return Promise.resolve(true);
}

function RETURN_TRUE() {
  return Promise.resolve(true);
}

function RETURN_FALSE() {
  return Promise.resolve(false);
}

function test(pattern) {
  test_correctness(actions, valid_sequences, pattern)
    .then((result) => {
      if(result.passed) {
        console.log("Testing: " + pattern.name + ".. OK!");
      } else {
        console.log("Testing: " + pattern.name + ".. FAIL!");
        console.log("  " + result.description.replace(/(?:\r\n|\r|\n)/g, "\n  "));
        console.log();
      }
    });
}

export default {actions, valid_sequences, test};