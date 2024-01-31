import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { SpotifyService } from '../../services/spotify.service';
import { ActivatedRoute } from '@angular/router';
import { nanoid } from 'nanoid';

@Component({
  selector: 'app-artist-detail',
  templateUrl: './artist-detail.component.html',
  styleUrls: ['./artist-detail.component.scss']
})
export class ArtistDetailComponent implements OnInit {
  reactiveForm: FormGroup = new FormGroup({});
  addAlbumForm: FormGroup = this.formBuilder.group({
    title: ['', Validators.required],
    year: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
    imageUrl: ['', Validators.required],
  });
  showAddAlbumForm: boolean = false;
  artistDetails: any;
  artistAlbums: any[] = [];
  artistTopTracks: any[] = [];
  selectedAlbumDetails: any;
  selectedTrackDetails: any;
  selectedAlbums: any[] = [];
  selectedTracks: any[] = [];
  list: any = [];
  scrolled: boolean = false;

  constructor(private formBuilder: FormBuilder, private _SpotifyService: SpotifyService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      const { id } = params;

      this._SpotifyService.getArtist(id).subscribe((artistDetails) => {
        this.artistDetails = artistDetails;
      });

      this._SpotifyService.getArtistAlbums(id).subscribe((albums) => {
        this.artistAlbums = albums.items
          .filter(({ album_type }: any) => album_type === "album")
          .slice(0, 10);
      });

      this._SpotifyService.getArtistTopTracks(id).subscribe((tracks) => {
        this.artistTopTracks = tracks.tracks;
      });

      this.reactiveForm = this.formBuilder.group({
        'name': [params['search'] || ''],
      });
    });

    this.addAlbumForm = this.formBuilder.group({
      title: ['', Validators.required],
      year: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      imageUrl: ['', Validators.required],
    });
  }

  onSelectAlbum(albumId: string, index: number): void {
    const existingIndex = this.selectedAlbums.findIndex(album => album.id === albumId);
  
    if (existingIndex !== -1) {
      this.selectedAlbums.splice(existingIndex, 1);
      this.list = this.list.filter ((i:number) => index!==i)
    } else {
      const selectedAlbum = this.artistAlbums.find(album => album.id === albumId);
      if (selectedAlbum) {
        this.selectedAlbums.unshift(selectedAlbum);
        this.list.push(index);
      }
    }
  
    if (this.selectedAlbums.length === 0) {
      this.selectedAlbumDetails = null;
    }
  }
  
  onSelectTrack(trackId: string): void {
    const existingIndex = this.selectedTracks.findIndex(track => track.id === trackId);
  
    if (existingIndex !== -1) {
      this.selectedTracks.splice(existingIndex, 1);
      this.selectedTrackDetails = null;
    } else {
      this.selectedTracks = [];
  
      const selectedTrack = this.artistTopTracks.find(track => track.id === trackId);
      if (selectedTrack) {
        this.selectedTracks.push(selectedTrack);
      }
  

      this._SpotifyService.getTrackDetails(trackId).subscribe((trackDetails) => {
        this.selectedTrackDetails = trackDetails;
      });
    }
  }

  getSelectedAlbumImages(): string[] {
    return this.selectedAlbums.map(album => album.images[0].url);
  }

  isSelectedAlbum(albumId: string): boolean {
    return this.selectedAlbums.some(album => album.id === albumId);
  }

  isSelectedTrack(trackId: string): boolean {
    return this.selectedTracks.some(track => track.id === trackId);
  }

  toggleAddAlbumForm() {
    this.showAddAlbumForm = !this.showAddAlbumForm;
  }
  

  addAlbum() {
    const currentDate = new Date();
    const newAlbum = {
      id: nanoid(),
      name: this.addAlbumForm.value.title,
      release_date: currentDate.toISOString().split('T')[0],
      images: [{ url: this.addAlbumForm.value.imageUrl }],
      album_type: 'album',
      artists: [{ name: this.artistDetails.name }]
    };
  
    // Agrega el nuevo álbum al principio del array
    this.artistAlbums = [newAlbum, ...this.artistAlbums];
  
    // Solo toma los primeros 10 álbumes
    this.artistAlbums = this.artistAlbums.slice(0, 10);
  
    // Si hay álbumes seleccionados, actualiza la lista y detalles del álbum
    if (this.selectedAlbums.length > 0) {
      this.selectedAlbums = [newAlbum];
      this.selectedAlbumDetails = newAlbum;
    }

    this.showAddAlbumForm = false;
  }
  
  
  
  
  
}
