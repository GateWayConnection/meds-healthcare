class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  }

  // Auth endpoints
  async login(credentials: { email: string; password: string }) {
    return this.post('/auth/login', credentials);
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: string;
    dateOfBirth?: string;
    specialty?: string;
    licenseNumber?: string;
    experience?: number;
    bio?: string;
  }) {
    return this.post('/auth/register', userData);
  }

  // User management endpoints
  async getUsers() {
    return this.get('/auth/users');
  }

  async createUser(userData: any) {
    return this.post('/auth/register', userData);
  }

  async updateUser(id: string, userData: any) {
    return this.put(`/auth/users/${id}`, userData);
  }

  async deleteUser(id: string) {
    return this.delete(`/auth/users/${id}`);
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

  // Admin doctor verification endpoints
  async verifyDoctor(id: string) {
    return this.put(`/admin/verify-doctor/${id}`);
  }

  async unverifyDoctor(id: string) {
    return this.put(`/admin/unverify-doctor/${id}`);
  }

  // Appointments endpoints
  async getAppointments() {
    return this.get('/appointments');
  }

  async getUserAppointments() {
    return this.get('/appointments/user');
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

  // Courses endpoints
  async getCourses() {
    return this.get('/courses');
  }

  async getAllCourses() {
    return this.get('/courses/all');
  }

  async getCourse(id: string) {
    return this.get(`/courses/${id}`);
  }

  async createCourse(data: any) {
    return this.post('/courses', data);
  }

  async updateCourse(id: string, data: any) {
    return this.put(`/courses/${id}`, data);
  }

  async deleteCourse(id: string) {
    return this.delete(`/courses/${id}`);
  }

  // Blogs endpoints
  async getBlogs() {
    return this.get('/blogs');
  }

  async getAllBlogs() {
    return this.get('/blogs/all');
  }

  async getMyBlogs() {
    return this.get('/blogs/my');
  }

  async getBlog(id: string) {
    return this.get(`/blogs/${id}`);
  }

  async createBlog(data: any) {
    return this.post('/blogs', data);
  }

  async updateBlog(id: string, data: any) {
    return this.put(`/blogs/${id}`, data);
  }

  async deleteBlog(id: string) {
    return this.delete(`/blogs/${id}`);
  }

  // Activities endpoints
  async getActivities() {
    return this.get('/activities');
  }

  async createActivity(data: any) {
    return this.post('/activities', data);
  }

  async updateActivity(id: string, data: any) {
    return this.put(`/activities/${id}`, data);
  }

  async deleteActivity(id: string) {
    return this.delete(`/activities/${id}`);
  }

  // Categories endpoints
  async getCategories() {
    return this.get('/categories');
  }

  async getAllCategories() {
    return this.get('/categories/all');
  }

  async createCategory(data: any) {
    return this.post('/categories', data);
  }

  async updateCategory(id: string, data: any) {
    return this.put(`/categories/${id}`, data);
  }

  async deleteCategory(id: string) {
    return this.delete(`/categories/${id}`);
  }

  // Testimonials endpoints
  async getTestimonials() {
    return this.get('/testimonials');
  }

  async createTestimonial(data: any) {
    return this.post('/testimonials', data);
  }

  async approveTestimonial(id: string) {
    return this.put(`/testimonials/${id}/approve`);
  }

  async deleteTestimonial(id: string) {
    return this.delete(`/testimonials/${id}`);
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
}

export const apiService = new ApiService();
