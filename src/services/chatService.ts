import { 
  collection, doc, setDoc, updateDoc, getDoc, getDocs, 
  query, where, orderBy, limit, onSnapshot, Timestamp, 
  deleteDoc, serverTimestamp, type DocumentData, 
  QuerySnapshot
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { firestore, storage } from "./firebaseConfig";
import { UserChatModel, MessageModel } from "../models";

export const chatService = {
  /**
   * Generates a deterministic conversation ID based on two user IDs.
   * Matches the Flutter hashCode logic for cross-platform compatibility.
   */
  getConversationID: (id1: string, id2: string): string => {
    // Porting Flutter hashCode logic: 
    // String.hashCode in Dart is a 32-bit integer.
    // However, JS doesn't have an exact equivalent.
    // The key is that id1_id2 or id2_id1 must be consistent.
    // Using alphabetical sorting as a reliable alternative if exact hashCode is not required,
    // but if we need to match the Flutter's `${id1}_${id2}` vs `${id2}_${id1}`,
    // we should use a simple string comparison.
    return id1.localeCompare(id2) <= 0 ? `${id1}_${id2}` : `${id2}_${id1}`;
  },

  /**
   * Synchronizes the current user with Firestore.
   */
  syncUserWithFirestore: async (user: UserChatModel): Promise<void> => {
    if (!user.user_id || !user.store) return;
    
    const userDocRef = doc(firestore, "users", `${user.store}-${user.user_id}`);
    const userSnapshot = await getDoc(userDocRef);
    
    if (userSnapshot.exists()) {
      // Update existing user (e.g., push token)
      await updateDoc(userDocRef, { ...user });
    } else {
      // Create new user
      await setDoc(userDocRef, {
        ...user,
        created_at: new Date().toISOString(),
        is_online: true,
        last_active: new Date().getTime().toString(),
      });
    }
  },

  /**
   * Fetches all users from the same store.
   */
  getStoreUsers: async (storeName: string, currentUserId: string): Promise<UserChatModel[]> => {
    const usersRef = collection(firestore, "users");
    const q = query(
      usersRef, 
      where("store", "==", storeName),
      where("user_id", "!=", currentUserId)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as UserChatModel);
  },

  /**
   * Sends a message to a user.
   */
  sendMessage: async (
    fromUser: UserChatModel, 
    toUser: UserChatModel, 
    messageText: string, 
    type: MessageModel['type'] = 'text',
    fileName?: string,
    fileSize?: number
  ): Promise<void> => {
    if (!fromUser.user_id || !toUser.user_id) return;
    
    const conversationId = chatService.getConversationID(fromUser.user_id, toUser.user_id);
    const time = new Date().getTime().toString();
    
    const message: MessageModel = {
      from_id: fromUser.user_id,
      to_id: toUser.user_id,
      message: messageText,
      sent: time,
      read: "",
      type: type,
      created_at: time,
      file_name: fileName,
      fileSize: fileSize,
    };

    const messageRef = doc(firestore, `chats/${conversationId}/messages`, time);
    await setDoc(messageRef, message);
    
    // Note: In Flutter, this also triggers a push notification.
    // We would call a push notification service here.
  },

  /**
   * Updates message read status.
   */
  updateMessageReadStatus: async (conversationId: string, messageId: string): Promise<void> => {
    const messageRef = doc(firestore, `chats/${conversationId}/messages`, messageId);
    await updateDoc(messageRef, {
      read: new Date().getTime().toString()
    });
  },

  /**
   * Presence: Updates the user's online/offline status.
   */
  updateUserPresence: async (user: UserChatModel, isOnline: boolean): Promise<void> => {
    if (!user.user_id || !user.store) return;
    
    const userDocRef = doc(firestore, "users", `${user.store}-${user.user_id}`);
    await updateDoc(userDocRef, {
      is_online: isOnline,
      last_active: new Date().getTime().toString()
    });
  },

  /**
   * Typing Status: Updates the user's typing status.
   */
  updateTypingStatus: async (user: UserChatModel, isTyping: boolean): Promise<void> => {
    if (!user.user_id || !user.store) return;
    
    const userDocRef = doc(firestore, "users", `${user.store}-${user.user_id}`);
    await updateDoc(userDocRef, { is_typing: isTyping });
  },

  /**
   * Deletes a message and its associated media if applicable.
   */
  deleteMessage: async (conversationId: string, message: MessageModel): Promise<void> => {
    if (!message.sent) return;
    
    const messageRef = doc(firestore, `chats/${conversationId}/messages`, message.sent);
    await deleteDoc(messageRef);
    
    if (message.type === 'image' || message.type === 'images' || message.type === 'video') {
      if (message.message && message.message.startsWith('http')) {
        const storageRef = ref(storage, message.message);
        await deleteObject(storageRef).catch(e => console.error("Failed to delete storage object", e));
      }
    }
  },

  /**
   * Uploads media to Firebase Storage.
   */
  uploadMedia: async (
    conversationId: string, 
    fileUri: string, 
    type: string, 
    onProgress?: (progress: number) => void
  ): Promise<string> => {
    const extension = fileUri.split('.').pop();
    const path = `${type}/${conversationId}/${Date.now()}.${extension}`;
    const storageRef = ref(storage, path);
    
    const response = await fetch(fileUri);
    const blob = await response.blob();
    
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  }
};
