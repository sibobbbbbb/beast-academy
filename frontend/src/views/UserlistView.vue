<script setup lang="ts">
    import {ref, type Ref} from 'vue';
    import UserlistComponent from '@/components/UserlistComponent.vue';

    enum Selection {
        Trainer = "Trainer",
        Members = "Members"
    }

    // const mode : Ref<Selection> = ref(Selection.)
    
</script>

<template>
    <UserlistComponent @process-members="(member) => {console.log(member)}"/>
</template>