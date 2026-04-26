import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  updateDoc, 
  serverTimestamp,
  getDoc
} from "firebase/firestore";
import { db } from "./config";

export const chatService = {
  /**
   * Initializes or gets a chat room for a specific report
   */
  async getOrCreateChatRoom(report) {
    const id = report?.id || "global";
    const roomRef = doc(db, "chatRooms", id);
    const roomSnap = await getDoc(roomRef);

    if (!roomSnap.exists()) {
      await setDoc(roomRef, {
        reportId: id,
        reportTitle: report?.type || "Global Intelligence",
        userId: report?.creatorEmail || "system",
        volunteerId: report?.assignedToEmail || null,
        createdAt: serverTimestamp(),
        lastMessage: "",
        lastMessageAt: serverTimestamp(),
        status: "Active"
      });
    } else if (report?.id) {
      // Update volunteer if it was unassigned before but is now assigned
      if (!roomSnap.data().volunteerId && report.assignedToEmail) {
        await updateDoc(roomRef, {
          volunteerId: report.assignedToEmail
        });
      }
    }

    return id;
  },

  /**
   * Sends a message to a specific room
   */
  async sendMessage(reportId, sender, text, isAI = false) {
    const id = reportId || "global";
    if (!text.trim()) return;

    const messagesRef = collection(db, "chatRooms", id, "messages");
    
    await addDoc(messagesRef, {
      senderId: sender.uid || sender.email,
      senderName: sender.displayName || sender.name || sender.email.split('@')[0],
      senderRole: sender.role || "user",
      text: text.trim(),
      isAI: isAI,
      createdAt: serverTimestamp(),
      read: false
    });

    // Update room with last message info
    const roomRef = doc(db, "chatRooms", id);
    await updateDoc(roomRef, {
      lastMessage: text.substring(0, 50),
      lastMessageAt: serverTimestamp()
    });
  },

  /**
   * Listens for messages in real-time
   */
  subscribeToMessages(reportId, callback) {
    const id = reportId || "global";

    const q = query(
      collection(db, "chatRooms", id, "messages"),
      orderBy("createdAt", "asc")
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().toISOString() : new Date().toISOString()
      }));
      callback(messages);
    });
  }
};
