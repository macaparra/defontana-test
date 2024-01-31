import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  favoriteColorControl = new FormControl('');
  artists = [];
  page_size = 10;
  page = 0;
  name: string = '';

  constructor(private _SpotifyService: SpotifyService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      this.page_size = isNaN(params['page_size']) ? 10 : params['page_size'];
      this.page = isNaN(params['page']) ? 10 : params['page'];
      this.name = params['search'] || '';
      if (this.name) {
        this.onSubmit();
      }
    });
  }

  onSubmit() {
    this._SpotifyService.getEntities(this.name, this.page, this.page_size).subscribe((resp) => {
      const { artists } = resp;
      const { items } = artists;
      this.artists = items;
    });
  }

  navigate() {
    this.router.navigate([''], {
      queryParams: {
        page_size: this.page_size,
        page: this.page,
        search: this.name,
      },
    });
  }
}
