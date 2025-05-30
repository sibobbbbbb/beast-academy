<script setup lang="ts">
const emits = defineEmits<{
    sort: [sortid: string, reverse: boolean]
}>();

const props = defineProps<{
    sortid?: string
    active?: string
}>();
</script>

<template>
    <div class="sortable-header">
        <span class="header-text">
            <slot>HEADER_NAME</slot>
        </span>
        <div class="sort-buttons">
            <button :class="{'selected' : active == 'asc'}" @click="emits('sort', props.sortid || '', false)">▲</button>
            <button :class="{'selected' : active == 'desc'}" @click="emits('sort', props.sortid || '', true)">▼</button>
        </div>
    </div>
</template>

<style scoped>
.sortable-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    width: 100%;
}

.header-text {
    flex-grow: 1;
}

.sort-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
}

button {
    background: var(--neutral-400);
    border: 1px var(--neutral-600) solid;
    cursor: pointer;
    font-size: 0.8rem;
    padding: 0.10rem 0.4rem;
    border-radius: 5rem;
    aspect-ratio: 1;
}

button.selected {
    background: var(--neutral-600);
    border: 1px var(--neutral-400) solid;
}
</style>
