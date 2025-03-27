import { defineStore } from 'pinia'
import type { Member } from '@/types/member'

export const useMemberStore = defineStore('member', {
  state: () => ({
    member: null as Member | null
  }),
  actions: {
    setMember(data: Member) {
      this.member = data
    },
    clearMember() {
      this.member = null
    }
  }
})
