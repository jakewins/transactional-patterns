
function promise_catch(begin, commit, rollback, business_logic) {
  return begin()
    .then(business_logic)
    .then((outcome) => {
      if(outcome) {
        commit();
      } else {
        throw Error("Exception to trigger rollback.")
      }
    })
    .catch((error) => rollback());
}

function promise_finally(begin, commit, rollback, business_logic) {
  let success = false;
  return begin()
    .then(business_logic)
    .then((outcome) => {
      if(outcome) {
        success = true;
      }
    })
    .finally(() => {
      return success ? commit() : rollback();
    });
}

function promise_neo(begin, commit, rollback, business_logic) {
  let tx = new NeoTransaction(commit, rollback);
  return begin()
    .then(business_logic)
    .then((outcome) => {
      if(outcome) {
        tx.success();
      }
    })
    .finally(tx.finish);
}

function promise_closure(begin, commit, rollback, business_logic) {
  return transactionally((tx) => {
    return business_logic().then((outcome) => {
      if(outcome) {
        tx.success();
      }
    });
  });

  function transactionally(stuff) {
    let success = false;
    return begin()
      .then(() => {
        return stuff({
          success: () => success = true
        });
      })
      .finally(() => {
        if(success) {
          commit();
        } else {
          rollback();
        }
      })
  }
}

class NeoTransaction {
  constructor(commit, rollback) {
    this._commit = commit;
    this._rollback = rollback;
    this.finish = () => this._finish();
  }
  failure() {
    this.outcome = "failed";
  }
  success() {
    if(this.outcome === undefined) {
      this.outcome = "success";
    }
  }
  _finish() {
    if(this.outcome === "success") {
      this._commit();
    } else {
      this._rollback();
    }
  }
}

export default {promise_catch, promise_finally, promise_neo, promise_closure};