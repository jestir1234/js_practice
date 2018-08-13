const fibs = (n, fibs_hash = new Map([[0, 0], [1, 1]])) => {
  if (n === 0 || fibs_hash.get(n)) {
    return fibs_hash.get(n);
  } else {
    fibs_hash.set(n, fibs(n - 2, fibs_hash) + fibs(n - 1, fibs_hash));
    return fibs_hash.get(n);
  }
};

// console.log(fibs(5));

const mul = a => b => c => a * b * c;

const checkIfAnArray = array => {
  if (Object.prototype.toString.call(array) === "[object Array]") {
    console.log(`${array} is an array`);
  } else {
    console.log("NOT AN ARRAY!");
  }
};

// checkIfAnArray([1, 2, 3]);
// checkIfAnArray({});

// BubbleSort O(n^2): iterate through array, comparing and swapping pairs. The largest number will "bubble" to the top so after each outer iteration you can reduce the length of the inner iteration by 1 knowing that the current largest number has been bubbled up.

const bubbleSort = array => {
  let len = array.length;

  for (let i = 0; i < array.length; i++) {
    for (let j = 0, stop = len - i - 1; j < stop; j++) {
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
      }
    }
  }

  return array;
};

// console.log(
//   bubbleSort(
//     [...Array(Math.floor(Math.random() * 100))].map(i =>
//       Math.floor(Math.random() * 1000)
//     )
//   )
// );

// console.log(bubbleSort([6, 10, 9, 4, 1, -4]));

