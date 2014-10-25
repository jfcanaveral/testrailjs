## testrailjs

This is a node.js implementation of TestRail API.

## Code Example

```javascript
var tr = require('testrailjs');

tr.tests.getTest(testId)
  .then(function(results){
    //Do something with results
  });
  ```

## Motivation

TODO:

## Installation

TODO:

## API Reference

[TestRail API (v2)](http://docs.gurock.com/testrail-api2/start)

## Contributors

TODO

## License

Copyright (c) 2014, James Cañaveral <james.canaveral@gmail.com>

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.