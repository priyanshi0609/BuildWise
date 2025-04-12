// src/services/api.js
import { 
    collection, 
    addDoc, 
    doc, 
    getDoc, 
    getDocs, 
    updateDoc, 
    deleteDoc, 
    query, 
    where,
    orderBy,
    limit
  } from "firebase/firestore";
  import { db } from "../firebase";
  
  // Create a new project
  export const createProject = async (projectData) => {
    try {
      const docRef = await addDoc(collection(db, "projects"), projectData);
      return { id: docRef.id, ...projectData };
    } catch (error) {
      console.error("Error adding project: ", error);
      throw error;
    }
  };
  
  // Get all projects for a user (alias for getUserProjects)
  export const getProjects = async (userId) => {
    return getUserProjects(userId);
  };
  
  // Get all projects for a user
  export const getUserProjects = async (userId) => {
    try {
      const q = query(collection(db, "projects"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting projects: ", error);
      throw error;
    }
  };
  
  // Get recent activity for a user
  export const getRecentActivity = async (userId, limitCount = 5) => {
    try {
      const q = query(
        collection(db, "activities"),
        where("userId", "==", userId),
        orderBy("timestamp", "desc"),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting recent activity: ", error);
      throw error;
    }
  };
  
  // Get a single project by ID
  export const getProjectById = async (projectId) => {
    try {
      const docRef = doc(db, "projects", projectId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error("Project not found");
      }
    } catch (error) {
      console.error("Error getting project: ", error);
      throw error;
    }
  };
  
  // Update a project
  export const updateProject = async (projectId, updatedData) => {
    try {
      const docRef = doc(db, "projects", projectId);
      await updateDoc(docRef, {
        ...updatedData,
        updatedAt: new Date().toISOString()
      });
      return { id: projectId, ...updatedData };
    } catch (error) {
      console.error("Error updating project: ", error);
      throw error;
    }
  };
  
  // Delete a project
  export const deleteProject = async (projectId) => {
    try {
      const docRef = doc(db, "projects", projectId);
      await deleteDoc(docRef);
      return { success: true };
    } catch (error) {
      console.error("Error deleting project: ", error);
      throw error;
    }
  };