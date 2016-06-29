
function promise_rollback_in_catch(begin, commit, rollback, business_logic) {
  return begin()
    .then(business_logic)
    .then((logic_result) => {
      if(logic_result) {
        commit();
      } else {
        throw Error("Exception to trigger rollback.")
      }
    })
    .catch((error) => rollback());
}

export default {promise_rollback_in_catch};