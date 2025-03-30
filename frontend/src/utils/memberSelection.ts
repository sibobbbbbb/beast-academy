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

// Taken from https://docxtemplater.com/docs/get-started-browser/
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import { saveAs }  from "file-saver";

const backendURL = import.meta.env.VITE_API_BASE_URL;
const exportToFile = () => {
    PizZipUtils.getBinaryContent(backendURL + "/static/templateExample.docx", function(
      error,
      content
    ) {
      if (error) {
        throw error;
      }
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
      doc.render({
        "member" : Array.from(selectedMembersMap.value.values())
      });
      
      const out = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      });
      // Output the document using Data-URI
      saveAs(out, "output.docx");
    })
  };

export { selectedMembersMap, selectMember, deselectMember, clearSelectedMembers, selectMembers, isEmpty, selectedCount, exportToFile }