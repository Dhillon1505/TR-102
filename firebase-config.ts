'use client';

// Firebase configuration for shared database
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Simple shared storage implementation
class FirebaseStorage {
  private baseUrl = 'https://cybersecurity-tracker-default-rtdb.firebaseio.com';
  
  async saveData(path: string, data: any): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${path}.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        console.log(`Data saved to ${path} successfully`);
        return true;
      }
      
      // Fallback to localStorage
      localStorage.setItem(path, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Failed to save data:', error);
      // Fallback to localStorage
      localStorage.setItem(path, JSON.stringify(data));
      return true;
    }
  }

  async loadData(path: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/${path}.json`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`Data loaded from ${path} successfully`);
        
        // Also save to localStorage for offline access
        if (data) {
          localStorage.setItem(path, JSON.stringify(data));
        }
        
        return data || [];
      }
      
      // Fallback to localStorage
      const localData = localStorage.getItem(path);
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error('Failed to load data:', error);
      // Fallback to localStorage
      const localData = localStorage.getItem(path);
      return localData ? JSON.parse(localData) : [];
    }
  }

  // Specific methods for each data type
  async saveCertificates(certificates: any[]) {
    return this.saveData('certificates', certificates);
  }

  async loadCertificates() {
    return this.loadData('certificates');
  }

  async saveFinalProjects(projects: any[]) {
    return this.saveData('finalProjects', projects);
  }

  async loadFinalProjects() {
    return this.loadData('finalProjects');
  }

  async saveMiniProjects(projects: any[]) {
    return this.saveData('miniProjects', projects);
  }

  async loadMiniProjects() {
    return this.loadData('miniProjects');
  }

  async saveDailyActivities(activities: any[]) {
    return this.saveData('dailyActivities', activities);
  }

  async loadDailyActivities() {
    return this.loadData('dailyActivities');
  }
}

export const firebaseStorage = new FirebaseStorage();