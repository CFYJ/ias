import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
 
@Injectable()
export class AuthorizationHeaderInjector implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available 
        let currentUser = localStorage.getItem('user');

        if (currentUser) {
            request = request.clone({
                setHeaders: {
                    Authorization: 'Bearer '+currentUser
                }
            });
        }
 
        return next.handle(request);
    }
}