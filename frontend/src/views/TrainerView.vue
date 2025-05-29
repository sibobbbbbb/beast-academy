<script setup lang="ts">
    import {computed, onMounted, ref, type Ref} from 'vue';
    import UserlistComponent, { type SlotProps, type ChildComponentExpose } from '@/components/UserlistComponent.vue';
    import { type memberlistOp } from '@/types/memberlistOperation';
    import { assignTrainer, removeStudents, getStudents } from '@/services/trainerAssignmentServices';
    import { clearSelectedMembers, exportToExcel, selectedCount} from '@/utils/memberSelection';
    import { type Member } from '@/types/member';
    import { useDeviceModeStore } from '@/stores/deviceMode';
    import { MoveUpLeftIcon } from 'lucide-vue-next';
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
    })

    enum mobileContext {
        edit,
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
            case (mobileContext.edit) : {
                // no multi select tap
                break;
            } 
            case (mobileContext.export) : {

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

    <UserlistComponent @process-member="(member : Member) => {navigateToNotes(member)}"
        ref="ulistRef"
        :multi-select="isMulti"
        @memberlist-operation="modeSet"
        role-filter="member"
        @mobile-long-press="() => {
            isMulti = true
        }"
        >
        
        <template v-slot="{ item }: SlotProps">
            <button @click="navigateToNotes(item)">Add Notes</button>
        </template>

        <!-- <template #mobile-actions>
            <button @click="switchMode(mobileContext.edit)"> Edit </button>
            <button @click="switchMode(mobileContext.delete)"> Delete </button>
            <button @click="switchMode(mobileContext.export)"> Export </button>
        </template> -->


    </UserlistComponent>
    
</template> 