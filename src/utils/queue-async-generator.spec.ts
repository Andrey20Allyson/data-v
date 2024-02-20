import { QueueAsyncGenerator, QueueAsyncGeneratorExecutor } from "./queue-async-generator";
import { describe, expect } from 'vitest';

async function* generate(): AsyncGenerator<number> {
  await sleep(10);

  for (let i = 0; i < 10; i++) {
    yield i;
  }
}

function toGeneratorExecutor<T>(gen: AsyncGenerator<T>): QueueAsyncGeneratorExecutor<T> {
  return async genWriter => {
    for await (const value of gen) {
      genWriter.yield(value);
    }

    genWriter.done();
  }
}

async function asyncCollect<T>(gen: AsyncGenerator<T>): Promise<T[]> {
  const arr: T[] = [];

  for await (const value of gen) {
    arr.push(value);
  }

  return arr;
}

function sleep(ms: number): Promise<void> {
  return new Promise(res => setTimeout(res, ms));
}

describe(QueueAsyncGenerator, test => {
  test(`Shold return the correct values`, async ctx => {
    const gen = new QueueAsyncGenerator<number>(toGeneratorExecutor(generate()));

    const resultArray = await gen.collect();
    const expectedArray = await asyncCollect(generate());

    ctx.expect(resultArray)
      .toEqual(expectedArray);
  });

  test(`Shold return a reject if generator raises a error`, async ctx => {
    const gen = new QueueAsyncGenerator(async gen => {
      gen.raise('err');
    });

    expect(gen.next())
      .rejects.toEqual('err');
  });
});
