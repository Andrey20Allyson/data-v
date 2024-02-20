export type RejectCallback = (err: unknown) => void;
export type VoidResolveCallback = () => void;
export type VoidHandler = (err: unknown) => void
export type ValuedResolveCallback<T> = (value: T) => void;
export type ValuedHandler<T> = (err: unknown, value: T) => void;

export function handleVoid(res: VoidResolveCallback, rej: RejectCallback): VoidHandler {
  return (err: unknown) => {
    if (err) rej(err);

    res();
  }
}

handleVoid.intoPromise = function (callback: (handler: VoidHandler) => void) {
  return new Promise<void>((res, rej) => callback(handleVoid(res, rej)));
}

export function handleValued<T>(res: ValuedResolveCallback<T>, rej: RejectCallback): ValuedHandler<T> {
  return (err: unknown, value: T) => {
    if (err) rej(err);

    res(value);
  }
}

handleValued.intoPromise = function <T>(callback: (handler: ValuedHandler<T>) => void) {
  return new Promise<T>((res, rej) => callback(handleValued(res, rej)));
}