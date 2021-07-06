# NFF TreeSitter Parser 

<img src="https://raw.githubusercontent.com/vhyrro/neorg/main/res/neorg.svg" width="70" height="70">

<br>
<br>

A TreeSitter grammar for [Neorg](https://github.com/vhyrro/neorg).

## Available Commands
| Command           | Result																				|
| -                 | -																						|
| `yarn`            | installs needed dependencies (only do if you don't have `tree-sitter` in your path)	|
| `yarn gen`		| `tree-sitter generate && node-gyp build`												|
| `yarn test`		| `tree-sitter test`																	|
| `yarn clean`		| removes all files generated by `yarn gen`												|

- `npm` can be used instead of `yarn`
- When `yarn` is used with no args then it's replaced with `node install`

# Features
- Has support for a very large portion of the specification.
- Has support for carryover tags
- Can show errors (yes, it can show errors in a markdown-like format, crazy)
- Isn't a massive editor hog

# Drawbacks
- Currently only uses regex notation for defining patterns. This wouldn't be a problem in e.g.
a programming language, however Neorg is a markdownesque language - it needs a more complex way of
parsing text. We do not have a custom `scanner.cc` for lexing.
- Does not support links
- Does not support attached modifiers (things like \*this\*).
- Does not inherently treat indented elements of the document as children of a node.

# :heart: Contribution
If you know a thing or two about TreeSitter and would like to support us by contributing then please do!
If you have any questions you can ask away in the Github issues or on our discord! The specification can be found in the
`docs/` directory in the [Neorg Repo](https://github.com/vhyrro/neorg).
