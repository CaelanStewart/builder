export function message(object: object, string: string): string {
    return `[${object.constructor.name}]: ${string}`;
}

export function error2<T extends ErrorConstructor>(type: T, object: object, string: string, ...log: any[]): InstanceType<T> {
    log.length && console.log(...log);

    return new type(message(object, string)) as InstanceType<T>;
}

export function assert(condition: any, message: string): void {
    if (! condition) {
        throw new Error(message);
    }
}

export function error<T extends ErrorConstructor>(type?: T) {
    let message: string,
        on: object;

    const instance = {
        warn(string: string) {
            message = `: ${type?.constructor.name}: ${string}`;
            console.warn(instance.string());
            return instance;
        },
        log(...data: any[]) {
            console.log(...data);
            return instance;
        },
        msg(string: string) {
            message = string;
            return instance;
        },
        on(object: object) {
            on = object;
            return instance;
        },
        string(): string {
            return [on?.constructor.name, message]
                .filter(value => value)
                .join(' ');
        },
        get(): InstanceType<T> {
            if (! type) {
                throw new Error('[error]: Cannot make new error, type not specified')
            }

            return new type(instance.string()) as InstanceType<T>;
        }
    };

    return instance;
}