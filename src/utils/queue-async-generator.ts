export type YieldHandler<T> = (err: unknown, value: T) => void;
export type DoneHandler = (err: unknown) => void;

export interface AsyncGeneratorWriter<T> {
  done(): void;
  yield(value: T): void;
  raise(err: unknown): void;
  createYieldHandler(): YieldHandler<T>;
  createDoneHandler(): DoneHandler;
}

export interface QueueAsyncGeneratorExecutor<T> {
  (gen: AsyncGeneratorWriter<T>): void;
}

export const EMPITY_ERR = Symbol();

export class QueueAsyncGenerator<T> implements AsyncGenerator<T>, AsyncGeneratorWriter<T> {
  private queue: IteratorResult<T>[] = [];
  private enqueueListenerQueue: ((result: IteratorResult<T>) => void)[] = [];
  private err: unknown = EMPITY_ERR;
  private isDone: boolean = false;

  constructor(executor: QueueAsyncGeneratorExecutor<T>) {
    try {
      const promise: unknown = executor(this);
      if (promise instanceof Promise) {
        promise.catch(err => this.raise(err));
      }
    } catch (err) {
      this.raise(err);
    }
  }

  done(): void {
    this.enqueue({ value: undefined, done: true });
  }

  yield(value: T): void {
    this.enqueue({ value });
  }

  raise(err: unknown): void {
    this.err = err;

    this.done();
  }

  createYieldHandler(): YieldHandler<T> {
    return (err, value) => {
      if (err) return this.raise(err);

      this.yield(value);
    }
  }

  createDoneHandler(): DoneHandler {
    return err => {
      if (err) return this.raise(err);

      this.done();
    }
  }

  private isFinished(): boolean {
    return this.isDone && this.queue.length === 0;
  }

  private enqueue(result: IteratorResult<T>) {
    if (this.isDone) return;

    this.queue.push(result);

    if (result.done) {
      this.isDone = true;

      for (const listener of this.enqueueListenerQueue) {
        listener(result);
      }

      this.enqueueListenerQueue = [];

      return;
    }

    this.enqueueListenerQueue.shift()?.(result);
  }

  [Symbol.asyncIterator](): AsyncGenerator<T> {
    return this;
  }

  async return(): Promise<IteratorResult<T, any>> {
    return { value: undefined, done: true };
  }

  private async dequeue(): Promise<IteratorResult<T>> {
    if (this.err !== EMPITY_ERR) return Promise.reject(this.err);
    if (this.isFinished()) return Promise.resolve({ done: true, value: undefined });

    const result = this.queue.shift();
    if (result !== undefined) return result;

    return new Promise<IteratorResult<T>>((res, rej) => {
      this.enqueueListenerQueue.push(result => {
        if (this.err !== EMPITY_ERR) return rej(this.err);

        this.queue.shift();

        res(result);
      });
    });
  }

  async next(): Promise<IteratorResult<T>> {
    return this.dequeue();
  }

  chunks(size: number): QueueAsyncGenerator<T[]> {
    return new QueueAsyncGenerator<T[]>(async gen => {
      while (this.isFinished() === false) {
        let results: Promise<IteratorResult<T>>[] = [];

        for (let i = 0; i < size; i++) {
          const result = this.next();

          results.push(result);
        }

        const chunk = await Promise
          .all(results)
          .then(chunk => chunk
            .filter(result => !result.done)
            .map(result => result.value as T)
          );

        if (chunk.length > 0) {
          gen.yield(chunk);
        }
      }

      gen.done();
    });
  }

  async collect(): Promise<T[]> {
    let arr: T[] = [];

    for await (const value of this) {
      arr.push(value);
    }

    return arr;
  }

  throw(e?: any): Promise<IteratorResult<T, any>> {
    return Promise.reject(e);
  }
}