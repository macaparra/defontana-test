import { Component, OnInit } from '@angular/core';
import { SpotifyService } from './services/spotify.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'test-defontana';

  constructor(private _spotifyService: SpotifyService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      const { access_token } = params; 
    });
  }
}
