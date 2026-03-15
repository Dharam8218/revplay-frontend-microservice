import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/revplay/auth';

  constructor(private http: HttpClient) {}

  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data);
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  saveAuthData(response: any) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('username', response.username);
    localStorage.setItem('email', response.email);
    localStorage.setItem('roles', JSON.stringify(response.roles));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRoles(): string[] {
    const roles = localStorage.getItem('roles');
    return roles ? JSON.parse(roles) : [];
  }

  logout() {
    localStorage.clear();
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  registerUser(formData: FormData, role: string) {
    const endpoint =
      role === 'ARTIST' ? `${this.baseUrl}/register/artist` : `${this.baseUrl}/register/user`;

    return this.http.post(endpoint, formData);
  }

  getProfile() {
    return this.http.get<any>(`${this.baseUrl}/user/get-profile`);
  }
  updateProfile(formData: FormData) {
    return this.http.put(`${this.baseUrl}/user/update-profile`, formData);
  }

  getArtistProfile(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/artist/get-profile`);
  }

  updateArtistProfile(formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/artist/update-profile`, formData);
  }

  getUserId(): number | null {
    const token = localStorage.getItem('token');

    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));

    return payload.userId;
  }
}
