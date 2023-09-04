import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { EventType, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private svc: AuthService, private router: Router) {}

  routeSub!: Subscription;

  ngOnInit() {
    this.svc.checkUserDataValidity();
    this.routeSub = this.router.events.subscribe((val) => {
      if (val.type == EventType.NavigationEnd) {
        document.title =
          this.router.url == '/'
            ? 'Cybermodding - Home'
            : this.router.url.includes('forum')
            ? 'Cybermodding - Forum'
            : this.router.url.includes('admin') ||
              this.router.url.includes('moderator')
            ? 'Cybermodding - Control Panel'
            : this.router.url.includes('auth')
            ? 'Cybermodding - Auth'
            : this.router.url.includes('profile')
            ? 'Cybermodding - Profile'
            : 'Cybermodding';
      }
    });
  }

  ngOnDestroy() {
    if (this.routeSub) this.routeSub.unsubscribe();
  }
}
