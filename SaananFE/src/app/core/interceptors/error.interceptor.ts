import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/login') && !req.url.includes('/auth/refresh-token')) {
        return authService.refreshToken().pipe(
          switchMap((response) => {
            if (response.success && response.data) {
              const cloned = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${response.data.accessToken}`
                }
              });
              return next(cloned);
            }
            authService.logout();
            return throwError(() => error);
          }),
          catchError(() => {
            authService.logout();
            return throwError(() => error);
          })
        );
      }

      if (error.status === 0) {
        notificationService.error('Network error. Please check your connection.');
      } else if (error.status === 403) {
        notificationService.error('You do not have permission to perform this action.');
      } else if (error.status >= 500) {
        notificationService.error('A server error occurred. Please try again later.');
      }

      return throwError(() => error);
    })
  );
};
