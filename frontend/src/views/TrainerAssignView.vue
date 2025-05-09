<script setup lang="ts">
    import {computed, ref, type Ref} from 'vue';
    import UserlistComponent, { type SlotProps, type ChildComponentExpose } from '@/components/UserlistComponent.vue';
    import { type memberlistOp } from '@/types/memberlistOperation';
    import { assignTrainer, removeStudents, getStudents } from '@/services/trainerAssignmentServices';
    import { selectMembers, clearSelectedMembers } from '@/utils/memberSelection';
import type { Member } from '@/types/member';

    enum Selection {
        Trainer = "Trainer",
        Members = "Members"
    }

    const ulistRef : Ref<ChildComponentExpose | null> = ref(null);
    
    // function doStuff() {
    //     if (ulistRef.value) {
    //         ulistRef.value.processSelectedMembers();
    //     }
    // }

    const phase : Ref<Selection> = ref(Selection.Trainer);
    const filter = computed(() => {
        return phase.value === Selection.Trainer ? "trainer" : "member";
        });

    // const mode : Ref<Selection> = ref(Selection.)

    const selectedTrainerID : Ref<number | null> = ref(null);

    function selectTrainerid(trainerid : number) {
        selectedTrainerID.value = trainerid
        // refresh selection to match trainer
        getStudents(selectedTrainerID.value).then((value : Member[]) => {
            selectMembers(value);
            phase.value = Selection.Members
        });
    }

    function returnFromTrainer() {
        selectedTrainerID.value = null
        clearSelectedMembers()
        phase.value = Selection.Trainer
    }

    // function finalizeSelection() {
    //     // do something lmao
    // }

    function addOrRemoveStudents(op : memberlistOp) {
        console.log('Proc')
        if (op.operation === "add") {
            //console.log("Add")
            //console.log(op.member)
            assignTrainer(selectedTrainerID.value!, [op.member.id])
        }
        else if (op.operation === "remove") {
            //console.log("Rem")
            //console.log(op.member)
            removeStudents(selectedTrainerID.value!, [op.member.id])
        }
        else {
            console.error("Illegal operation type, which shouldnt happen wtf did you do")
        }
    }
    
</script>

<!-- TS like crazy complicated but ill try to make it clear and easy -->
<!-- TLDR : PC Version allows you to scope slots, allowing you to define buttons that corespond to each member -->
<!-- TLTLDR : PC Ver make action button that take Member -->

<!-- TLDR : Mobile version instead uses emits for single member operations -->
<!-- TLTLDR : Use emits for mobile -->

<template>
    <h1> Select {{ phase }} </h1>
    <button v-if="selectedTrainerID" @click="returnFromTrainer"> Return </button>
    <UserlistComponent @process-member="(member : Member) => {selectTrainerid(member.id)}"
        ref="ulistRef"
        @memberlist-operation="addOrRemoveStudents"
        v-slot="{ item }: SlotProps"
        :multi-select="phase === Selection.Members"
        :role-filter="filter">

        <button v-if="phase === Selection.Trainer" @click="selectTrainerid(item!.id)">Change Student</button>

    </UserlistComponent>
</template>