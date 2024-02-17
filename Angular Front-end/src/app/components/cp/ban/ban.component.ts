import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModerationService } from 'src/app/services/moderation.service';
import { EMPTY, Subscription, catchError } from 'rxjs';
import { IUserData } from 'src/app/interfaces/iuser-data';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { OrangeButtonComponent } from '../../orange-button/orange-button.component';

@Component({
  selector: 'app-ban',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbCollapseModule,
    OrangeButtonComponent,
  ],
  templateUrl: './ban.component.html',
  styleUrls: ['./ban.component.scss'],
})
export class BanComponent {
  constructor(private svc: ModerationService) {}

  searchSub!: Subscription;
  banSub!: Subscription;
  @Input() user_id: number | undefined;

  inputSearchUser: string = '';
  foundUser: IUserData | null = null;
  isError: boolean = false;
  errorMsg: string = '';
  isUserCollapsed: boolean = true;
  banResult: string | undefined;

  ngOnInit() {
    //
  }

  ngOnDestroy() {
    if (this.searchSub) this.searchSub.unsubscribe();
    if (this.banSub) this.banSub.unsubscribe();
  }

  searchUser(): void {
    this.isUserCollapsed = true;
    this.foundUser = null;
    this.isError = false;
    this.errorMsg = '';
    this.banResult = undefined;

    this.searchSub = this.svc
      .getSingleUserFromUsername(this.inputSearchUser)
      .pipe(
        catchError((err) => {
          this.errorMsg = 'Errore inatteso, contatta il dev.';
          this.isError = true;
          return EMPTY;
        })
      )
      .subscribe((res) => {
        if (res.response?.ok) {
          this.foundUser = res;
        } else {
          this.errorMsg = res.response!.message;
          this.isError = true;
        }
      });
  }

  quickBan(): void {
    this.isError = false;
    this.errorMsg = '';
    this.banResult = undefined;

    if (this.foundUser?.id == 1 || this.foundUser!.id == 87) {
      if (this.user_id != 1 && this.user_id != 87) {
        this.errorMsg = 'Non ci provare..';
        this.isError = true;
        return;
      }
    }

    this.banSub = this.svc
      .quickBan(this.foundUser!.id!)
      .pipe(
        catchError((err) => {
          this.errorMsg = 'Errore inatteso, contatta il dev.';
          this.isError = true;
          return EMPTY;
        })
      )
      .subscribe((res) => {
        if (res.response?.ok) {
          this.foundUser = res;
          this.banResult = 'User bannato correttamente';
        } else {
          this.errorMsg = res.response!.message;
          this.isError = true;
        }
      });
  }
}
