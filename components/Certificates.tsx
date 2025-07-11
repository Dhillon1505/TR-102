
'use client';

import { useState, useEffect } from 'react';
import { globalStorage } from '../lib/storage';

interface Certificate {
  id: string;
  name: string;
  provider: string;
  status: 'earned' | 'in-progress' | 'planned';
  progress: number;
  dateEarned?: string;
  expiryDate?: string;
  credentialId?: string;
  studyMaterials: string[];
  notes: string;
  files: string[];
}

export default function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    provider: '',
    status: 'planned' as 'earned' | 'in-progress' | 'planned',
    progress: 0,
    dateEarned: '',
    expiryDate: '',
    credentialId: '',
    studyMaterials: '',
    notes: '',
    files: [] as string[]
  });

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      setLoading(true);
      const data = await globalStorage.getCertificates();
      setCertificates(data);
    } catch (error) {
      console.error('Failed to load certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCertificates = async (newCertificates: Certificate[]) => {
    try {
      await globalStorage.saveCertificates(newCertificates);
      setCertificates(newCertificates);
    } catch (error) {
      console.error('Failed to save certificates:', error);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileNames = Array.from(files).map(file => file.name);
      setFormData({...formData, files: [...formData.files, ...fileNames]});
    }
  };

  const removeFile = (index: number) => {
    const newFiles = formData.files.filter((_, i) => i !== index);
    setFormData({...formData, files: newFiles});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCertificate: Certificate = {
      id: Date.now().toString(),
      name: formData.name,
      provider: formData.provider,
      status: formData.status,
      progress: formData.progress,
      dateEarned: formData.dateEarned || undefined,
      expiryDate: formData.expiryDate || undefined,
      credentialId: formData.credentialId || undefined,
      studyMaterials: formData.studyMaterials.split('\n').filter(m => m.trim()),
      notes: formData.notes,
      files: formData.files
    };
    const updatedCertificates = [newCertificate, ...certificates];
    saveCertificates(updatedCertificates);
    setFormData({ name: '', provider: '', status: 'planned', progress: 0, dateEarned: '', expiryDate: '', credentialId: '', studyMaterials: '', notes: '', files: [] });
    setShowForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'earned': return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'in-progress': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'planned': return 'text-blue-400 bg-blue-400/20 border-blue-400/30';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'earned': return 'ri-check-line';
      case 'in-progress': return 'ri-time-line';
      case 'planned': return 'ri-calendar-line';
      default: return 'ri-file-line';
    }
  };

  return (
    <div className="space-y-10 relative">
      <div className="absolute -top-4 right-0 text-4xl animate-bounce opacity-60">🏆</div>
      <div className="absolute top-20 -left-8 text-3xl animate-pulse opacity-40">⚡</div>
      
      <div className="flex justify-between items-center relative">
        <div className="flex items-center space-x-4">
          <div className="text-6xl animate-bounce">🎖️</div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
              Certifications 🚀
            </h2>
            <p className="text-gray-400 flex items-center space-x-2">
              <span>🎯 Track your cybersecurity certifications and progress</span>
              <span className="animate-pulse">✨</span>
              <span className="bg-green-600/20 text-green-400 px-2 py-1 rounded-full text-xs">🌍 Shared Globally</span>
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => loadCertificates()}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center space-x-2 whitespace-nowrap cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <span className="text-lg animate-spin">🔄</span>
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-8 py-4 rounded-xl transition-all duration-300 flex items-center space-x-3 whitespace-nowrap cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105 relative group"
          >
            <span className="text-xl animate-bounce group-hover:animate-spin">➕</span>
            <i className="ri-add-line text-xl"></i>
            <span className="font-semibold">Add Certificate</span>
            <span className="text-xl animate-pulse">🌟</span>
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-8 relative">
          <div className="absolute inset-0 flex justify-center items-center opacity-10">
            <div 
              className="w-32 h-32 bg-cover bg-center rounded-full"
              style={{
                backgroundImage: `url('https://readdy.ai/api/search-image?query=cute%20anime%20character%20loading%20data%20with%20spinning%20gears%20and%20sparkles%2C%20kawaii%20style%2C%20purple%20and%20blue%20colors%2C%20chibi%20art%20style%2C%20tech%20accessories%2C%20loading%20animation&width=150&height=150&seq=loading-mascot-001&orientation=squarish')`,
              }}
            />
          </div>
          <div className="relative z-10">
            <div className="text-6xl animate-spin mb-4">⚡</div>
            <p className="text-gray-400 flex items-center justify-center space-x-2">
              <span>🌍</span>
              <span>Loading shared data...</span>
              <span>✨</span>
            </p>
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50 shadow-2xl relative overflow-hidden">
          <div className="absolute top-4 right-4 text-2xl animate-bounce">✨</div>
          <div className="absolute bottom-4 left-4 text-2xl animate-pulse opacity-50">🎨</div>
          
          <div className="flex items-center space-x-3 mb-8">
            <span className="text-3xl animate-bounce">📋</span>
            <h3 className="text-2xl font-semibold text-white bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
              Add New Certificate
            </h3>
            <span className="text-2xl animate-pulse">⚡</span>
            <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-sm">🌍 Will be visible to everyone</span>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-gray-300 mb-3 font-medium flex items-center space-x-2">
                  <span>🎖️</span>
                  <span>Certificate Name</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., CompTIA Security+ ⚡"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-sm transition-all duration-200 hover:border-green-400"
                  required
                />
              </div>
              <div className="relative">
                <label className="block text-gray-300 mb-3 font-medium flex items-center space-x-2">
                  <span>🏢</span>
                  <span>Provider</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., CompTIA, Cisco, EC-Council 🚀"
                  value={formData.provider}
                  onChange={(e) => setFormData({...formData, provider: e.target.value})}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-sm transition-all duration-200 hover:border-green-400"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-gray-300 mb-3 font-medium flex items-center space-x-2">
                  <span>📊</span>
                  <span>Status</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as 'earned' | 'in-progress' | 'planned'})}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-sm transition-all duration-200 pr-8 hover:border-green-400"
                >
                  <option value="planned">📅 Planned</option>
                  <option value="in-progress">⏳ In Progress</option>
                  <option value="earned">✅ Earned</option>
                </select>
              </div>
              <div className="relative">
                <label className="block text-gray-300 mb-3 font-medium flex items-center space-x-2">
                  <span>📈</span>
                  <span>Progress ({formData.progress}%) 🔥</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => setFormData({...formData, progress: parseInt(e.target.value)})}
                  className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider hover:bg-gray-600 transition-all duration-200"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-gray-300 mb-3 font-medium flex items-center space-x-2">
                  <span>📅</span>
                  <span>Date Earned (if applicable)</span>
                </label>
                <input
                  type="date"
                  value={formData.dateEarned}
                  onChange={(e) => setFormData({...formData, dateEarned: e.target.value})}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-sm transition-all duration-200 hover:border-green-400"
                />
              </div>
              <div className="relative">
                <label className="block text-gray-300 mb-3 font-medium flex items-center space-x-2">
                  <span>⏰</span>
                  <span>Expiry Date (if applicable)</span>
                </label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-sm transition-all duration-200 hover:border-green-400"
                />
              </div>
            </div>
            
            <div className="relative">
              <label className="block text-gray-300 mb-3 font-medium flex items-center space-x-2">
                <span>🔑</span>
                <span>Credential ID (if earned)</span>
              </label>
              <input
                type="text"
                placeholder="Certificate credential ID ✨"
                value={formData.credentialId}
                onChange={(e) => setFormData({...formData, credentialId: e.target.value})}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-sm transition-all duration-200 hover:border-green-400"
              />
            </div>
            
            <div className="relative">
              <label className="block text-gray-300 mb-3 font-medium flex items-center space-x-2">
                <span>📚</span>
                <span>Study Materials (one per line)</span>
              </label>
              <textarea
                placeholder="Enter each study material on a new line 📋"
                value={formData.studyMaterials}
                onChange={(e) => setFormData({...formData, studyMaterials: e.target.value})}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-sm h-24 resize-none transition-all duration-200 hover:border-green-400"
              />
            </div>
            
            <div className="relative">
              <label className="block text-gray-300 mb-3 font-medium flex items-center space-x-2">
                <span>📝</span>
                <span>Notes</span>
              </label>
              <textarea
                placeholder="Additional notes about this certification... ✨"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-sm h-24 resize-none transition-all duration-200 hover:border-green-400"
                maxLength={500}
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-3 font-medium flex items-center space-x-2">
                <span>📁</span>
                <i className="ri-upload-cloud-line text-green-400"></i>
                <span>Upload Certificate Files & Study Materials</span>
              </label>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-sm transition-all duration-200 file:bg-green-600 file:border-0 file:rounded-lg file:px-4 file:py-2 file:text-white file:cursor-pointer file:mr-4 hover:border-green-400"
              />
              {formData.files.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-gray-300 font-medium flex items-center space-x-2">
                    <span>📂</span>
                    <span>Uploaded Files:</span>
                  </p>
                  {formData.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-800/30 px-3 py-2 rounded-lg hover:bg-gray-700/30 transition-colors">
                      <span className="text-gray-300 text-sm flex items-center space-x-2">
                        <i className="ri-file-line text-green-400"></i>
                        <span>{file}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-400 hover:text-red-300 cursor-pointer hover:scale-110 transition-transform"
                      >
                        <i className="ri-close-line"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-8 py-4 rounded-xl transition-all duration-300 whitespace-nowrap cursor-pointer font-semibold shadow-lg hover:scale-105 flex items-center space-x-2"
              >
                <span>💾</span>
                <span>Save Certificate</span>
                <span className="animate-bounce">🌍</span>
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 rounded-xl transition-all duration-300 whitespace-nowrap cursor-pointer font-semibold hover:scale-105 flex items-center space-x-2"
              >
                <span>❌</span>
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {certificates.length === 0 && !loading ? (
        <div className="text-center py-16 relative">
          <div className="absolute inset-0 flex justify-center items-center opacity-10">
            <div 
              className="w-64 h-64 bg-cover bg-center rounded-full"
              style={{
                backgroundImage: `url('https://readdy.ai/api/search-image?query=cute%20anime%20character%20studying%20cybersecurity%20certificates%20with%20books%20and%20diploma%2C%20kawaii%20style%2C%20green%20and%20teal%20colors%2C%20chibi%20art%20style%2C%20friendly%20expression%2C%20academic%20accessories%2C%20study%20motivation&width=300&height=300&seq=cert-mascot-001&orientation=squarish')`,
              }}
            />
          </div>
          <div className="relative z-10">
            <div className="text-8xl mb-4 animate-bounce">🎖️</div>
            <h3 className="text-xl text-gray-400 mb-2 flex items-center justify-center space-x-2">
              <span>✨</span>
              <span>No certificates added yet</span>
              <span>✨</span>
            </h3>
            <p className="text-gray-500 flex items-center justify-center space-x-2">
              <span>🚀</span>
              <span>Start by adding your first certification goal</span>
              <span>💫</span>
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-8">
          {certificates.map((cert) => (
            <div key={cert.id} className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] relative overflow-hidden group">
              <div className="absolute top-4 right-4 text-2xl animate-bounce opacity-60 group-hover:animate-spin">⚡</div>
              <div className="absolute bottom-4 left-4 text-xl animate-pulse opacity-40">✨</div>
              
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <span className="text-2xl animate-bounce">🎖️</span>
                    <h3 className="text-2xl font-bold text-white bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
                      {cert.name}
                    </h3>
                    <span 
                      className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center space-x-2 ${getStatusColor(cert.status)}`}
                    >
                      <i className={getStatusIcon(cert.status)}></i>
                      <span className="capitalize">{cert.status}</span>
                    </span>
                    <span className="text-xl animate-pulse">🚀</span>
                  </div>
                  <p className="text-gray-400 text-lg flex items-center space-x-2">
                    <span>🏢</span>
                    <span>{cert.provider}</span>
                  </p>
                  {cert.dateEarned && (
                    <p className="text-green-400 text-sm mt-2 flex items-center space-x-2">
                      <i className="ri-calendar-check-line"></i>
                      <span>Earned: {cert.dateEarned}</span>
                      <span>🎉</span>
                    </p>
                  )}
                  {cert.credentialId && (
                    <p className="text-blue-400 text-sm mt-1 flex items-center space-x-2">
                      <i className="ri-key-line"></i>
                      <span>ID: {cert.credentialId}</span>
                      <span>🔑</span>
                    </p>
                  )}
                </div>
                <div className="text-right ml-6 relative">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xl animate-bounce">🔥</span>
                    <div className="text-2xl font-bold text-green-400">{cert.progress}%</div>
                    <span className="text-xl animate-pulse">⚡</span>
                  </div>
                  <div className="w-24 bg-gray-700 rounded-full h-3 relative overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-teal-500 h-3 rounded-full transition-all duration-500 relative"
                      style={{ width: `${cert.progress}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {cert.notes && (
                <p className="text-gray-300 mb-6 leading-relaxed text-lg">{cert.notes}</p>
              )}
              
              {cert.studyMaterials.length > 0 && (
                <div className="mb-6 relative">
                  <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
                    <span className="text-xl animate-bounce">📚</span>
                    <i className="ri-book-line text-blue-400"></i>
                    <span>Study Materials</span>
                  </h4>
                  <ul className="space-y-2">
                    {cert.studyMaterials.map((material, index) => (
                      <li key={index} className="text-gray-300 text-sm flex items-start space-x-2 group">
                        <i className="ri-arrow-right-s-line text-blue-400 mt-0.5 group-hover:animate-bounce"></i>
                        <span>{material}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {cert.files.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
                    <span className="text-xl animate-bounce">📁</span>
                    <i className="ri-folder-line text-green-400"></i>
                    <span>Certificate Files</span>
                    <span className="text-lg animate-pulse">✨</span>
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {cert.files.map((file, index) => (
                      <div key={index} className="bg-gray-800/30 px-3 py-2 rounded-lg text-sm hover:bg-gray-700/30 transition-colors">
                        <span className="text-gray-300 flex items-center space-x-2">
                          <i className="ri-file-line text-green-400"></i>
                          <span className="truncate">{file}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {cert.expiryDate && (
                <div className="mt-4 p-3 bg-yellow-400/10 border border-yellow-400/30 rounded-lg">
                  <p className="text-yellow-400 text-sm flex items-center space-x-2">
                    <i className="ri-alarm-warning-line"></i>
                    <span>Expires: {cert.expiryDate}</span>
                    <span>⚠️</span>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
