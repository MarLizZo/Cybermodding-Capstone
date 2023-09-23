import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, catchError } from 'rxjs';
import { IUserData } from 'src/app/interfaces/iuser-data';
import { IUserDataPageable } from 'src/app/interfaces/iuser-data-pageable';
import { AuthService } from 'src/app/services/auth.service';
import { ModerationService } from 'src/app/services/moderation.service';

@Component({
  selector: 'app-modcp',
  templateUrl: './modcp.component.html',
  styleUrls: ['./modcp.component.scss'],
})
export class ModcpComponent {
  isLoadingPage: boolean = true;
  username: string = '';
  user_id: number = 0;
  classColor: string = '';
  granted: boolean = false;
  isUsersModeration: boolean = true;
  isThreadsModeration: boolean = false;
  authPrivSub!: Subscription;
  authUserSub!: Subscription;
  usersSub!: Subscription;
  searcUserSub!: Subscription;
  moderateUserSub!: Subscription;
  inputSearchUser: string = '';
  usersFound!: IUserDataPageable;
  collapseableArr: boolean[] = [true, true, true, true, true, true, true, true];
  namesArr: string[] = [];
  pagesArr: number[] = [];

  @ViewChild('userMod') usersBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('threadMod') threadsBtn!: ElementRef<HTMLButtonElement>;

  constructor(
    private authSvc: AuthService,
    private router: Router,
    private svc: ModerationService
  ) {}

  ngOnInit() {
    this.authPrivSub = this.authSvc.privileges$.subscribe((res) => {
      if (res?.isMod || res?.isAdmin) {
        this.granted = true;
        this.classColor = res.isMod ? 'text-mod' : 'text-danger';

        this.authUserSub = this.authSvc.user$.subscribe((res) => {
          this.username = res!.username;
          this.user_id = res!.user_id;
          this.isLoadingPage = false;
        });
      } else {
        this.isLoadingPage = false;
        this.granted = false;
        setTimeout(() => {
          this.router.navigateByUrl('/');
        }, 2000);
      }
    });
  }

  ngOnDestroy() {
    if (this.authPrivSub) this.authPrivSub.unsubscribe();
    if (this.authUserSub) this.authUserSub.unsubscribe();
    if (this.usersSub) this.usersSub.unsubscribe();
    if (this.searcUserSub) this.searcUserSub.unsubscribe();
    if (this.moderateUserSub) this.moderateUserSub.unsubscribe();
  }

  switchModeration(flag: number): void {
    if (flag == 0) {
      if (!this.isUsersModeration) {
        this.isUsersModeration = !this.isUsersModeration;
        this.isThreadsModeration = !this.isThreadsModeration;
        this.usersBtn.nativeElement.classList.toggle('btn-selected');
        this.threadsBtn.nativeElement.classList.toggle('btn-selected');
      }
    } else {
      if (!this.isThreadsModeration) {
        this.isThreadsModeration = !this.isThreadsModeration;
        this.isUsersModeration = !this.isUsersModeration;
        this.usersBtn.nativeElement.classList.toggle('btn-selected');
        this.threadsBtn.nativeElement.classList.toggle('btn-selected');
      }
    }
  }

  searchUsers(page: number): void {
    this.searcUserSub = this.svc
      .getUsersFromName(this.inputSearchUser, page)
      .pipe(
        catchError((err) => {
          throw err;
        })
      )
      .subscribe((res) => {
        this.pagesArr = [];

        if (page + 1 <= 3) {
          for (let i = 0; i < res.totalPages; i++) {
            i < 5 || i > res.totalPages - 3 ? this.pagesArr.push(i + 1) : null;
          }
        } else if (page + 1 >= res.totalPages - 2) {
          for (let i = 0; i < res.totalPages; i++) {
            i < 2 || i > res.totalPages - 6 ? this.pagesArr.push(i + 1) : null;
          }
        } else {
          this.pagesArr.push(1);
          for (let i = page - 2; i < page + 3; i++) {
            this.pagesArr.push(i + 1);
          }
          this.pagesArr.push(res.totalPages);
        }

        for (let i = 0; i < res.numberOfElements; i++) {
          this.namesArr[i] = res.content[i].username;
        }

        for (let i = 0; i < this.collapseableArr.length; i++) {
          this.collapseableArr[i] = true;
        }

        this.usersFound = res;

        setTimeout(() => {
          document.getElementById('top-user')?.scrollIntoView();
        }, 200);
      });
  }

  resetFields(num: number): void {
    let usernameP: HTMLElement | null = document.getElementById(
      'err-us-' + num
    );
    let emailP: HTMLElement | null = document.getElementById('err-em-' + num);
    let descriptionP: HTMLElement | null = document.getElementById(
      'err-de-' + num
    );
    let ruoloP: HTMLElement | null = document.getElementById('err-ru-' + num);
    usernameP!.classList.add('d-none');
    descriptionP?.classList.add('d-none');
    emailP?.classList.add('d-none');
    ruoloP?.classList.add('d-none');
  }

  doChecksUser(form: NgForm, num: number): boolean {
    let bool: boolean = true;
    let usernameP: HTMLElement | null = document.getElementById(
      'err-us-' + num
    );
    let emailP: HTMLElement | null = document.getElementById('err-em-' + num);
    let descriptionP: HTMLElement | null = document.getElementById(
      'err-de-' + num
    );
    let ruoloP: HTMLElement | null = document.getElementById('err-ru-' + num);

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

    if (form.controls['role'].value == 3) {
      bool = false;
      ruoloP?.classList.remove('d-none');
    }

    return bool;
  }

  doUserModerate(data: NgForm, index: number): void {
    this.resetFields(index);

    if (this.doChecksUser(data, index)) {
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
            : [{ id: 1, roleName: 'ROLE_USER' }],
      };

      this.moderateUserSub = this.svc
        .moderate(this.user_id, outData)
        .pipe(
          catchError((err) => {
            throw err;
          })
        )
        .subscribe((res) => {
          console.log(res);
          this.namesArr[index] = res.username!;
        });
    }
  }
}
