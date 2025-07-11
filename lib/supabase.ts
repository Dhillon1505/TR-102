'use client';

// Supabase configuration for shared database storage
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';

interface DatabaseEntry {
  id: string;
  type: 'certificate' | 'final_project' | 'mini_project' | 'daily_activity';
  data: any;
  created_at: string;
  updated_at: string;
}

class SharedDatabase {
  private baseUrl: string;
  private headers: HeadersInit;

  constructor() {
    this.baseUrl = `${SUPABASE_URL}/rest/v1`;
    this.headers = {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };
  }

  // Generic method to save data
  async saveEntry(type: string, data: any): Promise<boolean> {
    try {
      // For now, use localStorage as fallback until database is set up
      const storageKey = this.getStorageKey(type);
      const existingData = localStorage.getItem(storageKey);
      const entries = existingData ? JSON.parse(existingData) : [];
      
      // Update existing entry or add new one
      const existingIndex = entries.findIndex((entry: any) => entry.id === data.id);
      if (existingIndex >= 0) {
        entries[existingIndex] = data;
      } else {
        entries.unshift(data);
      }
      
      localStorage.setItem(storageKey, JSON.stringify(entries));
      
      // TODO: Replace with actual database call when deployed
      // const response = await fetch(`${this.baseUrl}/entries`, {
      //   method: 'POST',
      //   headers: this.headers,
      //   body: JSON.stringify({
      //     type,
      //     data,
      //     created_at: new Date().toISOString()
      //   })
      // });
      // return response.ok;
      
      return true;
    } catch (error) {
      console.error('Failed to save entry:', error);
      return false;
    }
  }

  // Generic method to load data
  async loadEntries(type: string): Promise<any[]> {
    try {
      // For now, use localStorage as fallback until database is set up
      const storageKey = this.getStorageKey(type);
      const data = localStorage.getItem(storageKey);
      
      // TODO: Replace with actual database call when deployed
      // const response = await fetch(`${this.baseUrl}/entries?type=eq.${type}&order=created_at.desc`, {
      //   headers: this.headers
      // });
      // if (response.ok) {
      //   const entries = await response.json();
      //   return entries.map((entry: DatabaseEntry) => entry.data);
      // }
      
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load entries:', error);
      return [];
    }
  }

  private getStorageKey(type: string): string {
    switch (type) {
      case 'certificate': return 'certificates';
      case 'final_project': return 'finalProjects';
      case 'mini_project': return 'miniProjects';
      case 'daily_activity': return 'dailyActivities';
      default: return type;
    }
  }

  // Specific methods for each data type
  async saveCertificates(certificates: any[]): Promise<void> {
    localStorage.setItem('certificates', JSON.stringify(certificates));
  }

  async loadCertificates(): Promise<any[]> {
    return this.loadEntries('certificate');
  }

  async saveFinalProjects(projects: any[]): Promise<void> {
    localStorage.setItem('finalProjects', JSON.stringify(projects));
  }

  async loadFinalProjects(): Promise<any[]> {
    return this.loadEntries('final_project');
  }

  async saveMiniProjects(projects: any[]): Promise<void> {
    localStorage.setItem('miniProjects', JSON.stringify(projects));
  }

  async loadMiniProjects(): Promise<any[]> {
    return this.loadEntries('mini_project');
  }

  async saveDailyActivities(activities: any[]): Promise<void> {
    localStorage.setItem('dailyActivities', JSON.stringify(activities));
  }

  async loadDailyActivities(): Promise<any[]> {
    return this.loadEntries('daily_activity');
  }
}

export const sharedDB = new SharedDatabase();
