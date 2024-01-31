import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { BaseService } from '../services/base.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {catchError} from "rxjs/operators";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router:Router, private _BaseService:BaseService) {}
  
    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> | any {
        
        const token:any = localStorage.getItem('token');
        const authReq = request.clone({headers: request.headers.set('Authorization', `Bearer ${token}`)});
 
        return next.handle(authReq).pipe(catchError((err: HttpErrorResponse):any =>  {
            if([400, 401].includes(err.status)){
                (async () => {
                    const result = await fetch("https://accounts.spotify.com/api/token", {
                    body: `grant_type=client_credentials&client_id=${'52cd2946efdd498088a6e1d6248e048d'}&client_secret=${'ccfd3d275730499ab0b49906f8ceb174'}`,
                    headers: {
                      "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: "POST"
                  })
                  const data = await result.json();
                  const {access_token} = data;
                  localStorage.setItem('token', access_token)
                  const authReq2 = request.clone({headers: request.headers.set('Authorization', `Bearer ${token}`)});

                  return next.handle(authReq2);
                  })()
            }
            return err;
        }))
    }
}
