<script lang="ts" setup>
</script>
<template>
    <tr class="mobile_item">

        <td class="primary">
            <slot name="main">
                Name
            </slot>
        </td>
        <td>
            <slot name="x1">
            </slot>
        </td>
        <td>
            <slot name="x2">
            </slot>
        </td>
        <td>
            <slot name="x3">
            </slot>
        </td>
    </tr>
</template>

<style>
.mobile_item {
    height: 4rem;
    border: 2px solid red;
    margin: 0.5rem 0px;
    display: flex;
    flex-direction: row;
}

td {
    flex-grow: 0.5;
    text-align: center;
}

td #text {
    max-height: 0.1rem;
    
}

.mini-text {
    display: block;
    font-size: 1.75rem;
    line-height: 2rem;
    margin-top: 0.1rem;
}


.primary {
    flex-grow: 2;
    text-align: start;
    padding-left: 1rem;
    font-weight: bold;
    font-size: 1.25rem
}

td label {
    display: block;
    font-size: 0.75rem;
    font-weight: bold;
}
</style>