// BFS
const myQuerySelectorBFS = function(identifier) {
  console.log("Running myQuerySelectorBFS...");
  if (identifier[0].match(/[^a-zA-Z.#]/))
    throw Error("Invalid identifier provided.");

  let searchString = identifier[0].match(/[.#]/)
    ? identifier.slice(1)
    : identifier;
  let searchClassOrId = !!identifier[0].match(/[.#]/);

  let queu = [this.children[0]];

  while (queu.length) {
    let currentNode = queu[0];

    if (
      searchClassOrId &&
      (currentNode.className === searchString ||
        currentNode.id === searchString)
    ) {
      return currentNode;
    }

    if (!searchClassOrId && currentNode.nodeName.toLowerCase() === searchString)
      return currentNode;

    if (currentNode.children) {
      for (let i = 0; i < currentNode.children.length; i++) {
        queu.push(currentNode.children[i]);
      }
    }
    // console.log("queu", queu);

    queu.shift();
  }

  return null;
};

// DFS
const myQuerySelectorDFS = function(identifier) {
  console.log("Running myQuerySelectorDFS...");
  if (identifier[0].match(/[^a-zA-Z.#]/))
    throw Error("Invalid identifier provided.");

  let searchString = identifier[0].match(/[.#]/)
    ? identifier.slice(1)
    : identifier;
  let searchClassOrId = !!identifier[0].match(/[.#]/);

  let stack = [this.children[0]];

  while (stack.length) {
    let currentNode = stack.pop();

    if (
      searchClassOrId &&
      (currentNode.className === searchString ||
        currentNode.id === searchString)
    ) {
      return currentNode;
    }

    if (!searchClassOrId && currentNode.nodeName.toLowerCase() === searchString)
      return currentNode;

    if (currentNode.children) {
      for (let i = currentNode.children.length - 1; i >= 0; i--) {
        stack.push(currentNode.children[i]);
      }
    }
  }

  return null;
};

document.__proto__.myQuerySelectorBFS = myQuerySelectorBFS.bind(document);
document.__proto__.myQuerySelectorDFS = myQuerySelectorDFS.bind(document);

console.log(document.myQuerySelectorBFS(".list-item"));
console.log(document.myQuerySelectorDFS(".list-item"));

/* The answer below solves the Uber problem "Write jQuery's '$' method". It creates a custom element class that has addClass, removeClass, and delay methods - being able to chain methods.
*/

class MyElement {
  constructor(node) {
    this.node = node;
    this.actionQueu = [];
    this.triggeringAction = false;
  }

  addClass(classname) {
    if (!this.actionQueu.length) {
      this.node.classList.add(classname);
      return this;
    } else {
      console.log("action queue populated");
      if (!this.triggeringAction) {
        console.log("triggering action...");
        this.triggeringAction = true;
        this.actionQueu[0]().then(done => {
          console.log("resolving action...");
          this.triggerAction = false;
          this.actionQueu.shift();
          this.resolveQueu();
        });
      }
    }

    let addFunc = () =>
      new Promise((resolve, reject) => {
        console.log("adding class...", classname);
        this.node.classList.add(classname);
        resolve(this);
      });

    this.actionQueu.push(addFunc);
    return this;
  }

  removeClass(classname) {
    if (!this.actionQueu.length) {
      this.node.classList.remove(classname);
      return this;
    } else {
      if (!this.triggeringAction) {
        this.triggeringAction = true;
        this.actionQueu[0]().then(done => {
          console.log("done", done);
          this.triggerAction = false;
          this.actionQueu.shift();
          this.resolveQueu();
        });
      }
    }

    let removeFunc = () =>
      new Promise((resolve, reject) => {
        console.log("removing class...", classname);
        this.node.classList.remove(classname);
        resolve(this);
      });

    this.actionQueu.push(removeFunc);
    return this;
  }

  delay(seconds) {
    let delayFunc = () =>
      new Promise((resolve, reject) => {
        console.log("calling delay...", seconds);
        setTimeout(() => {
          console.log("finished delay...", seconds);
          resolve(this);
        }, seconds);
      });
    this.actionQueu.push(delayFunc);
    return this;
  }

  async resolveQueu() {
    console.log("resolving queue....", this.actionQueu);
    for (let i = 0; i < this.actionQueu.length; i++) {
      console.log("queu func", this.actionQueu[i]);
      await this.actionQueu[i]();
    }
  }
}

const _$ = identifier => {
  let element = document.querySelector(identifier);
  return new MyElement(element);
};

let updatedNode = _$("div")
  .delay(1000)
  .addClass("regular-size")
  .addClass("red")
  .delay(2000)
  .addClass("blue")
  .delay(2000)
  .removeClass("blue")
  .delay(1500)
  .addClass("medium-font")
  .delay(1000)
  .addClass("big-font")
  .delay(1000)
  .addClass("blue");

// Miguel's implementation

class MyElement {
  constructor(node) {
    this._node = node;
    this._actionQueue = Promise.resolve();
  }

  _queue(callback) {
    this._actionQueue = this._actionQueue.then(() => callback());
  }

  addClass(...className) {
    this._queue(() => {
      return new Promise(resolve => {
        resolve(this._node.classList.add(...className));
      });
    });

    return this;
  }

  removeClass(...className) {
    this._queue(() => {
      return new Promise(resolve => {
        resolve(this._node.classList.remove(...className));
      });
    });

    return this;
  }

  delay(time) {
    this._queue(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, time);
      });
    });

    return this;
  }
}

const _$ = selector => {
  const node = document.querySelector(selector);
  return new MyElement(node);
};

_$("#head")
  .addClass("textColor")
  .addClass("bgColor")
  .removeClass("add-fontSize")
  .delay(5000)
  .addClass("add-padding")
  .delay(3000)
  .removeClass("bgColor")
  .addClass("add-fontSize");

// Create multiple function without using * and using recursion
const myMultiply = (a, b) => {
  if (a === 0 || b === 0) return 0;

  if (b < 0 && a > 0) {
    return 0 - a + myMultiply(a, (b += 1));
  }

  if (a < 0 && b > 0) {
    return 0 - b + myMultiply((a += 1), b);
  }

  if (a < 0 && b < 0) {
    return 0 - a + myMultiply(a, (b += 1));
  }

  return a + myMultiply(a, (b -= 1));
};

console.log(myMultiply(15, 4));

// Currying Higher Order Function factory

const myCurried = fn => {
  const curriedFunc = (...args) => {
    let currentArgs = args;
    return (...otherArgs) => {
      let innerArgs = currentArgs.concat(otherArgs);

      if (innerArgs.length >= fn.length) {
        return fn(...innerArgs);
      } else {
        return curriedFunc(...innerArgs);
      }
    };
  };

  return curriedFunc();
};

const addFunc = (a, b, c, d) => a + b + c + d;

const curriedAdd = myCurried(addFunc);

console.log(curriedAdd(1)(2)(3)(4));

const greetingFn = (greeting, name) => {
  return `${greeting} ${name}`;
};

const curriedGreeting = myCurried(greetingFn);

const curriedHello = curriedGreeting("Hello");

const curriedHola = curriedGreeting("Hola");

console.log(curriedHello("John")); // Should be 'Hello John'
console.log(curriedHola("John")); // Should be 'Hola John'
console.log(curriedGreeting("Konichiwa", "Toshi")); // Should be Konichiwa Toshi
console.log(curriedGreeting("Sup")("Homie"));

const purchaseFunc = (item, count, price) => {
  return `Bought ${count} ${item}s for ${price * count}`;
};

const curriedPurchase = myCurried(purchaseFunc);

const curriedBuyCats = curriedPurchase("Cat");
const curriedBuyDogs = curriedPurchase("Dog");

console.log(curriedBuyCats(5)(100));
console.log(curriedBuyDogs(20)(11));
