export interface ClassBindingObject {
    [name: string]: any;
}

export type ClassBindingArray = (string | ClassBindingObject)[];

export type ClassBinding = string | ClassBindingObject | ClassBindingArray;

export interface EventsBinding {
    [event: string]: (...args: any) => any
}

export interface StyleBinding {
    [prop: string]: string | number;
}

export interface PropBinding {
    [prop: string]: any;
}