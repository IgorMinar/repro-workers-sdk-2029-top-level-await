
// this await one works just fine
await Promise.resolve("yay, scheduling microtasks works!");

const wait0sec = () =>
  new Promise((resolve) =>
    setTimeout(() => {
      console.log("ouch, scheduling tasks doesn't work!");
      resolve(0);
    }, 0)
  );

// but this await one throws:
// Uncaught Error: Some functionality, such as asynchronous I/O, timeouts, and generating random values, can only be performed while handling a request.
await wait0sec();

export default {
  async fetch() {
    return new Response("hello awaited world!");
  },
};
