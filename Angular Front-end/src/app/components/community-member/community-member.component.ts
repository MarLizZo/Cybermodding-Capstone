import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IUserData } from 'src/app/interfaces/iuser-data';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-community-member',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './community-member.component.html',
  styleUrls: ['./community-member.component.scss'],
})
export class CommunityMemberComponent {
  constructor(private router: Router, private auth_svc: AuthService) {}

  @Input() user!: IUserData;
  @Input() giveBorder!: boolean;
  authSub!: Subscription;

  ngOnDestroy() {
    if (this.authSub) this.authSub.unsubscribe();
  }

  goToProfile() {
    this.authSub = this.auth_svc.user$.subscribe((res) => {
      if (res?.user_id == this.user.id) {
        this.router.navigateByUrl('/profile');
      } else {
        this.router.navigateByUrl(
          '/users/' +
            `${this.user.id}-${this.user.username
              .replaceAll('.', '')
              .toLowerCase()}`
        );
      }
    });
  }
}
