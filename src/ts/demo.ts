import {createApp} from 'vue';
import {createStore} from 'vuex';
import Demo from '@/components/demo.vue';

const store = createStore({
    state() {
        return {
            builderOptions: {
                
            }
        }
    }
})

createApp(Demo)
    .mount('#root');