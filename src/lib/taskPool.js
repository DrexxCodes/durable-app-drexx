/**
 * Runs async tasks with a concurrency cap. A failing task never stops the others
 * (each request already handles its own errors).
 */
export async function runPool(tasks, concurrency = 3) {
  let next = 0;
  const worker = async () => {
    while (next < tasks.length) {
      const task = tasks[next++];
      try {
        await task();
      } catch {
        /* handled by the individual action */
      }
    }
  };
  await Promise.all(Array.from({ length: Math.min(concurrency, tasks.length) }, worker));
}
