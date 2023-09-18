import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IUserData } from 'src/app/interfaces/iuser-data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-community-member',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './community-member.component.html',
  styleUrls: ['./community-member.component.scss'],
})
export class CommunityMemberComponent {
  constructor(private router: Router) {}

  @Input() user!: IUserData;
  @Input() giveBorder!: boolean;

  goToProfile() {
    this.router.navigateByUrl(
      '/users/' +
        `${this.user.id}-${this.user.username
          .replaceAll('.', '')
          .toLowerCase()}`
    );
  }
}
