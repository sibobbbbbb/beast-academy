<script setup lang="ts">
import { computed } from 'vue';

    const props = withDefaults(defineProps<{
        currentPage : number;
        pageCount : number;
        maxPageDistance? : number;
    }>(), {
        maxPageDistance : 2,
    })
    const emits = defineEmits<{
        goToPage : [pageNo : number]
    }>()

    const leftPages = computed(() => {
        let leftMost = Math.min(Math.max(1, props.currentPage + 1 - props.maxPageDistance), Math.max(props.pageCount - (props.maxPageDistance * 2 + 1) + 1 , 1))
        let l_array = Array.from({ length: (props.currentPage) - leftMost + 1 }, (_, index) => leftMost + index);
        console.log("L",leftMost) 
        return l_array
    })

    const rightPages = computed(() => {
        let rightMost = Math.max(Math.min(props.pageCount, props.currentPage + 1 + props.maxPageDistance, props.pageCount), Math.min(props.maxPageDistance * 2 + 1, props.pageCount))
        let r_array = Array.from({ length: rightMost - (props.currentPage)  - 1}, (_, index) => props.currentPage + 2 + index);
        console.log("R",rightMost)
        return r_array
    })
</script>

<template>
    <ul>
        <li v-for="l_id in leftPages" :key="l_id" @click="() => {emits('goToPage',l_id-1)}">
            {{ l_id }}
        </li>
        <li style="text-decoration: underline;" class="selected">
            {{ props.currentPage + 1 }}
        </li>
        <li v-for="r_id in rightPages" :key="r_id" @click="() => {emits('goToPage',r_id-1)}">
            {{ r_id }}
        </li>
    </ul>
</template>

<style>
    li {
        padding: 1dvw;
        border-radius: 10dvw;
        width: 2dvh;
        margin: 0 2%;
        aspect-ratio: 1 / 1;
        background-color: var(--color-background-soft);
        cursor: pointer;
        border-color: var(--color-border);
    }

    li:hover {
        background-color: var(--color-background-mute);
    }

    li.selected {
        background-color: var(--color-border);
    }
</style>