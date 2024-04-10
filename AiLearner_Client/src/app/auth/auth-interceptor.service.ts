import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
  HttpEvent,
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../services/user.service';
@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.log("Error 401: Unauthorized");
          return this.handle401Error(request, next);
        }
        return throwError(() => new Error('test'));
      })
    );
  }
  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.userService.refreshToken().pipe(
      switchMap(() => {
        // After refreshing the token, retry the original request
        console.log("try to validate token again");
        return next.handle(request);
      }),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}
