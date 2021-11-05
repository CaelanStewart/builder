export interface IPublicPromise<T = void> extends Promise<T> {
    resolve(value?: T | PromiseLike<T>): void;
    reject(reason?: any): void;
}

type UninitialisedPublicPromise<T> = Omit<IPublicPromise<T>, 'resolve'|'reject'>
    & Partial<Pick<IPublicPromise<T>, 'resolve'|'reject'>>;

export default function createPublicPromise<T = void>(): IPublicPromise<T> {
    let resolve = null, reject = null;

    const promise: UninitialisedPublicPromise<T> = new Promise((res, rej) => {
        [resolve, reject] = [res, rej];
    });

    (promise as any).resolve = resolve;
    (promise as any).reject = reject;

    return promise as IPublicPromise<T>;
}