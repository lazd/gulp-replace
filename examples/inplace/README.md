# Replace file contents in place

This example shows you how to replace file contents in place.

## Running the example

Type the following commands from the root of this repository:

```
npm install # install the plugin's dependencies
cd examples/inplace
npm install # install the example's dependencies
cat file.txt # See original file contentes
gulp
cat file.txt # See changed file contents
```
You should see something like this:

```js
$ cat file.txt
The roof is on fire!
$ gulp
[gulp] Starting 'replace'...
[gulp] Finished 'replace' after 19 ms
[gulp] Starting 'default'...
[gulp] Finished 'default' after 8.01 μs
$ cat file.txt
The world is on fire!
```
