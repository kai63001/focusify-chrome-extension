let timer = null;
let remainingTime = 0;

self.onmessage = function(e) {
  if (e.data.action === 'start') {
    remainingTime = e.data.time;
    if (!timer) {
      timer = setInterval(() => {
        remainingTime--;
        self.postMessage({ time: remainingTime });
        if (remainingTime <= 0) {
          clearInterval(timer);
          timer = null;
        }
      }, 1000);
    }
  } else if (e.data.action === 'stop') {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }
};