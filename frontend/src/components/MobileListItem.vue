<script lang="ts" setup>
    const emit = defineEmits(['click', 'longpress']);
</script>

<template>
    <tr class="mobile_item" @click="emit('click')" >
        <td class="primary"  @contextmenu.prevent="emit('longpress')">
            <slot name="main">
                Name
            </slot>
            <section class="mini-text">
                <slot name="sub">
                    Sub
                </slot>
            </section>
        </td>
        <!-- Slots for optional tags -->
        <td v-if="$slots.x1"><slot name="x1"/></td>
        <td v-if="$slots.x2"><slot name="x2"/></td>
        <td v-if="$slots.x3"><slot name="x3"/></td>
    </tr>
</template>

<style scoped>
.mobile_item {
  display: grid;
  width: 100%;
  gap: 0.5rem;
  margin: 0.5rem 0;
}

.selected {
    background-color: var(--neutral-300);
}

td:not(.primary) {
    padding-left: 0.125rem;
    margin-left: 0.125rem;
    border-left: 1px solid red;
}

td #text {
    max-height: 0.1rem;
    
}

.mini-text {
    display: block;
    font-size: 1rem;
    line-height: 1rem;
    margin-top: 0.1rem;
}


.primary { 
  padding: 0.25rem 1rem;
  font-weight: bold;
  font-size: 1.25rem;
}

td label {
    display: block;
    font-size: 0.75rem;
    font-weight: bold;
}
</style>