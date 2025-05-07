If my guide wasnt understandable enough this chat gpt thing outta help ya

👤 USERLIST COMPONENT GUIDE (Human-Readable Edition)

This component helps you display and manage a list of members, with optional support for selecting one or more.
It behaves differently depending on platform (PC vs Mobile), and gives you tools to hook into those interactions.

-----------------------------------------
🔹 1. BASIC USAGE
-----------------------------------------
Just render the component:
<UserlistComponent />

-----------------------------------------
🔹 2. MULTI-SELECTION MODE
-----------------------------------------
To enable selecting multiple members (via checkboxes on PC or tap on Mobile):
<UserlistComponent multiSelect />

Later, trigger the selected member processing from the parent like this:

<script setup lang="ts">
const ulistRef = ref<InstanceType<typeof UserlistComponent> | null>(null);

function processThem() {
    ulistRef.value?.processSelectedMembers(); // emits & returns selected members
}
</script>

<UserlistComponent ref="ulistRef" multiSelect />

-----------------------------------------
🔹 3. SINGLE MEMBER ACTIONS
-----------------------------------------

✅ On **Mobile**:
Just use the emitted event:
<UserlistComponent @process-members="handleMember" />

✅ On **PC**:
Use scoped slots to get access to each item:
<UserlistComponent v-slot="{ item }: SlotProps">
    <button @click="editMember(item)">Edit</button>
</UserlistComponent>

Where `item` is a `Member` object.

-----------------------------------------
🛠️ TECH NOTE:
- You can import `SlotProps` from this file for TS type safety.
- We use defineExpose() to allow the parent to trigger `processSelectedMembers()`.

-----------------------------------------
📦 BONUS: FILTERS
You can pass a `filters` string prop to pre-filter the list (optional).
