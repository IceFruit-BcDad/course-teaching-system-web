import {defineStore} from "pinia";
import {ref} from "vue";
import {User} from "@/models/User";

export const useUserStore = defineStore("user", () => {
   const user = ref<User|undefined>();
   function setUser(u: User | undefined){
      user.value = u;
   }
   return { user, setUser};
});