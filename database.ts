'use client';

// Database configuration for persistent storage
interface DatabaseConfig {
  certificates: any[];
  finalProjects: any[];
  miniProjects: any[];
  dailyActivities: any[];
  lastUpdated: string;
}

const DATABASE_URL = 'https://api.jsonbin.io/v3/b/YOUR_BIN_ID';
const API_KEY = '$2a$10$YOUR_API_KEY_HERE';

class Database {
  private data: DatabaseConfig = {
    certificates: [],
    finalProjects: [],
    miniProjects: [],
    dailyActivities: [],
    lastUpdated: new Date().toISOString()
  };

  async initialize() {
    try {
      await this.loadFromCloud();
    } catch (error) {
      console.log('Using local storage as fallback');
      this.loadFromLocal();
    }
  }

  private async loadFromCloud() {
    const response = await fetch(`${DATABASE_URL}/latest`, {
      headers: {
        'X-Master-Key': API_KEY
      }
    });
    
    if (response.ok) {
      const result = await response.json();
      this.data = result.record;
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

  private async saveToCloud() {
    try {
      const response = await fetch(DATABASE_URL, {
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
      
      return response.ok;
    } catch (error) {
      console.error('Failed to save to cloud:', error);
      return false;
    }
  }

  // Certificate methods
  async getCertificates() {
    return this.data.certificates;
  }

  async saveCertificates(certificates: any[]) {
    this.data.certificates = certificates;
    await this.saveToCloud();
    localStorage.setItem('certificates', JSON.stringify(certificates));
  }

  // Final Projects methods
  async getFinalProjects() {
    return this.data.finalProjects;
  }

  async saveFinalProjects(projects: any[]) {
    this.data.finalProjects = projects;
    await this.saveToCloud();
    localStorage.setItem('finalProjects', JSON.stringify(projects));
  }

  // Mini Projects methods
  async getMiniProjects() {
    return this.data.miniProjects;
  }

  async saveMiniProjects(projects: any[]) {
    this.data.miniProjects = projects;
    await this.saveToCloud();
    localStorage.setItem('miniProjects', JSON.stringify(projects));
  }

  // Daily Activities methods
  async getDailyActivities() {
    return this.data.dailyActivities;
  }

  async saveDailyActivities(activities: any[]) {
    this.data.dailyActivities = activities;
    await this.saveToCloud();
    localStorage.setItem('dailyActivities', JSON.stringify(activities));
  }
}

export const database = new Database();