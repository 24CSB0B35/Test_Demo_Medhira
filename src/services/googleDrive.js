class GoogleDriveService {
  constructor() {
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    return new Promise((resolve, reject) => {
      if (window.gapi && window.gapi.client) {
        this.initialized = true;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        window.gapi.load('client:auth2', {
          callback: () => {
            window.gapi.client.init({
              apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
              clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
              discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
              scope: 'https://www.googleapis.com/auth/drive.file'
            }).then(() => {
              this.initialized = true;
              resolve();
            }).catch(reject);
          },
          onerror: reject
        });
      };
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  async authenticate() {
    await this.initialize();
    const auth = window.gapi.auth2.getAuthInstance();
    
    if (auth.isSignedIn.get()) {
      return auth.currentUser.get().getAuthResponse().access_token;
    }
    
    await auth.signIn();
    return auth.currentUser.get().getAuthResponse().access_token;
  }

  async ensureFolder() {
    const folderName = 'Patient Summaries';
    
    const response = await window.gapi.client.drive.files.list({
      q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name)'
    });

    if (response.result.files.length > 0) {
      return response.result.files[0].id;
    }

    const folder = await window.gapi.client.drive.files.create({
      resource: {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder'
      },
      fields: 'id'
    });

    return folder.result.id;
  }

  async uploadPDF(pdfBlob, fileName, summaryData) {
    await this.initialize();
    
    const token = await this.authenticate();
    const folderId = await this.ensureFolder();

    const metadata = {
      name: fileName,
      mimeType: 'application/pdf',
      parents: [folderId],
      properties: {
        patientName: summaryData.patientName,
        patientAge: summaryData.age,
        diagnosis: summaryData.diagnosis,
        consultationDate: new Date().toISOString()
      }
    };

    const formData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    formData.append('file', pdfBlob);

    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload file to Google Drive');
    }

    const result = await response.json();
    return result;
  }

  async generatePDF(summaryData) {
    const pdfContent = `
PATIENT MEDICAL SUMMARY
Generated: ${new Date().toLocaleDateString()}

PATIENT INFORMATION:
Name: ${summaryData.patientName}
Age: ${summaryData.age}
Gender: ${summaryData.gender}

SYMPTOMS & CHIEF COMPLAINT:
${summaryData.symptoms}

MEDICAL HISTORY:
${summaryData.history}

EXAMINATION FINDINGS:
${summaryData.examination}

DIAGNOSIS:
${summaryData.diagnosis}

PRESCRIPTION & TREATMENT:
${summaryData.prescription}

FOLLOW-UP INSTRUCTIONS:
${summaryData.followUp}

---
This summary was generated automatically using Patient-Doctor Summarizer.
    `.trim();

    return new Blob([pdfContent], { type: 'application/pdf' });
  }

  async uploadSummary(summaryData) {
    try {
      const pdfBlob = await this.generatePDF(summaryData);
      const fileName = `Medical_Summary_${summaryData.patientName.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
      const result = await this.uploadPDF(pdfBlob, fileName, summaryData);
      
      return {
        success: true,
        driveLink: result.webViewLink,
        fileId: result.id,
        fileName: fileName
      };
    } catch (error) {
      console.error('Error uploading to Google Drive:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  isConnected() {
    const token = localStorage.getItem('google_drive_token');
    return !!token;
  }

  disconnect() {
    localStorage.removeItem('google_drive_token');
    if (window.gapi && window.gapi.auth2) {
      const auth = window.gapi.auth2.getAuthInstance();
      if (auth) {
        auth.signOut();
      }
    }
  }
}

export default new GoogleDriveService();