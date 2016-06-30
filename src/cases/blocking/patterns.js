
function blocking_naive(begin, commit, rollback, business_logic) {
  begin();
  if( business_logic() ) {
    commit();
  } else {
    rollback();
  }
}

function blocking_catch(begin, commit, rollback, business_logic) {
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

function blocking_classic(begin, commit, rollback, business_logic) {
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

function blocking_neo(begin, commit, rollback, business_logic) {
  begin();
  let tx = new NeoTransaction(commit, rollback);
  try {
    if(business_logic()) {
      tx.success();
    }
  } finally {
    tx.finish();
  }
}

class NeoTransaction {
  constructor(commit, rollback) {
    this._commit = commit;
    this._rollback = rollback;
  }
  failure() {
    this.outcome = "failed";
  }
  success() {
    if(this.outcome === undefined) {
      this.outcome = "success";
    }
  }
  finish() {
    if(this.outcome === "success") {
      this._commit();
    } else {
      this._rollback();
    }
  }
}

export default {blocking_naive, blocking_catch, blocking_classic, blocking_neo};