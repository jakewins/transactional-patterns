
function action(name, ...outcomes) {
  return {
    name,
    forEach : (cb) => outcomes.forEach(( outcome ) => cb({name, outcome:outcome}))
  }
}

/**
 * Tests the correctness of a pattern, given a set of actions (defined via the `action` function),
 * and a list of valid call sequences. This will run the given pattern with every permutation of
 * outcomes for the defined actions, and ensure that the call sequence the pattern applies to the
 * actions is one listed as valid.
 */
function test_correctness(actions, valid_sequences, pattern_to_test) {
  let failures = [];

  // Given the various outcomes of each of our actions, generate every possible 
  // permutation, assuming each action always does the same thing within one trial.
  all_permutations(actions, (permutation) => {
    // And now we're going to try this permutation against the pattern we were given.
    // What we're looking for is ensuring the pattern never invokes the actions in 
    // any other sequence than the valid ones we've listed.

    // This tracks the sequence of calls made by the pattern
    let sequence = [];
    
    // Convert the current permutation to arguments for the pattern, where each one
    // tracks if the action was invoked by adding it to `sequence`.
    let args = permutation.map( (action) => () => {
      sequence.push(action);
      action.outcome();
    })

    // Give it a spin!
    try {
      pattern_to_test.apply(null, args);
    } catch(e) {}

    // Validate the sequence
    if(!is_valid_sequence(sequence, valid_sequences)) {
      failures.push(
        "Pattern failed validation\n" +
        "  Scenario: " + describe_permutation(permutation) + "\n" +
        "  Pattern did: " + sequence.map((s)=>s.name).join(", "));
    }
  });

  if(failures.length > 0) {
    return {passed:false, description:failures.join("\n")};
  } else {
    return {passed:true};
  }
}

function all_permutations( args, callback ) {
  if( args.length == 0 ) {
    callback([]);
  } else {
    let permutations = args[0],
        rest = args.slice(1);
    permutations.forEach( (permutation) =>
      all_permutations(rest, (rest_permutation) => 
        callback([permutation].concat(rest_permutation))
      )
    );
  }
}

function is_valid_sequence( sequence, valid_sequences ) {
  let is_valid = false;
  valid_sequences.forEach( (valid_sequence) => {
    if(sequence_fits_pattern( sequence, valid_sequence )) {
      is_valid = true;
    }
  });
  return is_valid;
}

function sequence_fits_pattern(sequence, valid_sequence) {
  if(sequence.length !== valid_sequence.length) {
    return false;
  }

  for(let i=0;i<sequence.length;i++) {
    let action_taken = sequence[i],
        valid_action = valid_sequence[i];

    if(action_taken.name !== valid_action[0].name) {
      return false;
    }

    if(valid_action.length == 1) {
      // The valid sequence does not specify any constraints on
      // which outcomes it is applicable to, meaning we accept any
      // outcome.
      return true;
    }

    for(let outcome_idx=1; outcome_idx<valid_action.length; outcome_idx++) {
      let valid_outcome = valid_action[outcome_idx];
      if(valid_outcome === action_taken.outcome) {
        return true;
      }
    }

    return false;
  }
}

function describe_permutation(permutation) {
  return permutation.map( (p) => p.name + " -> " + p.outcome.name).join(", ");
}

export default {test_correctness, action};