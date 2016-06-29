
import {naive_blocking, classic_blocking, neo_blocking} from './src/cases/blocking/patterns';
import blocking from './src/cases/blocking/universe';

// blocking.test(naive_blocking);
blocking.test(classic_blocking);
// blocking.test(neo_blocking);

import {promise_rollback_in_catch} from './src/cases/promise/patterns';
import promise from './src/cases/promise/universe';

// promise.test(promise_rollback_in_catch)
