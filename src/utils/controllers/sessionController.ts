import { collection, addDoc, doc, updateDoc, arrayUnion, getDocs, deleteDoc, getDoc } from "firebase/firestore";
import { Session } from "../../constants/dataModels/session.model";
import { db } from "../../config/firebase";
import { SESSIONS } from "../../constants/firebaseCollections";


export const createSession = async (session: Session) => {
    try {
        const docRef = await addDoc(collection(db, SESSIONS), session);
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};

export const getSession = async (sessionId: string) => {
    try {
        const docRef = doc(db, SESSIONS, sessionId);
        const docSnap = await getDoc(docRef);
    
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            throw new Error("No such document");
        }
    } catch (error) {
        console.error("Error getting session: ", error);
        throw new Error("Failed to get session");
    }
};

export const getAllSessions = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, SESSIONS));
        const sessions: any[] = [];
        querySnapshot.forEach((doc) => {
            sessions.push({ id: doc.id, ...doc.data() });
        });
        return sessions;
    } catch (error) {
        console.error("Error getting sessions: ", error);
        throw new Error("Failed to get sessions");
    }
};

export const addRoutineToSession = (sessionId: string, routineId: string) => {
    const sessionRef = doc(db, SESSIONS, sessionId);
  
    // Atomically add a new routine to the "routines" array field.
    updateDoc(sessionRef, {
        routines: arrayUnion(routineId)
    });
};

export const deleteSession = async (sessionId: string) => {
    try {
        await deleteDoc(doc(db, SESSIONS, sessionId));
        console.log("Document deleted successfully");
    } catch (error) {
        console.error("Error deleting document: ", error);
    }
};
