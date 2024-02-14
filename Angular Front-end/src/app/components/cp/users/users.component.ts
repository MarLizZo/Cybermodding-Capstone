import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IUserDataPageable } from 'src/app/interfaces/iuser-data-pageable';
import { EMPTY, Subscription, catchError } from 'rxjs';
import { ModerationService } from 'src/app/services/moderation.service';
import { OrangeButtonComponent } from '../../orange-button/orange-button.component';
import { InlineLoaderComponent } from '../../inline-loader/inline-loader.component';
import { IUserData } from 'src/app/interfaces/iuser-data';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    OrangeButtonComponent,
    InlineLoaderComponent,
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  constructor(private svc: ModerationService) {}

  @Input() isStatsView: boolean = false;
  @Input() user_id: number | undefined;
  isError: boolean = false;
  errorMsg: string = '';
  inputSearchUser: string = '';
  usersFound!: IUserDataPageable;
  searcUserSub!: Subscription;
  moderationSub!: Subscription;
  userNamesArr: string[] = [];
  userPagesArr: number[] = [];
  isOpUsers: boolean = false;
  isSingleUserView: boolean = false;
  singleUser: IUserData | undefined;

  ngOnInit() {
    //
  }

  ngOnDestroy() {
    if (this.searcUserSub) this.searcUserSub.unsubscribe();
    if (this.moderationSub) this.moderationSub.unsubscribe();
  }

  searchUsers(page: number): void {
    this.isError = false;
    this.errorMsg = '';
    if (this.isSingleUserView) {
      this.resetSingleView();
      this.resetUsersFields();
    }

    this.searcUserSub = this.svc
      .getUsersFromName(this.inputSearchUser, page)
      .pipe(
        catchError((err) => {
          this.errorMsg = 'Errore nel caricamento degli utenti.';
          this.isError = true;
          return EMPTY;
        })
      )
      .subscribe((res) => {
        this.userNamesArr = [];
        this.userPagesArr = [];

        if (page + 1 <= 3) {
          for (let i = 0; i < res.totalPages; i++) {
            i < 5 || i > res.totalPages - 3
              ? this.userPagesArr.push(i + 1)
              : null;
          }
        } else if (page + 1 >= res.totalPages - 2) {
          for (let i = 0; i < res.totalPages; i++) {
            i < 2 || i > res.totalPages - 6
              ? this.userPagesArr.push(i + 1)
              : null;
          }
        } else {
          this.userPagesArr.push(1);
          for (let i = page - 2; i < page + 3; i++) {
            this.userPagesArr.push(i + 1);
          }
          this.userPagesArr.push(res.totalPages);
        }

        for (let i = 0; i < res.numberOfElements; i++) {
          this.userNamesArr[i] = res.content[i].username;
        }

        this.usersFound = res;
      });
  }

  canBeModerated(): boolean {
    if (this.singleUser!.id == 1 || this.singleUser!.id == 87) return false;
    else return true;
  }

  resetSingleView() {
    this.isSingleUserView = false;
    this.singleUser = undefined;
  }

  setSingleView(user: IUserData) {
    this.singleUser = user;
    this.isSingleUserView = true;
  }

  resetUsersFields(): void {
    let usernameP: HTMLElement | null = document.getElementById('err-username');
    let emailP: HTMLElement | null = document.getElementById('err-email');
    let descriptionP: HTMLElement | null = document.getElementById('err-descr');
    let roleP: HTMLElement | null = document.getElementById('err-role');
    usernameP!.classList.add('d-none');
    descriptionP?.classList.add('d-none');
    emailP?.classList.add('d-none');
    roleP?.classList.add('d-none');
  }

  doChecksUser(form: NgForm): boolean {
    let bool: boolean = true;
    let usernameP: HTMLElement | null = document.getElementById('err-username');
    let emailP: HTMLElement | null = document.getElementById('err-email');
    let descriptionP: HTMLElement | null = document.getElementById('err-descr');

    if (form.controls['username'].value.length < 3) {
      bool = false;
      usernameP!.classList.remove('d-none');
      usernameP!.innerText = 'Min 3 chars';
    } else if (form.controls['username'].value.length > 30) {
      bool = false;
      usernameP!.classList.remove('d-none');
      usernameP!.innerText = 'Max 30 chars';
    }

    if (form.controls['description'].value.length > 25) {
      bool = false;
      descriptionP?.classList.remove('d-none');
    }

    if (
      !RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$').test(
        form.controls['email'].value
      )
    ) {
      bool = false;
      emailP?.classList.remove('d-none');
    }

    return bool;
  }

  doUserModerate(data: NgForm): void {
    this.resetUsersFields();
    this.isError = false;

    if (this.doChecksUser(data)) {
      this.isOpUsers = true;
      let outData: Partial<IUserData> = {
        id: data.controls['uid'].value,
        username: data.controls['username'].value,
        email: data.controls['email'].value,
        description: data.controls['description'].value,
        roles:
          data.controls['role'].value == 4
            ? [{ id: 4, roleName: 'ROLE_BANNED' }]
            : data.controls['role'].value == 2
            ? [{ id: 2, roleName: 'ROLE_MODERATOR' }]
            : data.controls['role'].value == 3
            ? [{ id: 3, roleName: 'ROLE_ADMIN' }]
            : [{ id: 1, roleName: 'ROLE_USER' }],
      };

      this.moderationSub = this.svc
        .moderate(this.user_id!, outData)
        .pipe(
          catchError((err) => {
            this.isOpUsers = false;
            this.errorMsg = 'Errore catch, contatta il dev';
            this.isError = true;
            return EMPTY;
          })
        )
        .subscribe((res) => {
          this.singleUser!.username = res.username!;
          const index = this.usersFound.content.findIndex(
            (el) => el.id == this.singleUser!.id
          );
          this.usersFound.content[index].username = res.username!;
          setTimeout(() => {
            this.isOpUsers = false;
            document
              .querySelector('#userParagMod')
              ?.classList.remove('opacity-0');
            setTimeout(() => {
              document
                .querySelector('#userParagMod')
                ?.classList.add('opacity-0');
            }, 3000);
          }, 1000);
        });
    } else {
      console.log('Checks not passed');
    }
  }
}
