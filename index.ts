// uncomment to make the code below work as expected...
// import './workerd-polyfills';

console.log('1.   scheduling microtasks works just fine');
const microtask = Promise.resolve('my microtasks');

console.log('2.   awaiting microtasks works just fine as well');
await microtask;

console.log('3.   scheduling tasks from a global scope expression...');
try {
  setTimeout(() => {
    console.log('> executing a scheduled task #1 <');
  }, 0);
  console.log('3a.  works just fine');
} catch (e) {
  console.log('3b.  throws an exception:\n   ', e);
}

console.log('4.   if I wrap the same task into a promise...');
const wait0sec = new Promise((resolve) => {
  console.log('4+.  and schedule it...');

  try {
    setTimeout(() => {
      console.log('> executing a scheduled task #2 <');
      resolve(0);
    }, 0);
    console.log('4+a.  it works just fine');
  } catch (e) {
    console.log(
      '4+b.  we once again throw an exception but this time it gets trapped in a promise as expected:\n   ',
      e,
    );
    throw e;
  }
});

console.log('5.   and only once the promise is awaited...');
try {
  await wait0sec;
  console.log('5a.  everything still works!');
} catch (e) {
  console.log('5b.  the exception is propagated:\n   ', e);
}

// The thrown exception looks like this:
// Uncaught Error: Some functionality, such as asynchronous I/O, timeouts, and generating random values, can only be performed while handling a request.

export default {
  async fetch() {
    return new Response('hello awaited world!');
  },
};
