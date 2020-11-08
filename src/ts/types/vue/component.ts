import {defineComponent, ComponentOptions} from 'vue';

export interface ComponentMap {
    [name: string]: ComponentOptions
}

function f() {
    const map: ComponentMap = {
        test: defineComponent({

        })
    }


    map.test;
}