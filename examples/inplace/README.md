# Replace file contents in place

This example shows you how to replace file contents in place.

## Running the example

Type the following commands from the root of this repository:

```bash
npm install # install the plugin's dependencies
cd examples/inplace
npm install # install the example's dependencies
cat file.txt # See original file contentes
npx gulp
cat file.txt # See changed file contents
```

You should see something like this:

```bash
$ cat file.txt
The roof is on fire!

$ npx gulp
23:03:34] Using gulpfile ~/gulp-replace/examples/inplace/gulpfile.js
[23:03:34] Starting 'default'...
[23:03:34] Finished 'default' after 31 ms

$ cat file.txt
The world is on fire!
```
