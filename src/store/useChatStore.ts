// import { create } from "zustand";
// import { UserChatModel } from "../models";
// import { chatService } from "../services/chatService";

// interface ChatState {
//   allChatUsers: UserChatModel[];
//   filteredChatUsers: UserChatModel[];
//   currentChatUser: UserChatModel | null;
//   isSearching: boolean;
//   isChatLoading: boolean;

//   // Actions
//   setAllChatUsers: (users: UserChatModel[]) => void;
//   setCurrentChatUser: (user: UserChatModel | null) => void;
//   searchUsers: (query: string) => void;
//   setSearchingStatus: (status: boolean) => void;
//   refreshUsers: (storeName: string, currentUserId: string) => Promise<void>;
// }

// export const useChatStore = create<ChatState>((set, get) => ({
//   allChatUsers: [],
//   filteredChatUsers: [],
//   currentChatUser: null,
//   isSearching: false,
//   isChatLoading: false,

//   setAllChatUsers: (users) => {
//     set({ allChatUsers: users, filteredChatUsers: users });
//   },

//   setCurrentChatUser: (user) => {
//     set({ currentChatUser: user });
//   },

//   searchUsers: (query) => {
//     const { allChatUsers } = get();
//     if (!query) {
//       set({ filteredChatUsers: allChatUsers });
//       return;
//     }

//     const filtered = allChatUsers.filter(user =>
//       user.user_name?.toLowerCase().includes(query.toLowerCase())
//     );
//     set({ filteredChatUsers: filtered });
//   },

//   setSearchingStatus: (status) => {
//     set({ isSearching: status });
//   },

//   refreshUsers: async (storeName, currentUserId) => {
//     set({ isChatLoading: true });
//     try {
//       const users = await chatService.getStoreUsers(storeName, currentUserId);
//       set({ allChatUsers: users, filteredChatUsers: users });
//     } catch (e) {
//       console.error("Failed to refresh chat users", e);
//     } finally {
//       set({ isChatLoading: false });
//     }
//   }
// }));
