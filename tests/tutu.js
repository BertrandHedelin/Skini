// 8585

function merge(target, ...sources) {
  for(let source of sources) {
  for(let key of Object.keys(source)) {
  if (!(key in target)) { // This is different than Object.assign()
  target[key] = source[key];
  }
  }
  }
  return target;
 }
 let t1 = Object.assign({x: 1}, {x: 2, y: 2}, {y: 3, z: 4}) // => {x: 2, y: 3, z: 4}
 let t2 = merge({x: 1}, {x: 2, y: 2}, {y: 3, z: 4}) // => {x: 1, y: 2, z: 4}
 console.log(t1,t2)

 let point = {
  x: 1,
  y: 2,
  toString: function() { return `(${this.x}, ${this.y})`; },
  toJSON: function() { return this.toString(); }
 };
 console.log(JSON.stringify(point))// => '["(1, 2)"]'
 
 let position = { x: 0, y: 0 };
let dimensions = { width: 100, height: 75 };
let rect = { ...position, ...dimensions };
console.log(rect.x + rect.y + rect.width + rect.height )// => 175

let letters = [..."hello world"];
console.log([...new Set(letters)]) // => ["h","e","l","o"," ","w","r","d"]
