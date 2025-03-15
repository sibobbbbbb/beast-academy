import { defineStore } from 'pinia';
import api from '@/utils/axios';

interface User {
  username: string;
  email: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: '' as string | null,
  }),
  actions: {
    async login(email: string, password: string) {
      try {
        const res = await api.post('/auth/login', { email, password });
        this.user = res.data.user;
        this.token = res.data.token;
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    async logout() {
      await api.post('/auth/logout');
      this.user = null;
      this.token = null;
    },
    async fetchProfile() {
      try {
        const res = await api.get('/auth/me');
        this.user = res.data;
      } catch (error) {
        console.error(error);
      }
    },
  },
});
