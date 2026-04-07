import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../../store/useAuthStore';

export const useSignInMutation = () => {
  const authStore = useAuthStore.getState();
  return useMutation({
    mutationFn: async ({ clientCode, userName, password }: any) => {
      return authStore.signIn(clientCode, userName, password);
    },
  });
};

export const useSignOutMutation = () => {
  const authStore = useAuthStore.getState();
  return useMutation({
    mutationFn: async () => {
      return authStore.signOut();
    },
  });
};
