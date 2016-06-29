
import {action} from './harness';

// These are the actions the pattern may use, their names and their possible outcomes
let begin = action('begin', FAIL, SUCCEED),
  commit = action('commit', FAIL, SUCCEED),
  rollback = action('rollback', FAIL, SUCCEED),
  business_logic = action('business logic', FAIL, RETURN_TRUE, RETURN_FALSE);

// These are the valid call sequences; if a pattern does anything other than this, it fails.
let valid_sequences = [
  // First, the happy path: If begin succeeds, and business logic is true, 
  // then the pattern must call commit.
  [[begin, SUCCEED], [business_logic, RETURN_TRUE], [commit]],

  // If the business logic fails or returns false, the pattern must call rollback
  [[begin, SUCCEED], [business_logic, FAIL, RETURN_FALSE], [rollback]],

  // If begin fails in the first place, not doing anything further is valid
  [[begin, FAIL]],

  // However, it is also valid to play the full scenario - as long as it always ends with rollback
  [[begin, FAIL], [business_logic], [rollback]],
  
  // Or to leave the business logic out - as long as rollback gets called
  [[begin, FAIL], [rollback]]
];

let actions = [begin, commit, rollback, business_logic];

function FAIL() {
  throw new Error("Induced failure.");
}

function SUCCEED() {

}

function RETURN_TRUE() {
  return true;
}

function RETURN_FALSE() {
  return false;
}

export default {actions, valid_sequences};