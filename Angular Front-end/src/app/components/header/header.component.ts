import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, Subscription, catchError } from 'rxjs';
import { IPMInformer } from 'src/app/interfaces/ipminformer';
import { IPrivateMessageData } from 'src/app/interfaces/iprivate-message-data';
import { AuthService } from 'src/app/services/auth.service';
import { PmService } from 'src/app/services/pm.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  nameSub!: Subscription;
  privSub!: Subscription;
  pmSub!: Subscription;
  newPmSub!: Subscription;
  connSub!: Subscription;
  isMenuCollapsed: boolean = true;
  username: string | undefined = undefined;
  usernameColor: string = '';
  isMod: boolean | undefined = false;
  isAdmin: boolean | undefined = false;
  isNewMessage: boolean = false;

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  constructor(
    private router: Router,
    private authSvc: AuthService,
    private pmSvc: PmService
  ) {}

  ngOnInit() {
    if (localStorage.getItem('newpm')) {
      this.isNewMessage = true;
    }

    this.nameSub = this.authSvc.user$.subscribe((res) => {
      if (res) {
        this.username = res?.username;

        this.connSub = this.pmSvc
          .connect(res.user_id)
          .pipe(
            catchError((err) => {
              return EMPTY;
            })
          )
          .subscribe((msg) => {
            let ms = msg as IPrivateMessageData;
            console.log('received message', msg);
            if (ms.recipient_user?.id == res.user_id) {
              let obj: IPMInformer = {
                id: ms.id!,
                sender_id: ms.sender_user!.id!,
                recipient_id: ms.recipient_user!.id!,
              };

              if (localStorage.getItem('newpm')) {
                let fromLS: IPMInformer[] = JSON.parse(
                  localStorage.getItem('newpm')!
                );
                fromLS.push(obj);
                localStorage.setItem('newpm', JSON.stringify(obj));
                this.pmSvc.newPmsPresent.next(fromLS);
              } else {
                localStorage.setItem('newpm', JSON.stringify(Array.of(obj)));
                this.pmSvc.newPmsPresent.next(Array.of(obj));
              }
            }
          });

        this.newPmSub = this.pmSvc.pmsPresent$.subscribe((pm) => {
          if (pm != null) {
            this.isNewMessage = true;
          } else {
            this.isNewMessage = false;
          }
        });
      } else {
        this.username = undefined;
        this.isAdmin = undefined;
        this.isMod = undefined;
        if (this.newPmSub) this.newPmSub.unsubscribe();
      }
    });

    this.privSub = this.authSvc.privileges$.subscribe((res) => {
      this.isMod = res?.isMod;
      this.isAdmin = res?.isAdmin;

      this.usernameColor = this.isMod
        ? 'text-green'
        : this.isAdmin
        ? 'text-danger'
        : 'active-link';
    });
  }

  ngAfterViewInit() {
    let input: HTMLInputElement = this.searchInput.nativeElement;
    input.addEventListener('keypress', (event) => {
      if (event.key == 'Enter') {
        setTimeout(() => {
          if (input.value == '') {
            this.navigate('/search/' + 'noinput');
          } else {
            this.navigate('/search/' + input.value);
          }
          input.value = '';
        }, 250);
      }
    });
  }

  ngOnDestroy() {
    this.pmSvc.disconnect();
    if (this.nameSub) this.nameSub.unsubscribe();
    if (this.privSub) this.privSub.unsubscribe();
    if (this.pmSub) this.pmSub.unsubscribe();
    if (this.newPmSub) this.newPmSub.unsubscribe();
  }

  isHome(): boolean {
    return this.router.url == '/';
  }
  isForum(): boolean {
    return this.router.url.includes('/forum');
  }
  isCommunity(): boolean {
    return this.router.url.includes('/users');
  }
  isContacts(): boolean {
    return this.router.url.includes('/contacts');
  }
  isProfile(): boolean {
    return this.router.url.includes('/profile');
  }
  navigate(url: string): void {
    this.router.navigateByUrl(url);
  }

  onSearch(): void {
    let str = this.searchInput.nativeElement?.value;
    if (str) {
      this.navigate('/search?input=' + str);
    }
  }
}
