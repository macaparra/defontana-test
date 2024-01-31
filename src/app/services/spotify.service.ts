import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { environment } from '../../enviroments/environment.prod';
import { throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  url:string = "https://api.spotify.com/v1";

  constructor(private _HttpClient:HttpClient){}

  getToken(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + btoa(environment.clientId + ':' + environment.clientSecret)
    });
  
    const body = new HttpParams()
      .set('grant_type', 'authorization_code')
      .set('client_id', environment.clientId)
      .set('redirect_uri', environment.redirectUri);
  
    return this._HttpClient.post('https://accounts.spotify.com/api/token', body.toString(), { headers }).pipe(
      catchError((error) => {
        console.error('Error while getting token:', error);
        return throwError(error);
      })
    );
  }
  
  getEntities(name:string, offset=0, limit=10):Observable<any>{
    return this._HttpClient.get(`${this.url}/search?q=${name}&type=artist&offset=${offset}&limit=${limit}`,{
      headers:{
        "Authorization": `Bearer  ${environment.access_token}`
      }
    });
  }

  getArtist(id:string):Observable<any>{
    return this._HttpClient.get(`${this.url}/artists/${id}`,{
      headers:{
        "Authorization": `Bearer  ${environment.access_token}`
      }
    });
  }

  getArtistAlbums(id: string): Observable<any> {
    return this._HttpClient.get(`${this.url}/artists/${id}/albums?limit=10`, {
      headers: {
        "Authorization": `Bearer  ${environment.access_token}`
      }
    });
  }

  getArtistTopTracks(id: string): Observable<any> {
    return this._HttpClient.get(`${this.url}/artists/${id}/top-tracks?country=US`, {
      headers: {
        "Authorization": `Bearer  ${environment.access_token}`
      }
    });
  }

  getAlbumDetails(albumId: string): Observable<any> {
    return this._HttpClient.get(`${this.url}/albums/${albumId}`, {
      headers: {
        "Authorization": `Bearer  ${environment.access_token}`
      }
    });
  }

  getTrackDetails(trackId: string): Observable<any> {
    return this._HttpClient.get(`${this.url}/tracks/${trackId}`, {
      headers: {
        "Authorization": `Bearer  ${environment.access_token}`
      }
    });
  }
}
