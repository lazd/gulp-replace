/**
 * replace
 * gulp-replace can be called with a string or regex.
 *
 * @param search       The string or regex to search for
 *
 * @param _replacement The replacement string or function.
 *                     <p>If replacement is a function, it will be called once for each match and will be passed the string
 *                     that is to be replaced. The value of `this.file` will be equal to the vinyl instance for the file
 *                     being processed.</p>
 *                     Read more at
 *                     <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_string_as_a_parameter">String.prototype.replace() at MDN web docs</a>
 *
 * @param options     `options.skipBinary` will be equal to `true` by default.
 *                     <p>Skip binary files. This option is true by default. If
 *                     you want to replace content in binary files, you must explicitly set it to false</p>
 *
 */
export declare function replace(
    search: string | RegExp,
    _replacement: string | (() => string) | ((search: string, ...args: any[]) => string),
    options?: { skipBinary: boolean }
): any; /* The type of return value should not be `any`, but I could not find the types definition of  */
