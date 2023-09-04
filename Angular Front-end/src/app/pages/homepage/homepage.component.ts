import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent {
  constructor() {}

  isLoadingPage: boolean = true;

  ngOnInit() {
    setTimeout(() => {
      this.isLoadingPage = false;
    }, 1500);
  }
}
