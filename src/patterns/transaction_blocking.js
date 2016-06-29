
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

function neo_blocking(begin, commit, rollback, business_logic) {
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

export default {naive_blocking, classic_blocking, neo_blocking};