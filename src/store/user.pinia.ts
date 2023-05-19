import { useState } from '@/utils/functional-component';
import { Role } from 'mock-1/data';
import { defineStore } from 'pinia';

// export enum Role {
//   owner = 0,
//   admin = 1,
//   staff = 2,
//   user = 3,
//   visitor = 4,
// }

export const useUserPinia = defineStore('user', () => {

  const [userRole, setUserRole] = useState<null | Role>(Role.visitor);

  function userCan (role: Role) {
    return userRole.value !== null && userRole.value <= role;
  }

  return {
    userRole,
    setUserRole,
    userCan,
  };
});
