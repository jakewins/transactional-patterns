# Safe and unsafe transactional patterns

## Layout

    main.js           - test all patterns
    src/
      harness.js      - test harness to prove a pattern correct
      cases/
        blocking/
          patterns.js - blocking transactional patterns
          universe.js - definition of a blocking transactional case
        promise/
          patterns.js - promise-based transactional patterns
          universe.js - definition of a promise-based transactional case

## Running the tests

    npm install
    babel-node main.js

## License

MIT