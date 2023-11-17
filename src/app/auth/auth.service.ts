import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  registerUser(email: string, password: string) {
    return this.http.post('http://localhost:3001/api/register', {
      email,
      password,
    });
  }

  loginUser(email: string, password: string) {
    return this.http.post('http://localhost:3001/api/login', {
      email,
      password,
    });
  }
}
