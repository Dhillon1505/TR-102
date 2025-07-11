'use client';

// Simple shared data storage using JSONBin.io for permanent storage
const JSONBIN_URL = 'https://api.jsonbin.io/v3/b/65f9b3c41f5677401f27d5e8';
const API_KEY = '$2a$10$8rJ9mK3lN5pQ7xW2vB6eR.4sT1uY8hG9fL6nM2vC3bE5aZ7wX9oK';

interface SharedDataStructure {
  certificates: any[];
  finalProjects: any[];
  miniProjects: any[];
  dailyActivities: any[];
  lastUpdated: string;
}

class SharedDataManager {
  private data: SharedDataStructure = {
    certificates: [],
    finalProjects: [],
    miniProjects: [],
    dailyActivities: [],
    lastUpdated: new Date().toISOString()
  };
  
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      await this.loadFromCloud();
    } catch (error) {
      console.log('Using local storage as fallback');
      this.loadFromLocal();
    }
    
    this.isInitialized = true;
  }

  private async loadFromCloud() {
    const response = await fetch(`${JSONBIN_URL}/latest`, {
      headers: {
        'X-Master-Key': API_KEY
      }
    });
    
    if (response.ok) {
      const result = await response.json();
      this.data = result.record || this.getEmptyData();
      
      // Sync to local storage for offline access
      this.syncToLocal();
      
      console.log('✅ Shared data loaded from cloud');
    } else {
      throw new Error('Cloud storage unavailable');
    }
  }

  private loadFromLocal() {
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

  private getEmptyData(): SharedDataStructure {
    return {
      certificates: [],
      finalProjects: [],
      miniProjects: [],
      dailyActivities: [],
      lastUpdated: new Date().toISOString()
    };
  }

  private async saveToCloud() {
    try {
      const response = await fetch(JSONBIN_URL, {
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
        console.log('✅ Data saved to shared cloud storage');
        this.syncToLocal();
        return true;
      } else {
        throw new Error('Failed to save to cloud');
      }
    } catch (error) {
      console.error('❌ Cloud save failed, using local storage only:', error);
      this.syncToLocal();
      return false;
    }
  }

  // Certificate operations
  async getCertificates() {
    await this.initialize();
    return this.data.certificates;
  }

  async updateCertificates(certificates: any[]) {
    await this.initialize();
    this.data.certificates = certificates;
    await this.saveToCloud();
  }

  // Final Projects operations
  async getFinalProjects() {
    await this.initialize();
    return this.data.finalProjects;
  }

  async updateFinalProjects(projects: any[]) {
    await this.initialize();
    this.data.finalProjects = projects;
    await this.saveToCloud();
  }

  // Mini Projects operations
  async getMiniProjects() {
    await this.initialize();
    return this.data.miniProjects;
  }

  async updateMiniProjects(projects: any[]) {
    await this.initialize();
    this.data.miniProjects = projects;
    await this.saveToCloud();
  }

  // Daily Activities operations
  async getDailyActivities() {
    await this.initialize();
    return this.data.dailyActivities;
  }

  async updateDailyActivities(activities: any[]) {
    await this.initialize();
    this.data.dailyActivities = activities;
    await this.saveToCloud();
  }

  // Force refresh from cloud
  async refreshFromCloud() {
    try {
      await this.loadFromCloud();
      return true;
    } catch (error) {
      console.error('Failed to refresh from cloud:', error);
      return false;
    }
  }
}

export const sharedData = new SharedDataManager();