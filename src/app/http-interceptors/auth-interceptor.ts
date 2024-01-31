import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { BaseService } from '../services/base.service';
import { Injectable } from '@angular/core';
import {catchError} from "rxjs/operators";
import { retryWhen, tap, mergeMap } from 'rxjs/operators';
import { Observable, timer, throwError, of } from 'rxjs';
import { retry } from 'rxjs/operators';
import { SpotifyService } from '../services/spotify.service';
import { switchMap } from 'rxjs/operators';

export const retryCount = 3;
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    retryDelay = 2000;
    retryMaxAttempts = 2;
    constructor(private _SpotifyService:SpotifyService,private router:Router, private _BaseService:BaseService, private _HttpClient:HttpClient) {}
  
    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> | any {
        
        const token:any = localStorage.getItem('token');
        const authReq = request.clone({headers: request.headers.set('Authorization', `Bearer ${token}`)});
 
        return next.handle(authReq).pipe(catchError((err: HttpErrorResponse):any =>  {
            if([400, 401].includes(err.status)){
                
          return this.reAuthenticate().pipe(
            switchMap((data) => {
              const {access_token}:any = data;
              localStorage.setItem('token',access_token);
      
              
                const authReq2 = request.clone({headers: request.headers.set('Authorization', `Bearer ${access_token}`)});

                return next.handle(authReq2);
            })
          )
            }
            return err;
        }))
    }

    reAuthenticate(): Observable<any> {
        return this._SpotifyService.getToken();
      }
}
