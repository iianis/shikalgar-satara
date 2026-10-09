import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, switchMap, of, catchError } from 'rxjs';
import { AuthService } from './services/auth.service';
import { FirebaseService } from './services/firebase.service';

export const adminGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const firebaseService = inject(FirebaseService);
    const router = inject(Router);

    return authService.getLoggedInPhone().pipe(
        switchMap(phone => {
            // 1. Unauthenticated check -> Stop stream early and pass null
            if (!phone) {
                return of(null);
            }
            // 2. Query member data from Firebase
            return firebaseService.getMemberByPhone(phone);
        }),
        map(result => {
            // Safely parse array or single object response from getMemberByPhone
            const member = Array.isArray(result) ? result[0] : result;

            // 3. Admin Authorization Check
            if (member && member.designation && authService.isAdminDesignation(member.designation)) {
                return true;
            }

            // 4. Handle Non-Admin or Unauthenticated User Navigation
            if (!result) {
                // Not logged in -> Redirect to login page and store return URL
                router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            } else {
                // Logged in, but lacks admin designation -> Alert & redirect to home
                alert('तुम्हाला या पृष्ठाचा वापर करण्याची परवानगी नाही. (Access Denied: Admins Only)');
                router.navigate(['/home']);
            }

            return false;
        }),
        catchError(error => {
            console.error('Error in Admin Guard:', error);
            router.navigate(['/home']);
            return of(false);
        })
    );
};