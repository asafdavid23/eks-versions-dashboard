import { ref } from 'vue';
import ClusterTable from './components/ClusterTable.vue';
export default (await import('vue')).defineComponent({
    name: 'App',
    components: {
        ClusterTable
    },
    setup() {
        const clusters = ref([]);
        return {
            clusters
        };
    }
});
const __VLS_ctx = {};
const __VLS_componentsOption = {
    ClusterTable
};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    id: "app",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
const __VLS_0 = {}.ClusterTable;
/** @type {[typeof __VLS_components.ClusterTable, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    clusters: (__VLS_ctx.clusters),
}));
const __VLS_2 = __VLS_1({
    clusters: (__VLS_ctx.clusters),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_dollars;
let __VLS_self;
