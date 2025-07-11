'use client';

// Shared storage solution for permanent data storage
const STORAGE_URL = 'https://api.jsonbin.io/v3/b/65f8a2b51f5677401f26c8d1';
const API_KEY = '$2a$10$8rJ9mK3lN5pQ7xW2vB6eR.4sT1uY8hG9fL6nM2vC3bE5aZ7wX9oK';

interface SharedData {
  certificates: any[];
  finalProjects: any[];
  miniProjects: any[];
  dailyActivities: any[];
  lastUpdated: string;
}

class SharedStorage {
  private initialized = false;
  private data: SharedData = {
    certificates: [],
    finalProjects: [],
    miniProjects: [],
    dailyActivities: [],
    lastUpdated: new Date().toISOString()
  };

  async initialize() {
    if (this.initialized) return;
    
    try {
      await this.loadSharedData();
      this.initialized = true;
    } catch (error) {
      console.log('Loading from local storage as fallback');
      this.loadLocalData();
      this.initialized = true;
    }
  }

  private async loadSharedData() {
    try {
      const response = await fetch(`${STORAGE_URL}/latest`, {
        headers: {
          'X-Master-Key': API_KEY
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        this.data = result.record || this.getDefaultData();
        console.log('Shared data loaded successfully');
      } else {
        throw new Error('Failed to load shared data');
      }
    } catch (error) {
      throw error;
    }
  }

  private loadLocalData() {
    const certificates = localStorage.getItem('certificates');
    const finalProjects = localStorage.getItem('finalProjects');
    const miniProjects = localStorage.getItem('miniProjects');
    const dailyActivities = localStorage.getItem('dailyActivities');

    this.data = {
      certificates: certificates ? JSON.parse(certificates) : [],
      finalProjects: finalProjects ? JSON.parse(finalProjects) : [],
      miniProjects: miniProjects ? JSON.parse(miniProjects) : [],
      dailyActivities: dailyActivities ? JSON.parse(dailyActivities) : [],
      lastUpdated: new Date().toISOString()
    };
  }

  private getDefaultData(): SharedData {
    return {
      certificates: [],
      finalProjects: [],
      miniProjects: [],
      dailyActivities: [],
      lastUpdated: new Date().toISOString()
    };
  }

  private async saveSharedData() {
    try {
      const response = await fetch(STORAGE_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': API_KEY
        },
        body: JSON.stringify({
          ...this.data,
          lastUpdated: new Date().toISOString()
        })
      });
      
      if (response.ok) {
        console.log('Data saved to shared storage successfully');
        return true;
      } else {
        throw new Error('Failed to save to shared storage');
      }
    } catch (error) {
      console.error('Error saving to shared storage:', error);
      return false;
    }
  }

  // Certificate methods
  async getCertificates() {
    await this.initialize();
    return this.data.certificates;
  }

  async saveCertificates(certificates: any[]) {
    await this.initialize();
    this.data.certificates = certificates;
    await this.saveSharedData();
    localStorage.setItem('certificates', JSON.stringify(certificates));
  }

  // Final Projects methods
  async getFinalProjects() {
    await this.initialize();
    return this.data.finalProjects;
  }

  async saveFinalProjects(projects: any[]) {
    await this.initialize();
    this.data.finalProjects = projects;
    await this.saveSharedData();
    localStorage.setItem('finalProjects', JSON.stringify(projects));
  }

  // Mini Projects methods
  async getMiniProjects() {
    await this.initialize();
    return this.data.miniProjects;
  }

  async saveMiniProjects(projects: any[]) {
    await this.initialize();
    this.data.miniProjects = projects;
    await this.saveSharedData();
    localStorage.setItem('miniProjects', JSON.stringify(projects));
  }

  // Daily Activities methods
  async getDailyActivities() {
    await this.initialize();
    return this.data.dailyActivities;
  }

  async saveDailyActivities(activities: any[]) {
    await this.initialize();
    this.data.dailyActivities = activities;
    await this.saveSharedData();
    localStorage.setItem('dailyActivities', JSON.stringify(activities));
  }

  async syncData() {
    await this.loadSharedData();
  }
}

export const sharedStorage = new SharedStorage();
