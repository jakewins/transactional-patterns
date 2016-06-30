
import {blocking_naive, blocking_catch, blocking_classic, blocking_neo} from './src/cases/blocking/patterns';
import blocking from './src/cases/blocking/universe';

blocking.test(blocking_naive);
blocking.test(blocking_catch);
blocking.test(blocking_classic);
blocking.test(blocking_neo);

import {promise_catch, promise_finally, promise_neo, promise_closure} from './src/cases/promise/patterns';
import promise from './src/cases/promise/universe';

promise.test(promise_catch)
promise.test(promise_finally)
promise.test(promise_neo)
promise.test(promise_closure)