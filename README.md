# solidity-layout-bug

An illustration for https://github.com/ethereum/solidity/issues/13332

To run the test:
```
npm install
npm run compile
npm run test
```

A contract without dual inheritance of the same inverface (V2a) works fine. 
And a contract with dual inheritance of the same inverface (V2) has a broken storage layout.
