<script setup lang="ts">
    import {onMounted, ref, type Ref} from 'vue';
    import UserlistComponent, { type SlotProps, type ChildComponentExpose } from '@/components/UserlistComponent.vue';
    // import { type memberlistOp } from '@/types/memberlistOperation';
    //import { assignTrainer, removeStudents, getStudents } from '@/services/trainerAssignmentServices';
    import { selectedCount} from '@/utils/memberSelection'; //clearSelectedMembers, exportToExcel, 
    import { type Member } from '@/types/member';
    import { useDeviceModeStore } from '@/stores/deviceMode';
    //import { MoveUpLeftIcon } from 'lucide-vue-next';


    // Add member / Bottom button
    // Delete member - process member / members action // Avail only when selecting one or more
    // Export - process members action // Same as Delete member
    // Edit - process member action // Always available as button

    const deviceStore = useDeviceModeStore();

    const ulistRef : Ref<ChildComponentExpose | null> = ref(null);

    const revealActions : Ref<boolean> = ref(false);

    function modeSet() {
        revealActions.value = selectedCount.value > 0 ? true : false
    }

    const mobileMode = ref(false)

    onMounted(() => {
        mobileMode.value = deviceStore.currentMode === 'mobile' 
    })

    enum mobileContext {
        edit,
        export,
        delete
    }

    const currentMobileContext : Ref<null | mobileContext> = ref(null)

    function switchMode(mode : mobileContext) {
        if (currentMobileContext.value === mode) {
            currentMobileContext.value = null;
        } else {
            currentMobileContext.value = mode;
        }
    }

    //function for process member emit
    // function processMemberContext() {
    //     switch (currentMobileContext.value) {
    //         case (mobileContext.edit) : {
    //             // no multi select tap
    //             break;
    //         } 
    //         case (mobileContext.delete) : {
    //             // enable multi select
    //             break;
    //         }
    //         case (mobileContext.export) : {

    //         }
    //     }
    // }

    const isMulti = ref(false);

</script>

<template>
    <!-- <span v-if="revealActions">
        <button @click="exportToExcel()"> Export to XLSX </button>
        <button @click="console.log('delet')"> Delete </button>
    </span> -->

    <UserlistComponent @process-member="(member : Member) => {console.log(member.id)}"
        ref="ulistRef"
        :multi-select="isMulti"
        @memberlist-operation="modeSet"
        role-filter="member"
        @mobile-long-press="() => {
            isMulti = true
        }"
        >

        
        <template v-slot="{ item }: SlotProps">
            <button @click="console.log('edit',item!.id)">Edit</button>
        </template>

        <template #mobile-actions>
            <button @click="switchMode(mobileContext.edit)"> Edit </button>
            <button @click="switchMode(mobileContext.delete)"> Delete </button>
            <button @click="switchMode(mobileContext.export)"> Export </button>
        </template>


    </UserlistComponent>
    
</template>