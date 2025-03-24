import { type Ref, ref, computed } from "vue"
import { type Member } from "@/types/member"


const selectedMembersMap : Ref<Map<number, Member>> = ref(new Map<number, Member>());

const isEmpty = computed(() => selectedMembersMap.value.size === 0);
const selectedCount = computed(() => Array.from(selectedMembersMap.value.values()).length);

const selectMembers = (members: Member[]) => {
  members.forEach(member => {selectMember(member)});
}

const selectMember = (member: Member) => {
  selectedMembersMap.value.set(member.id, member);
}

const deselectMember = (member: Member) => {
  selectedMembersMap.value.delete(member.id);
}

const clearSelectedMembers = () => {
  selectedMembersMap.value.clear();
}

export { selectedMembersMap, selectMember, deselectMember, clearSelectedMembers, selectMembers, isEmpty, selectedCount }