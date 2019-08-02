import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RequestInterceptor implements HttpInterceptor {
  constructor(private http: HttpClient, private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Retrieve connected user info
    const userToken = this.authService.getAuthenticatedUser();
    if( userToken != null && userToken.bearerToken != null )
    req = req.clone({
      setHeaders: {
        Authorization: userToken.bearerToken
      }
    });
    console.log(req.headers.get('Authorization'));
    // Forward request handling
    return next.handle(req);
  }
}
