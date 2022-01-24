run `yarn nx build lib1` is has a dep on `lib2`

You will see:

```
➜ yarn nx build lib1
yarn run v1.22.17
$ /Users/jaybell/WebstormProjects/swc-dep-build-test/node_modules/.bin/nx build lib1

 >  NX   Running target build for project lib1 and 1 task(s) it depends on

 ———————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————

> nx run lib1:build

Compiling with SWC for lib1...
Successfully compiled: 2 files with swc (15.07ms)
(node:31386) UnhandledPromiseRejectionWarning: Error: Invalid config file: [object Object],[object Object]
    at /Users/jaybell/WebstormProjects/swc-dep-build-test/node_modules/@nrwl/js/src/utils/typescript/run-type-check.js:62:19
    at Generator.next (<anonymous>)
    at fulfilled (/Users/jaybell/WebstormProjects/swc-dep-build-test/node_modules/tslib/tslib.js:114:62)
(node:31386) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). To terminate the node process on unhandled promise rejection, use the CLI flag `--unhandled-rejections=strict` (see https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode). (rejection id: 1)
(node:31386) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
```

Where the error that isn't being serialized right is something like

```
[
    {
        "messageText": "Cannot read file '/Users/jaybell/WebstormProjects/trellis-mono3/Users/jaybell/WebstormProjects/trellis-mono3/libs/type/auction/tsconfig.lib.json'.",
        "category": 1,
        "code": 5083
    },
    {
        "messageText": "No inputs were found in config file 'tsconfig.json'. Specified 'include' paths were '[\"**/*\"]' and 'exclude' paths were '[]'.",
        "category": 1,
        "code": 18003
    }
]
```

Which is because the generated tsconfig for the lib that overwrites import path mappings is being generated with the path to the root of the workspace root in it when it shouldn't be

generated tsconfig
```
{
  "compilerOptions": {
    "paths": {
      "@swc-dep-build-test/lib2": [
        "dist/packages/lib2"
      ]
    }
  },
  "extends": "../../../Users/jaybell/WebstormProjects/swc-dep-build-test/packages/lib1/tsconfig.lib.json"
}
```

That should actually be `../../../sswc-dep-build-test/packages/lib1/tsconfig.lib.json`
