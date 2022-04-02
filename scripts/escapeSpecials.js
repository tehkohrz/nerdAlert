/*
; - works
' - \q\qt - try this one
" - \qq\qt - try this one
` - \sq\sq
\\'-\q\eqt - quote that is escaped in the quote
\\"-\qq\eqt - quote that is escaped in the quote
new line - \r\n - can still be typed into editor and not affect format
tab - \t
certain indentations dont have symbols but formating retains

if there are all three quotes it will save single quotes as \'
escaped single quotes will be \\'
*/

const charMapping = [
  {
    actual: "\\'" ,
    map: "/q/eqt",
  },
  {
    actual: '\\"' ,
    map: "/qq/eqt",
  },
  {
    actual: "`" ,
    map: "/sq/sq",
  },
  {
    actual: "'" ,
    map: "/q/qt",
  },
  {
    actual: '"' ,
    map: "/qq/qt" ,
  },
  {
    actual: ";" ,
    map: "/sm/cl",
  },
];


export function escapeSpecials(string) {
  let escapedString = string;
  // find escaped specials first sorted in mapping array sequence
  charMapping.forEach((char) => {
    // console.log('Before:', escapedString);
    // console.log('Actual', char.actual, '; Mapped', char.map);
    escapedString = escapedString.replaceAll(char.actual, char.map);
    // console.log('Escaped: ',escapedString);
    // console.log('\n');
  })
  return escapedString;
}

export function returnSpecials(escapedString) {
  let string = escapedString;
  // find escaped specials first sorted in mapping array sequence
  charMapping.forEach((char) => {
    // console.log('Before:', string);
    string = string.replaceAll(char.map, char.actual);
    // console.log('After: ',string);
    // console.log('\n');
  })
  return string;
}
