
import {test_correctness} from './src/harness';
import {actions, valid_sequences} from './src/transaction_usecase';

function naive_blocking(begin, commit, rollback, business_logic) {
  begin();
  try {
    if( business_logic() ) {
      commit();
    } else {
      rollback();
    }
  } catch( e ) {
    rollback();
  }
}

function classic_blocking(begin, commit, rollback, business_logic) {
  let success = false;
  begin();
  try {
    if(business_logic()) {
      success = true;
    }
  } finally {
    if(success) {
      commit();
    } else {
      rollback();
    }
  }
}


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
test(classic_blocking)