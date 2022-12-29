import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {NotificationService} from "./notification.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private notificationService: NotificationService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let message = '';
        let header = 'Napaka';
        console.log(error)
        if (error.error instanceof ErrorEvent) {
          // Client side error
          message = error.error.message;
        } else {
          // Server side error
          message = error.error.message;
          header += ' ' + error.status;
        }
        if (!error.url?.includes('login') && !error.url?.includes('register')) {
          this.notificationService.show(message, header, { classname: 'bg-danger text-light' });
        }

        return throwError(() => message);
      })
    );
  }
}
