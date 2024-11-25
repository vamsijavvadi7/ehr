
import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import {User} from '../interfaces/loginInterface/user.interface';

// movie.service.ts

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:8764/users/users';  // Base API URL

  constructor(private http: HttpClient) {}

  // Fetch user profile details
  loginUser(login: { email: any; password: any; }): Observable<User> {
    // Construct the JSON object to send as the body
    const body = {
      password: login.password // Only the password in the body
    };

    // Send the email as a query parameter and the password as part of the JSON body
    return this.http.post<User>(`${this.apiUrl}/login`, body, {
      params: { email: login.email }
    });
  }



}
