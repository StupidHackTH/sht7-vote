let currentSegment:
  | { start: number; timer: ReturnType<typeof setTimeout> }
  | undefined;
let totalTime = 0;

export function tickTime() {
  if (!currentSegment) {
    currentSegment = {
      start: performance.now(),
      timer: setTimeout(() => {
        collectTime();
      }, 2000),
    };
  } else {
    clearTimeout(currentSegment.timer);
    currentSegment.timer = setTimeout(() => {
      collectTime();
    }, 2000);
  }
}

export function collectTime() {
  if (currentSegment) {
    const time = performance.now() - currentSegment.start;
    totalTime += time;
    clearTimeout(currentSegment.timer);
    currentSegment = undefined;
  }
  return totalTime;
}

export function resetTime() {
  if (currentSegment?.timer) {
    clearTimeout(currentSegment.timer);
  }
  totalTime = 0;
  currentSegment = undefined;
}
