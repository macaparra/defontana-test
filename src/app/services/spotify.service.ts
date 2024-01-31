import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, config } from 'rxjs';
import { environment } from '../../enviroments/environment.prod';
import { throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  url:string = "https://api.spotify.com/v1";

  constructor(private _HttpClient:HttpClient){}

  getToken(): Observable<any> {
    return new Observable((observer) => {
   fetch("https://accounts.spotify.com/api/token", {
      body: `grant_type=client_credentials&client_id=${'52cd2946efdd498088a6e1d6248e048d'}&client_secret=${'ccfd3d275730499ab0b49906f8ceb174'}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST"
    }) .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = response.json();
      return data;
    })
    .then((data) => {
      observer.next(data);
      observer.complete();
    })
    .catch((error) => {
      observer.error(error);
    });
  });
  }
  
  getEntities(name:string, offset=0, limit=10):Observable<any>{
    const data = this._HttpClient.get(`${this.url}/search?q=${name}&type=artist&offset=${offset}&limit=${limit}`);
    return data;
  }

  getArtist(id:string):Observable<any>{
    return this._HttpClient.get(`${this.url}/artists/${id}`);
  }

  getArtistAlbums(id: string): Observable<any> {
    return this._HttpClient.get(`${this.url}/artists/${id}/albums?limit=10`);
  }

  getArtistTopTracks(id: string): Observable<any> {
    return this._HttpClient.get(`${this.url}/artists/${id}/top-tracks?country=US`);
  }

  getAlbumDetails(albumId: string): Observable<any> {
    return this._HttpClient.get(`${this.url}/albums/${albumId}`);
  }

  getTrackDetails(trackId: string): Observable<any> {
    return this._HttpClient.get(`${this.url}/tracks/${trackId}`);
  }
}
