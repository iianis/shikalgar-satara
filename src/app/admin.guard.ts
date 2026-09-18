import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, switchMap, of } from 'rxjs';
import { AuthService } from './services/auth.service';
import { FirebaseService } from './services/firebase.service';

export const adminGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const firebaseService = inject(FirebaseService);
    const router = inject(Router);

    return authService.getLoggedInPhone().pipe(
        switchMap(phone => {
            if (!phone) return of(null);
            return firebaseService.getMemberByPhone(phone);
        }),
        map(result => {
            // Handle both array and single object returns safely
            const member = Array.isArray(result) ? result[0] : result;

            // Verify designation against ADMIN_DESIGNATIONS defined in AuthService
            if (member && member.designation && authService.isAdminDesignation(member.designation)) {
                return true;
            }

            // Redirect non-admins to home
            router.navigate(['/home']);
            return false;
        })
    );
};