// import { useEffect, useState } from "react";
// import { 
//   collection, query, orderBy, onSnapshot, 
//   QuerySnapshot, DocumentData, doc, where 
// } from "firebase/firestore";
// import { firestore } from "../services/firebaseConfig";
// import { MessageModel, UserChatModel } from "../models";
// import { chatService } from "../services/chatService";

// export const useChatMessages = (currentUser: UserChatModel, recipient: UserChatModel | null) => {
//   const [messages, setMessages] = useState<MessageModel[]>([]);
//   const [lastMessage, setLastMessage] = useState<MessageModel | null>(null);

//   useEffect(() => {
//     if (!currentUser.user_id || !recipient?.user_id) return;
    
//     const conversationId = chatService.getConversationID(currentUser.user_id, recipient.user_id);
//     const messagesRef = collection(firestore, `chats/${conversationId}/messages`);
//     const q = query(messagesRef, orderBy("sent", "desc"));
    
//     const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
//       const msgs = snapshot.docs.map(doc => doc.data() as MessageModel);
//       setMessages(msgs);
//       if (msgs.length > 0) {
//         setLastMessage(msgs[0]);
//       }
//     });
    
//     return () => unsubscribe();
//   }, [currentUser.user_id, recipient?.user_id]);

//   return { messages, lastMessage };
// };

// /**
//  * Hook for subscribing to a user's latest info (Online status, typing, etc.)
//  */
// export const useRecipientInfo = (recipientId: string) => {
//   const [recipientInfo, setRecipientInfo] = useState<UserChatModel | null>(null);

//   useEffect(() => {
//     if (!recipientId) return;
    
//     // Recipient info is a bit more complex in the Flutter code, 
//     // it's usually `${store}-${id}` but here we just need to find the user.
//     // However, the collection('users') and finding by user_id works.
//     const usersRef = collection(firestore, "users");
//     const q = query(usersRef, where("user_id", "==", recipientId));
    
//     const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
//       if (!snapshot.empty) {
//         setRecipientInfo(snapshot.docs[0].data() as UserChatModel);
//       }
//     });
    
//     return () => unsubscribe();
//   }, [recipientId]);

//   return recipientInfo;
// };
