import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
    // Hard-coded users
    private readonly USERS = [
        { username: 'admin', password: 'james' },
        { username: 'anis', password: 'anisspassword' },
        { username: 'mahesh', password: 'mspassword' },
        { username: 'raju', password: 'rnayakpassword' },
        { username: 'abhik', password: 'kinipassword' },
        { username: 'tarunzha', password: 'zhapassword' }
    ];

    private currentUserSubject = new BehaviorSubject<string | null>(localStorage.getItem('user'));
    currentUser$ = this.currentUserSubject.asObservable();

    constructor(private router: Router) { }

    login(username: string, password: string): boolean {
        const user = this.USERS.find(u => u.username === username && u.password === password);
        if (user) {
            localStorage.setItem('user', username);
            this.currentUserSubject.next(username);
            return true;
        }
        return false;
    }

    logout() {
        localStorage.removeItem('user');
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    isLoggedIn(): boolean {
        return !!this.currentUserSubject.value;
    }
}