'use client';

// Shared storage for permanent data across all users
const STORAGE_URL = 'https://api.jsonbin.io/v3/b/675a2b1c1f5677401f26c8d1';
const API_KEY = '$2a$10$8rJ9mK3lN5pQ7xW2vB6eR.4sT1uY8hG9fL6nM2vC3bE5aZ7wX9oK';

interface SharedDataStructure {
  certificates: any[];
  finalProjects: any[];
  miniProjects: any[];
  dailyActivities: any[];
  lastUpdated: string;
}

class GlobalStorage {
  private data: SharedDataStructure = {
    certificates: [],
    finalProjects: [],
    miniProjects: [],
    dailyActivities: [],
    lastUpdated: new Date().toISOString()
  };
  
  private initialized = false;

  async initialize() {
    if (this.initialized) return;
    
    try {
      await this.loadSharedData();
    } catch (error) {
      console.log('Loading from local storage as backup');
      this.loadLocalData();
    }
    
    this.initialized = true;
  }

  private async loadSharedData() {
    const response = await fetch(`${STORAGE_URL}/latest`, {
      headers: {
        'X-Master-Key': API_KEY
      }
    });
    
    if (response.ok) {
      const result = await response.json();
      this.data = result.record || this.getDefaultData();
      console.log('✅ Global data loaded successfully');
      
      // Save to local storage for offline access
      this.syncToLocal();
    } else {
      throw new Error('Failed to load shared data');
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

  private syncToLocal() {
    localStorage.setItem('certificates', JSON.stringify(this.data.certificates));
    localStorage.setItem('finalProjects', JSON.stringify(this.data.finalProjects));
    localStorage.setItem('miniProjects', JSON.stringify(this.data.miniProjects));
    localStorage.setItem('dailyActivities', JSON.stringify(this.data.dailyActivities));
  }

  private getDefaultData(): SharedDataStructure {
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
        console.log('✅ Data saved globally - visible to all users');
        this.syncToLocal();
        return true;
      } else {
        throw new Error('Failed to save globally');
      }
    } catch (error) {
      console.error('❌ Global save failed, data saved locally only:', error);
      this.syncToLocal();
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
  }

  // Refresh data from global storage
  async refresh() {
    try {
      await this.loadSharedData();
      return true;
    } catch (error) {
      console.error('Failed to refresh data:', error);
      return false;
    }
  }
}

export const globalStorage = new GlobalStorage();