class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
    
    const token = localStorage.getItem('token');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.text();
        let errorMessage = `HTTP ${response.status}`;
        
        try {
          const parsedError = JSON.parse(errorData);
          errorMessage = parsedError.error || parsedError.message || errorMessage;
        } catch {
          errorMessage = errorData || errorMessage;
        }
        
        console.error(`❌ API Error: ${options.method || 'GET'} ${url}`, errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log(`✅ API Success: ${options.method || 'GET'} ${url}`);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`❌ API Error: ${options.method || 'GET'} ${url}`, error);
        
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Network error. Please check your connection and try again.');
        }
        
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  // Generic methods
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Auth endpoints
  async login(credentials: { email: string; password: string }) {
    return this.post('/auth/login', credentials);
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
    role: string;
  }) {
    return this.post('/auth/register', userData);
  }

  // Stats endpoints
  async getStats() {
    return this.get('/stats');
  }

  async updateStats(data: any) {
    return this.put('/stats', data);
  }

  // Specialties endpoints
  async getSpecialties() {
    return this.get('/specialties');
  }

  async getAllSpecialties() {
    return this.get('/specialties/all');
  }

  async createSpecialty(data: any) {
    return this.post('/specialties', data);
  }

  async updateSpecialty(id: string, data: any) {
    return this.put(`/specialties/${id}`, data);
  }

  async deleteSpecialty(id: string) {
    return this.delete(`/specialties/${id}`);
  }

  // Doctors endpoints
  async getDoctors(specialty?: string) {
    const query = specialty ? `?specialty=${encodeURIComponent(specialty)}` : '';
    return this.get(`/doctors${query}`);
  }

  async getAllDoctors() {
    return this.get('/doctors/all');
  }

  async getDoctor(id: string) {
    return this.get(`/doctors/${id}`);
  }

  async createDoctor(data: any) {
    return this.post('/doctors', data);
  }

  async updateDoctor(id: string, data: any) {
    return this.put(`/doctors/${id}`, data);
  }

  async deleteDoctor(id: string) {
    return this.delete(`/doctors/${id}`);
  }

  // Appointments endpoints
  async getAppointments() {
    return this.get('/appointments');
  }

  async createAppointment(data: any) {
    return this.post('/appointments', data);
  }

  async updateAppointment(id: string, data: any) {
    return this.put(`/appointments/${id}`, data);
  }

  async cancelAppointment(id: string) {
    return this.delete(`/appointments/${id}`);
  }
}

export const apiService = new ApiService();