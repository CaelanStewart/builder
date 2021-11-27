import Block, {BlockOptionsType, BlockOptionType, IBlockOptions} from '@/models/block';
import {computed} from 'vue';
import {ClassBinding} from '@/types/vue/attribute-bindings';

// interface CondTuple<T extends Block, K extends keyof T['options']> {
//     class: string,
//     value: T['options'][K],
//     default: T['options'][K]
// }

interface ClassMap<T extends Block> {
    [className: string]: T['options'][keyof T['options']];
}

type IConfig<T extends Block> = {
    [K in keyof T['options']]?: string | ClassMap<T>;
}

export default function useClasses<T extends Block>(block: T, executor: IConfig<T> | ((block: T) => IConfig<T>)) {
    return computed(() => {
        const config = typeof executor === 'function' ? executor(block) : executor;
        const binding: ClassBinding = {};

        for (const [option, condition] of Object.entries(config)) {
            switch (typeof condition) {
                case 'string':
                    binding[condition] = block.getOption(option as any);
                    break;
                case 'object':
                    if (Array.isArray(condition)) {
                        binding[condition[0]] = block.getOption(option as any, condition[2]) === condition[1];
                    } else if (condition) {
                        for (const key in condition) {
                            if (condition.hasOwnProperty(key)) {
                                binding[key] = block.getOption(option as any) === condition[key];
                            }
                        }
                    }
                    break;
            }
        }

        return binding;
    });
}