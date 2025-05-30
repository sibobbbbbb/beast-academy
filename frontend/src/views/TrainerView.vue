<script setup lang="ts">
    import { onMounted, ref, type Ref} from 'vue'; //computed,
    import UserlistComponent, { type SlotProps, type ChildComponentExpose } from '@/components/UserlistComponent.vue';
    //import { type memberlistOp } from '@/types/memberlistOperation';
    //import { assignTrainer, removeStudents, getStudents } from '@/services/trainerAssignmentServices';
    import {selectedCount, clearSelectedMembers, exportToExcel, exportToFile} from '@/utils/memberSelection'; // clearSelectedMembers, exportToExcel, 
    import { type Member } from '@/types/member';
    import { useDeviceModeStore } from '@/stores/deviceMode';
    //import { MoveUpLeftIcon } from 'lucide-vue-next';
    import { useRouter } from 'vue-router';

    // Add member / Bottom button
    // Delete member - process member / members action // Avail only when selecting one or more
    // Export - process members action // Same as Delete member
    // Edit - process member action // Always available as button

    const deviceStore = useDeviceModeStore();

    const ulistRef : Ref<ChildComponentExpose | null> = ref(null);

    const revealActions : Ref<boolean> = ref(false);

    const router = useRouter();

    function modeSet() {
        revealActions.value = selectedCount.value > 0 ? true : false
    }

    const mobileMode = ref(false)

    function navigateToNotes(item: Member) {
        router.push(`/notes-list/${item.id}`);
    }

    onMounted(() => {
        mobileMode.value = deviceStore.currentMode === 'mobile' 
        if (!mobileMode.value) {
            isMulti.value = true
        }
    })

    enum mobileContext {
        export
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
    function processMemberContext() {
        switch (currentMobileContext.value) {
            case (mobileContext.export) : {
                // no multi select tap
                break;
            } 
            default : {
                
            }
        }
    }

    const isMulti = ref(false);


</script>

<template>
    <!-- <span v-if="revealActions">
        <button @click="exportToExcel()"> Export to XLSX </button>
        <button @click="console.log('delet')"> Delete </button>
    </span> -->

    <!-- <button v-if="userRole === 'trainer'" @click="navigateToNotes(item)"> + </button> -->

    <button @click="exportToFile"> Export to WORD </button>
    <button @click="exportToExcel"> Export to XSLX </button>

    <UserlistComponent @process-member="(member : Member) => {navigateToNotes(member)}"
        ref="ulistRef"
        :multi-select="isMulti"
        @memberlist-operation="modeSet"
        role-filter="member"
        @mobile-long-press="() => {
            isMulti = true
        }"
        @update:multi-select="(state : boolean) => {
            clearSelectedMembers()
            isMulti = state;
        }"
        >
        
        <template v-slot="{ item }: SlotProps">
            <button @click="navigateToNotes(item)">Add Notes</button>
        </template>

        <template #mobile-actions>
            <button @click="switchMode(mobileContext.export)"> Export </button>
        </template>


    </UserlistComponent>
    
</template> 