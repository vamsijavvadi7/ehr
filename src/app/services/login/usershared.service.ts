

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {User} from '../interfaces/loginInterface/user.interface';
@Injectable({
  providedIn: 'root'
})
export class UsersharedService {
  private userSubject = new BehaviorSubject<User | null>(this.loadUserFromLocalStorage());
  user$ = this.userSubject.asObservable();

  constructor() {
    // Initialize the service with the user data from localStorage if available
    const savedUser = this.loadUserFromLocalStorage();
    if (savedUser) {
      this.userSubject.next(savedUser);
    }
  }

  /**
   * Set the user data and save it in localStorage
   */
  setUser(user: User): void {
    this.userSubject.next(user);
    this.saveUserToLocalStorage(user);
  }

  /**
   * Clear the user data from both localStorage and the BehaviorSubject
   */
  clearUser(): void {
    localStorage.removeItem('currentUser');
    this.userSubject.next(null);
  }

  /**
   * Get the current user value without subscribing
   */
  getCurrentUser(): User | null {
    return this.userSubject.getValue();
  }

  /**
   * Save user to localStorage
   */
  private saveUserToLocalStorage(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  /**
   * Load user from localStorage
   */
  private loadUserFromLocalStorage(): User | null {
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
      return null; // Return null if no data is found
    }

    try {
      return JSON.parse(storedUser); // Attempt to parse JSON
    } catch (error) {
      localStorage.removeItem('currentUser'); // Clean up invalid data
      return null;
    }
  }
}

