import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EMPTY, EmptyError, Subscription, catchError } from 'rxjs';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { IContactMessageBody } from 'src/app/interfaces/icontact-message-body';
import { IPostHomePaged } from 'src/app/interfaces/ipost-home-paged';
import { ISectionData } from 'src/app/interfaces/isection-data';
import { ISideBlockData } from 'src/app/interfaces/iside-block-data';
import { ISubSectionData } from 'src/app/interfaces/isub-section-data';
import { IUpdatePostDTO } from 'src/app/interfaces/iupdate-post-dto';
import { IUserData } from 'src/app/interfaces/iuser-data';
import { IUserDataPageable } from 'src/app/interfaces/iuser-data-pageable';
import { AuthService } from 'src/app/services/auth.service';
import { ModerationService } from 'src/app/services/moderation.service';

@Component({
  selector: 'app-admincp',
  templateUrl: './admincp.component.html',
  styleUrls: ['./admincp.component.scss'],
})
export class AdmincpComponent {
  constructor(
    private authSvc: AuthService,
    private router: Router,
    private svc: ModerationService,
    private modalSvc: NgbModal
  ) {}

  isLoadingPage: boolean = true;
  isWaitingPage: boolean = true;
  isWaitingPanel: boolean = true;
  isErrorPanel: boolean = false;
  isErrorMessagePanel: boolean = false;
  errorPanelMsg: string = '';
  username: string | undefined = '';
  user_id: number | undefined = 0;
  granted: boolean = false;

  isContactModeration: boolean = false;
  isSingleContactModeration: boolean = false;
  isUsersModeration: boolean = true;
  isThreadsModeration: boolean = false;
  isSectionsModeration: boolean = false;
  isBlocksModeration: boolean = false;
  isThreadViewSearch: boolean = true;
  isThreadViewAll: boolean = false;
  isSectionViewCreate: boolean = true;
  isSubSectionViewCreate: boolean = false;
  isSectionViewAll: boolean = false;
  isBlocksViewCreate: boolean = true;
  isBlockViewAll: boolean = false;

  isOpUsers: boolean = false;
  isOpThread: boolean = false;
  isOpSection: boolean = false;
  isOpBlock: boolean = false;

  initSub!: Subscription;
  authPrivSub!: Subscription;
  authUserSub!: Subscription;
  usersSub!: Subscription;
  searcUserSub!: Subscription;
  moderateUserSub!: Subscription;
  threadSub!: Subscription;
  moderateThreadSub!: Subscription;
  sectionSub!: Subscription;
  subSectionSub!: Subscription;
  subSectionOperationsSub!: Subscription;
  sectionOperationsSub!: Subscription;
  blockOperationsSub!: Subscription;
  contactsOperationsSub!: Subscription;

  inputSearchUser: string = '';
  usersFound!: IUserDataPageable;
  collapseableArr: boolean[] = [true, true, true, true, true, true, true, true];
  userNamesArr: string[] = [];
  userPagesArr: number[] = [];
  contactMessagesArr: IContactMessageBody[] = [];
  openContactMessagesArr: IContactMessageBody[] = [];
  closedContactMessagesArr: IContactMessageBody[] = [];
  singleContactMsg: IContactMessageBody | null = null;

  inputSearchThread: string = '';
  threadSearchCriteria: number = 0;
  threadsFound!: IPostHomePaged;
  collapseableTArr: boolean[] = [
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
  ];
  threadsCustomFound!: IPostHomePaged;
  collapseableTCArr: boolean[] = [
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
  ];
  startDateThread: string = '2023/1/1';
  endDateThread: string = '2023/12/1';
  threadTitleArr: string[] = [];
  threadPagesArr: number[] = [];
  threadTitleCustomArr: string[] = [];
  threadPagesCustomArr: number[] = [];

  sectionsArr: ISectionData[] = [];
  sectionsTitleArr: string[] = [];
  collapseableSArr: boolean[] = [
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
  ];
  activeBoolArr: boolean[] = [];
  selectedSSIndex: number = -1;
  newSubSectionParentId: number = -1;

  blockType: string = 'BLOCK_ALL';
  blockContent: string = '';
  blockTitle: string = '';
  blocksArr: ISideBlockData[] = [];
  collapseableBArr: boolean[] = [
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
  ];
  collapseableCMArr: boolean[] = [];
  activeBoolBArr: boolean[] = [];
  blocksTitleArr: string[] = [];
  blocksTypeArr: string[] = [];

  @ViewChild('contactsMod') contactsBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('errorSingleContact') errorSingleContact!: ElementRef<HTMLElement>;
  @ViewChild('userMod') usersBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('threadMod') threadsBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('sectionMod') sectionsBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('blockMod') blocksBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('threadViewSearch')
  threadViewSearchBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('threadViewAll') threadViewAllBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('selectCriteria')
  threadCriteriaSelect!: ElementRef<HTMLSelectElement>;
  @ViewChild('sectionViewCreate')
  sectionViewCreateBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('subSectionViewCreate')
  subSectionViewCreateBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('sectionViewAll')
  sectionViewAllBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('blockViewCreate')
  blockViewCreateBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('blockViewAll')
  blockViewAllBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('activeRadioOne')
  radioActive!: ElementRef<HTMLInputElement>;
  @ViewChild('activeSSRadioOne') radioSSActive!: ElementRef<HTMLInputElement>;

  @ViewChild('sectionCParagMod') sectionCMod!: ElementRef<HTMLElement>;
  @ViewChild('subsectionCParagMod') subSectionCMod!: ElementRef<HTMLElement>;
  @ViewChild('blockParagMod') blockMod!: ElementRef<HTMLElement>;

  ngOnInit() {
    this.authSvc.intialized$.subscribe((init) => {
      if (init) {
        this.authPrivSub = this.authSvc.privileges$.subscribe((res) => {
          if (res?.isAdmin) {
            this.granted = true;

            this.authUserSub = this.authSvc.user$.subscribe((res) => {
              this.username = res?.username;
              this.user_id = res?.user_id;

              this.getContactMessages();
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
    });

    setTimeout(() => {
      this.isWaitingPage = false;
    }, 750);
  }

  ngOnDestroy() {
    if (this.authPrivSub) this.authPrivSub.unsubscribe();
    if (this.authUserSub) this.authUserSub.unsubscribe();
    if (this.usersSub) this.usersSub.unsubscribe();
    if (this.searcUserSub) this.searcUserSub.unsubscribe();
    if (this.moderateUserSub) this.moderateUserSub.unsubscribe();
    if (this.threadSub) this.threadSub.unsubscribe();
    if (this.moderateThreadSub) this.moderateThreadSub.unsubscribe();
    if (this.sectionSub) this.sectionSub.unsubscribe();
    if (this.sectionOperationsSub) this.sectionOperationsSub.unsubscribe();
    if (this.subSectionSub) this.subSectionSub.unsubscribe();
    if (this.subSectionOperationsSub)
      this.subSectionOperationsSub.unsubscribe();
    if (this.blockOperationsSub) this.blockOperationsSub.unsubscribe();
    if (this.initSub) this.initSub.unsubscribe();
    if (this.contactsOperationsSub) this.contactsOperationsSub.unsubscribe();
  }

  switchModeration(flag: number): void {
    this.isErrorPanel = false;
    this.errorPanelMsg = '';

    if (flag == 0) {
      if (!this.isContactModeration) {
        this.isContactModeration = true;
        this.isUsersModeration = false;
        this.isThreadsModeration = false;
        this.isSectionsModeration = false;
        this.isBlocksModeration = false;
        this.contactsBtn.nativeElement.classList.add('btn-selected');
        this.usersBtn.nativeElement.classList.remove('btn-selected');
        this.threadsBtn.nativeElement.classList.remove('btn-selected');
        this.sectionsBtn.nativeElement.classList.remove('btn-selected');
        this.blocksBtn.nativeElement.classList.remove('btn-selected');
      }
    } else if (flag == 1) {
      if (!this.isUsersModeration) {
        this.isContactModeration = false;
        this.isUsersModeration = true;
        this.isThreadsModeration = false;
        this.isSectionsModeration = false;
        this.isBlocksModeration = false;
        this.contactsBtn.nativeElement.classList.remove('btn-selected');
        this.usersBtn.nativeElement.classList.add('btn-selected');
        this.threadsBtn.nativeElement.classList.remove('btn-selected');
        this.sectionsBtn.nativeElement.classList.remove('btn-selected');
        this.blocksBtn.nativeElement.classList.remove('btn-selected');
      }
    } else if (flag == 2) {
      if (!this.isThreadsModeration) {
        this.isContactModeration = false;
        this.isThreadsModeration = true;
        this.isUsersModeration = false;
        this.isSectionsModeration = false;
        this.isBlocksModeration = false;
        this.contactsBtn.nativeElement.classList.remove('btn-selected');
        this.usersBtn.nativeElement.classList.remove('btn-selected');
        this.threadsBtn.nativeElement.classList.add('btn-selected');
        this.sectionsBtn.nativeElement.classList.remove('btn-selected');
        this.blocksBtn.nativeElement.classList.remove('btn-selected');
      }
    } else if (flag == 3) {
      if (!this.isSectionsModeration) {
        this.isContactModeration = false;
        this.isSectionsModeration = true;
        this.isUsersModeration = false;
        this.isThreadsModeration = false;
        this.isBlocksModeration = false;
        this.contactsBtn.nativeElement.classList.remove('btn-selected');
        this.usersBtn.nativeElement.classList.remove('btn-selected');
        this.threadsBtn.nativeElement.classList.remove('btn-selected');
        this.sectionsBtn.nativeElement.classList.add('btn-selected');
        this.blocksBtn.nativeElement.classList.remove('btn-selected');
      }
    } else if (flag == 4) {
      if (!this.isBlocksModeration) {
        this.isContactModeration = false;
        this.isBlocksModeration = true;
        this.isUsersModeration = false;
        this.isThreadsModeration = false;
        this.isSectionsModeration = false;
        this.contactsBtn.nativeElement.classList.remove('btn-selected');
        this.usersBtn.nativeElement.classList.remove('btn-selected');
        this.threadsBtn.nativeElement.classList.remove('btn-selected');
        this.sectionsBtn.nativeElement.classList.remove('btn-selected');
        this.blocksBtn.nativeElement.classList.add('btn-selected');
      }
    }
  }

  switchThreadView(flag: number): void {
    this.isErrorPanel = false;
    this.errorPanelMsg = '';

    if (flag == 0) {
      if (!this.isThreadViewSearch) {
        this.isThreadViewSearch = true;
        this.isThreadViewAll = false;
        this.threadViewSearchBtn.nativeElement.classList.add('btn-selected');
        this.threadViewAllBtn.nativeElement.classList.remove('btn-selected');
      }
    } else if (flag == 1) {
      if (!this.isThreadViewAll) {
        this.isThreadViewSearch = false;
        this.isThreadViewAll = true;
        this.threadViewSearchBtn.nativeElement.classList.remove('btn-selected');
        this.threadViewAllBtn.nativeElement.classList.add('btn-selected');
      }
    }
  }

  getContactMessages() {
    if (this.contactsOperationsSub) this.contactsOperationsSub.unsubscribe();
    this.isWaitingPanel = true;
    this.isErrorPanel = false;
    this.isErrorMessagePanel = false;

    this.contactsOperationsSub = this.svc
      .getAllContactMessages()
      .pipe(
        catchError((err) => {
          this.errorPanelMsg = 'Errore nel caricamento dei messaggi';
          this.isErrorMessagePanel = true;
          this.isWaitingPanel = false;
          return EMPTY;
        })
      )
      .subscribe((res) => {
        this.contactMessagesArr = res;
        this.openContactMessagesArr = res.filter((el) => !el.closed);
        this.closedContactMessagesArr = res.filter((el) => el.closed);
        this.isWaitingPanel = false;
      });
  }

  showMsg(index: number) {
    this.singleContactMsg = this.openContactMessagesArr[index];
    this.isSingleContactModeration = true;
  }

  setMsgAsClosed() {
    this.errorSingleContact.nativeElement.classList.add('d-none');
    let index: number = this.openContactMessagesArr.findIndex(
      (el) => el.id == this.singleContactMsg?.id
    );

    if (index >= 0) {
      this.svc
        .setMessageClosed(this.openContactMessagesArr[index].id)
        .pipe(
          catchError((err) => {
            this.errorSingleContact.nativeElement.classList.remove('d-none');
            return EMPTY;
          })
        )
        .subscribe((res) => {
          if (res.response.ok) {
            this.openContactMessagesArr[index].closed = true;
            this.closedContactMessagesArr.push(
              this.openContactMessagesArr[index]
            );
            this.openContactMessagesArr.splice(index, 1);
            this.isSingleContactModeration = false;
            console.log(res);
          } else {
            this.errorSingleContact.nativeElement.classList.remove('d-none');
          }
        });
    }
  }

  getBlocks() {
    this.isWaitingPanel = true;

    for (let i = 0; i < this.collapseableBArr.length; i++) {
      this.collapseableBArr[i] = true;
    }
    this.activeBoolBArr = [];
    this.blocksTitleArr = [];
    this.blocksArr = [];
    this.blockOperationsSub = this.svc
      .getBlocks()
      .pipe(
        catchError((err) => {
          this.errorPanelMsg = 'Errore nel caricamento dei blocchi';
          this.isErrorPanel = true;
          this.isWaitingPanel = false;
          return EMPTY;
        })
      )
      .subscribe((res) => {
        this.blocksArr = res;
        for (let i = 0; i < res.length; i++) {
          this.activeBoolBArr.push(res[i].active);
          this.blocksTitleArr.push(res[i].title);
          this.blocksTypeArr.push(res[i].e_block_type.toString());
        }
        this.isWaitingPanel = false;
      });
  }

  switchBlockView(flag: number): void {
    this.isErrorPanel = false;
    this.errorPanelMsg = '';

    if (flag == 0) {
      if (!this.isBlocksViewCreate) {
        this.isBlocksViewCreate = true;
        this.isBlockViewAll = false;
        this.blockViewCreateBtn.nativeElement.classList.add('btn-selected');
        this.blockViewAllBtn.nativeElement.classList.remove('btn-selected');
      }
    } else if (flag == 1) {
      if (!this.isBlockViewAll) {
        this.isBlocksViewCreate = false;
        this.isBlockViewAll = true;
        this.blockViewCreateBtn.nativeElement.classList.remove('btn-selected');
        this.blockViewAllBtn.nativeElement.classList.add('btn-selected');
        this.getBlocks();
      }
    }
  }

  switchSectionView(flag: number): void {
    this.isErrorPanel = false;
    this.errorPanelMsg = '';

    if (flag == 0) {
      if (!this.isSectionViewCreate) {
        this.isSectionViewCreate = true;
        this.isSubSectionViewCreate = false;
        this.isSectionViewAll = false;
        this.sectionViewCreateBtn.nativeElement.classList.add('btn-selected');
        this.subSectionViewCreateBtn.nativeElement.classList.remove(
          'btn-selected'
        );
        this.sectionViewAllBtn.nativeElement.classList.remove('btn-selected');
      }
    } else if (flag == 1) {
      if (!this.isSubSectionViewCreate) {
        this.isSectionViewCreate = false;
        this.isSubSectionViewCreate = true;
        this.isSectionViewAll = false;
        this.sectionViewCreateBtn.nativeElement.classList.remove(
          'btn-selected'
        );
        this.subSectionViewCreateBtn.nativeElement.classList.add(
          'btn-selected'
        );
        this.sectionViewAllBtn.nativeElement.classList.remove('btn-selected');
        this.sectionsArr = [];
        this.getSections();
      }
    } else if (flag == 2) {
      if (!this.isSectionViewAll) {
        this.isSectionViewCreate = false;
        this.isSubSectionViewCreate = false;
        this.isSectionViewAll = true;
        this.sectionViewCreateBtn.nativeElement.classList.remove(
          'btn-selected'
        );
        this.subSectionViewCreateBtn.nativeElement.classList.remove(
          'btn-selected'
        );
        this.sectionViewAllBtn.nativeElement.classList.add('btn-selected');
        this.sectionsArr = [];
        this.getSections();
      }
    }
  }

  searchUsers(page: number): void {
    this.isErrorPanel = false;
    this.errorPanelMsg = '';

    this.searcUserSub = this.svc
      .getUsersFromName(this.inputSearchUser, page)
      .pipe(
        catchError((err) => {
          this.errorPanelMsg = 'Errore nel caricamento degli utenti.';
          this.isErrorPanel = true;
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

        for (let i = 0; i < this.collapseableArr.length; i++) {
          this.collapseableArr[i] = true;
        }

        this.usersFound = res;

        setTimeout(() => {
          document.getElementById('top-user')?.scrollIntoView();
        }, 200);
      });
  }

  resetUsersFields(num: number): void {
    let usernameP: HTMLElement | null = document.getElementById(
      'err-us-' + num
    );
    let emailP: HTMLElement | null = document.getElementById('err-em-' + num);
    let descriptionP: HTMLElement | null = document.getElementById(
      'err-de-' + num
    );
    usernameP!.classList.add('d-none');
    descriptionP?.classList.add('d-none');
    emailP?.classList.add('d-none');
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

  doUserModerate(data: NgForm, index: number): void {
    this.resetUsersFields(index);

    if (this.doChecksUser(data, index)) {
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
            ? [{ id: 2, roleName: 'ROLE_ADMIN' }]
            : [{ id: 1, roleName: 'ROLE_USER' }],
      };

      this.moderateUserSub = this.svc
        .moderate(this.user_id!, outData)
        .pipe(
          catchError((err) => {
            this.isOpUsers = false;
            throw err;
          })
        )
        .subscribe((res) => {
          this.userNamesArr[index] = res.username!;
          setTimeout(() => {
            this.isOpUsers = false;
            document
              .querySelector('#userParagMod' + index)
              ?.classList.remove('opacity-0');
            setTimeout(() => {
              document
                .querySelector('#userParagMod' + index)
                ?.classList.add('opacity-0');
            }, 3000);
          }, 1000);
        });
    }
  }

  doPostModerate(data: NgForm, index: number): void {
    this.isOpThread = true;
    let obj: Partial<IUpdatePostDTO> = {
      id: this.isThreadViewAll
        ? data.controls['tid'].value
        : data.controls['tidc'].value,
      title: this.isThreadViewAll
        ? data.controls['title'].value
        : data.controls['titlec'].value,
    };
    this.moderateThreadSub = this.svc
      .updatePost(this.user_id!, obj)
      .pipe(
        catchError((err) => {
          this.isOpThread = false;
          throw err;
        })
      )
      .subscribe((res) => {
        if (this.isThreadViewAll) {
          this.threadTitleArr[index] = res.title;
          setTimeout(() => {
            this.isOpThread = false;
            document
              .querySelector('#threadAllParagMod' + index)
              ?.classList.remove('opacity-0');
            setTimeout(() => {
              document
                .querySelector('#threadAllParagMod' + index)
                ?.classList.add('opacity-0');
            }, 3000);
          }, 1000);
        } else {
          this.threadTitleCustomArr[index] = res.title;
          setTimeout(() => {
            this.isOpThread = false;
            document
              .querySelector('#threadParagMod' + index)
              ?.classList.remove('opacity-0');
            setTimeout(() => {
              document
                .querySelector('#threadParagMod' + index)
                ?.classList.add('opacity-0');
            }, 3000);
          }, 1000);
        }
      });
  }

  doThreadSearch(page: number) {
    this.isErrorPanel = false;
    this.errorPanelMsg = '';

    if (this.threadSub) this.threadSub.unsubscribe();

    if (this.isThreadViewAll) {
      this.threadSub = this.svc
        .getPosts(0, '?size=6' + '&page=' + page, 0)
        .pipe(
          catchError((err) => {
            this.errorPanelMsg = 'Errore nel caricamento dei post.';
            this.isErrorPanel = true;
            return EMPTY;
          })
        )
        .subscribe((res) => {
          this.threadTitleArr = [];
          this.threadPagesArr = [];

          if (page + 1 <= 3) {
            for (let i = 0; i < res.totalPages; i++) {
              i < 5 || i > res.totalPages - 3
                ? this.threadPagesArr.push(i + 1)
                : null;
            }
          } else if (page + 1 >= res.totalPages - 2) {
            for (let i = 0; i < res.totalPages; i++) {
              i < 2 || i > res.totalPages - 6
                ? this.threadPagesArr.push(i + 1)
                : null;
            }
          } else {
            this.threadPagesArr.push(1);
            for (let i = page - 2; i < page + 3; i++) {
              this.threadPagesArr.push(i + 1);
            }
            this.threadPagesArr.push(res.totalPages);
          }

          for (let i = 0; i < res.numberOfElements; i++) {
            this.threadTitleArr[i] = res.content[i].title;
          }

          for (let i = 0; i < this.collapseableTArr.length; i++) {
            this.collapseableTArr[i] = true;
          }
          this.threadsFound = res;
        });
    } else {
      let searchBy = '';
      if (this.threadSearchCriteria == 0) {
        searchBy = '&by=title&param=' + this.inputSearchThread;
      } else if (this.threadSearchCriteria == 1) {
        searchBy = '&by=user&param=' + this.inputSearchThread;
      } else {
        searchBy =
          '&by=date&param=' +
          this.startDateThread +
          '&paramtwo=' +
          this.endDateThread;
      }
      let params: string = 'size=6&page=' + page + searchBy;

      this.threadSub = this.svc
        .getPostPaged(params)
        .pipe(
          catchError((err) => {
            this.errorPanelMsg = 'Errore nel caricamento dei post.';
            this.isErrorPanel = true;
            return EMPTY;
          })
        )
        .subscribe((res) => {
          this.threadTitleCustomArr = [];
          this.threadPagesCustomArr = [];

          if (page + 1 <= 3) {
            for (let i = 0; i < res.totalPages; i++) {
              i < 5 || i > res.totalPages - 3
                ? this.threadPagesCustomArr.push(i + 1)
                : null;
            }
          } else if (page + 1 >= res.totalPages - 2) {
            for (let i = 0; i < res.totalPages; i++) {
              i < 2 || i > res.totalPages - 6
                ? this.threadPagesCustomArr.push(i + 1)
                : null;
            }
          } else {
            this.threadPagesCustomArr.push(1);
            for (let i = page - 2; i < page + 3; i++) {
              this.threadPagesCustomArr.push(i + 1);
            }
            this.threadPagesCustomArr.push(res.totalPages);
          }

          for (let i = 0; i < res.numberOfElements; i++) {
            this.threadTitleCustomArr[i] = res.content[i].title;
          }

          for (let i = 0; i < this.collapseableTCArr.length; i++) {
            this.collapseableTCArr[i] = true;
          }

          this.threadsCustomFound = res;
        });
    }
  }

  resetSecCollapse(index: number) {
    this.collapseableSArr[index] = !this.collapseableSArr[index];
    this.selectedSSIndex = -1;
  }

  getSections() {
    this.errorPanelMsg = '';
    this.isErrorPanel = false;
    this.isWaitingPanel = true;

    this.sectionsTitleArr = [];
    this.sectionsArr = [];
    this.activeBoolArr = [];
    this.newSubSectionParentId = -1;
    this.sectionSub = this.svc
      .getSections()
      .pipe(
        catchError((err) => {
          this.errorPanelMsg = 'Errore nel caricamento delle sezioni.';
          this.isErrorPanel = true;
          this.isWaitingPanel = false;
          return EMPTY;
        })
      )
      .subscribe((res) => {
        this.sectionsArr = res;
        for (let i = 0; i < this.sectionsArr.length; i++) {
          this.sectionsTitleArr.push(res[i].title);
          this.activeBoolArr.push(res[i].active);
        }
        this.isWaitingPanel = false;
      });
  }

  doSectionsCheck(form: NgForm): boolean {
    let bool: boolean = true;

    let titleP: HTMLElement | null = document.getElementById(
      'err-ti-' + this.selectedSSIndex
    );
    let descriptionP: HTMLElement | null = document.getElementById(
      'err-descr-' + this.selectedSSIndex
    );
    let orderP: HTMLElement | null = document.getElementById(
      'err-order-' + this.selectedSSIndex
    );

    if (form.controls['title'].value.length < 3) {
      bool = false;
      titleP!.classList.remove('d-none');
      titleP!.innerText = 'Min 3 chars';
    }

    if (form.controls['description'].value.length > 100) {
      bool = false;
      descriptionP!.classList.remove('d-none');
      descriptionP!.innerText = 'Max 100 chars';
    }

    if (isNaN(Number(form.controls['order'].value))) {
      bool = false;
      orderP!.classList.remove('d-none');
      orderP!.innerText = 'Invalid value';
    }

    return bool;
  }

  doSectionUpdate(index: number, data: NgForm) {
    if (this.doSectionsCheck(data)) {
      this.isOpSection = true;
      let obj: ISectionData = {
        id: data.controls['id'].value,
        title: data.controls['title'].value,
        description: data.controls['description'].value,
        active: this.activeBoolArr[index],
        order_number: data.controls['order'].value,
      };

      this.sectionOperationsSub = this.svc
        .updateSection(this.user_id!, obj)
        .pipe(
          catchError((err) => {
            this.isOpSection = false;
            throw err;
          })
        )
        .subscribe((res) => {
          setTimeout(() => {
            this.isOpSection = false;
            document
              .querySelector('#sectionUParagMod' + index)
              ?.classList.remove('opacity-0');
            setTimeout(() => {
              document
                .querySelector('#sectionUParagMod' + index)
                ?.classList.add('opacity-0');
              this.selectedSSIndex = -1;
              for (let i = 0; i < this.collapseableSArr.length; i++) {
                this.collapseableSArr[i] = true;
              }
              this.getSections();
            }, 2000);
          }, 1000);
        });
    }
  }

  doSubSectionsCheck(form: NgForm, num: number): boolean {
    let bool: boolean = true;

    let titleP: HTMLElement | null = document.getElementById('err-ssti-' + num);
    let descriptionP: HTMLElement | null = document.getElementById(
      'err-ssdescr-' + num
    );
    let orderP: HTMLElement | null = document.getElementById(
      'err-ssorder-' + num
    );

    if (form.controls['sstitle'].value.length < 3) {
      bool = false;
      titleP!.classList.remove('d-none');
      titleP!.innerText = 'Min 3 chars';
    }

    if (form.controls['ssdescription'].value.length > 100) {
      bool = false;
      descriptionP!.classList.remove('d-none');
      descriptionP!.innerText = 'Max 100 chars';
    }

    if (isNaN(Number(form.controls['ssorder'].value))) {
      bool = false;
      orderP!.classList.remove('d-none');
      orderP!.innerText = 'Invalid value';
    }

    return bool;
  }

  doSubSectionUpdate(parent_section_id: number, data: NgForm) {
    if (this.doSubSectionsCheck(data, this.selectedSSIndex)) {
      this.isOpSection = true;
      let obj: Partial<ISubSectionData> = {
        id: data.controls['ssid'].value,
        title: data.controls['sstitle'].value,
        description: data.controls['ssdescription'].value,
        active: this.radioSSActive.nativeElement.checked ? true : false,
        order_number: data.controls['ssorder'].value,
        parent_id: parent_section_id,
      };

      this.subSectionOperationsSub = this.svc
        .updateSubSection(this.user_id!, obj)
        .pipe(
          catchError((err) => {
            this.isOpSection = false;
            throw err;
          })
        )
        .subscribe((res) => {
          setTimeout(() => {
            this.isOpSection = false;
            document
              .querySelector(
                '#subsectionUParagMod' +
                  this.selectedSSIndex +
                  parent_section_id
              )
              ?.classList.remove('opacity-0');
            setTimeout(() => {
              document
                .querySelector(
                  '#subsectionUParagMod' +
                    this.selectedSSIndex +
                    parent_section_id
                )
                ?.classList.add('opacity-0');
            }, 2000);
          }, 1000);
        });
    }
  }

  doNewSecChecks(form: NgForm): boolean {
    let bool: boolean = true;

    let titleP: HTMLElement | null = document.getElementById('err-ti');
    let descriptionP: HTMLElement | null = document.getElementById('err-descr');
    let orderP: HTMLElement | null = document.getElementById('err-order');

    if (form.controls['title'].value < 3) {
      bool = false;
      titleP!.classList.remove('d-none');
      titleP!.innerText = 'Min 3 chars';
    }

    if (form.controls['description'].value.length > 100) {
      bool = false;
      descriptionP!.classList.remove('d-none');
      descriptionP!.innerText = 'Max 100 chars';
    }

    if (isNaN(Number(form.controls['order'].value))) {
      bool = false;
      orderP!.classList.remove('d-none');
      orderP!.innerText = 'Invalid value';
    }

    return bool;
  }

  doNewSubSecChecks(form: NgForm): boolean {
    let bool: boolean = true;

    let parentP: HTMLElement | null = document.getElementById('err-parent');
    let titleP: HTMLElement | null = document.getElementById('err-ti');
    let descriptionP: HTMLElement | null = document.getElementById('err-descr');
    let orderP: HTMLElement | null = document.getElementById('err-order');

    if (this.newSubSectionParentId == -1) {
      bool = false;
      parentP!.classList.remove('d-none');
      parentP!.innerText = 'Invalid value';
    }

    if (form.controls['title'].value < 3) {
      bool = false;
      titleP!.classList.remove('d-none');
      titleP!.innerText = 'Min 3 chars';
    }

    if (form.controls['description'].value.length > 80) {
      bool = false;
      descriptionP!.classList.remove('d-none');
      descriptionP!.innerText = 'Max 80 chars';
    }

    if (
      form.controls['order'].value.length == 0 ||
      isNaN(Number(form.controls['order'].value))
    ) {
      bool = false;
      orderP!.classList.remove('d-none');
      orderP!.innerText = 'Invalid value';
    }

    return bool;
  }

  resetSFields() {
    document.getElementById('err-ti')?.classList.add('d-none');
    document.getElementById('err-descr')?.classList.add('d-none');
    document.getElementById('err-order')?.classList.add('d-none');
  }

  doCreateSection(data: NgForm) {
    this.resetSFields();
    this.errorPanelMsg = '';
    this.isErrorPanel = false;

    if (this.doNewSecChecks(data)) {
      this.isOpSection = true;
      let obj: Partial<ISectionData> = {
        title: data.controls['title'].value,
        description: data.controls['description'].value,
        order_number: data.controls['order'].value,
        active: this.radioActive.nativeElement.checked ? true : false,
      };

      this.sectionOperationsSub = this.svc
        .createSection(obj)
        .pipe(
          catchError((err) => {
            this.isOpSection = false;
            this.errorPanelMsg = 'Errore nella creazione della sezione';
            this.isErrorPanel = true;
            return EMPTY;
          })
        )
        .subscribe((res) => {
          data.resetForm();
          setTimeout(() => {
            this.isOpSection = false;
            this.sectionCMod.nativeElement.classList.remove('opacity-0');
            setTimeout(() => {
              this.sectionCMod.nativeElement.classList.add('opacity-0');
            }, 3000);
          }, 1000);
        });
    }
  }

  resetSSFields() {
    document.getElementById('err-parent')?.classList.add('d-none');
    document.getElementById('err-ti')?.classList.add('d-none');
    document.getElementById('err-descr')?.classList.add('d-none');
    document.getElementById('err-order')?.classList.add('d-none');
  }

  doCreateSubSection(data: NgForm) {
    this.resetSSFields();
    this.errorPanelMsg = '';
    this.isErrorPanel = false;

    if (this.doNewSubSecChecks(data)) {
      this.isOpSection = true;
      let obj: Partial<ISubSectionData> = {
        title: data.controls['title'].value,
        description: data.controls['description'].value,
        order_number: data.controls['order'].value,
        active: this.radioActive.nativeElement.checked ? true : false,
        parent_section_id: this.newSubSectionParentId,
      };
      this.subSectionOperationsSub = this.svc
        .createSubSection(obj)
        .pipe(
          catchError((err) => {
            this.isOpSection = false;
            this.errorPanelMsg = 'Errore nella creazione della sotto-sezione';
            this.isErrorPanel = true;
            return EMPTY;
          })
        )
        .subscribe((res) => {
          data.resetForm();
          setTimeout(() => {
            this.isOpSection = false;
            this.subSectionCMod.nativeElement.classList.remove('opacity-0');
            setTimeout(() => {
              this.subSectionCMod.nativeElement.classList.add('opacity-0');
            }, 3000);
          }, 1000);
        });
    }
  }

  deleteSection(id: number) {
    for (let i = 0; i < this.collapseableSArr.length; i++) {
      this.collapseableSArr[i] = true;
    }

    this.sectionOperationsSub = this.svc
      .deleteSection(id)
      .pipe(
        catchError((err) => {
          throw err;
        })
      )
      .subscribe((res) => {
        console.log(res.message);
        this.getSections();
      });
  }

  deleteSubSection(id: number) {
    console.log(id);
    this.subSectionOperationsSub = this.svc
      .deleteSubSection(id)
      .pipe(
        catchError((err) => {
          throw err;
        })
      )
      .subscribe((res) => {
        console.log(res.message);
        this.selectedSSIndex = -1;
        for (let i = 0; i < this.collapseableSArr.length; i++) {
          this.collapseableSArr[i] = true;
        }
        this.getSections();
      });
  }

  openModal(update: boolean, index: number = 0, form?: NgForm) {
    if (!update) {
      const modal = this.modalSvc.open(ModalComponent, {
        size: 'l',
      });
      modal.componentInstance.title = this.blockTitle;
      modal.componentInstance.body = this.blockContent;
    } else {
      const modal = this.modalSvc.open(ModalComponent, {
        size: 'l',
      });
      modal.componentInstance.title = this.blocksTitleArr[index];
      modal.componentInstance.body = form!.controls['content'].value;
    }
  }

  resetBFields() {
    document.getElementById('err-ti')?.classList.add('d-none');
    document.getElementById('err-order')?.classList.add('d-none');
    document.getElementById('err-content')?.classList.add('d-none');
  }

  doBlockChecks(form: NgForm): boolean {
    let bool: boolean = true;

    let titleP: HTMLElement | null = document.getElementById('err-ti');
    let orderP: HTMLElement | null = document.getElementById('err-order');
    let contentP: HTMLElement | null = document.getElementById('err-content');

    if (this.blockTitle.length < 3) {
      bool = false;
      titleP!.classList.remove('d-none');
      titleP!.innerText = 'Min 3 chars';
    }

    if (this.blockContent.length < 1) {
      bool = false;
      contentP!.classList.remove('d-none');
      contentP!.innerText = 'Write something';
    }

    if (
      isNaN(Number(form.controls['order'].value)) ||
      form.controls['order'].value == null
    ) {
      bool = false;
      orderP!.classList.remove('d-none');
      orderP!.innerText = 'Invalid value';
    }

    return bool;
  }

  doCreateNewBlock(data: NgForm) {
    this.resetBFields();
    this.errorPanelMsg = '';
    this.isErrorPanel = false;

    if (this.doBlockChecks(data)) {
      this.isOpBlock = true;
      let obj: ISideBlockData = {
        title: this.blockTitle,
        content: this.blockContent,
        active: this.radioActive.nativeElement.checked ? true : false,
        e_block_type: this.blockType,
        order_number: data.controls['order'].value,
      };
      this.blockOperationsSub = this.svc
        .createBlock(obj)
        .pipe(
          catchError((err) => {
            this.isOpBlock = false;
            this.errorPanelMsg = 'Errore nella creazione del blocco.';
            this.isErrorPanel = true;
            return EMPTY;
          })
        )
        .subscribe((res) => {
          data.resetForm();
          setTimeout(() => {
            this.isOpBlock = true;
            this.blockMod.nativeElement.classList.remove('opacity-0');
            setTimeout(() => {
              this.blockMod.nativeElement.classList.add('opacity-0');
            }, 2000);
          }, 1000);
        });
    }
  }

  doUpdateBlockChecks(form: NgForm, index: number): boolean {
    let bool: boolean = true;

    let titleP: HTMLElement | null = document.getElementById('err-ti');
    let orderP: HTMLElement | null = document.getElementById('err-order');
    let contentP: HTMLElement | null = document.getElementById('err-content');

    if (this.blocksTitleArr[index].length < 3) {
      bool = false;
      titleP!.classList.remove('d-none');
      titleP!.innerText = 'Min 3 chars';
    }

    if (form.controls['content'].value.length < 1) {
      bool = false;
      contentP!.classList.remove('d-none');
      contentP!.innerText = 'Write something';
    }

    if (
      isNaN(Number(form.controls['order'].value)) ||
      form.controls['order'].value == null
    ) {
      bool = false;
      orderP!.classList.remove('d-none');
      orderP!.innerText = 'Invalid value';
    }

    return bool;
  }

  doUpdateBlock(data: NgForm, index: number) {
    this.resetBFields();
    if (this.doUpdateBlockChecks(data, index)) {
      this.isOpBlock = true;
      let obj: ISideBlockData = {
        id: this.blocksArr[index].id,
        title: data.controls['title'].value,
        content: data.controls['content'].value,
        active: this.activeBoolBArr[index] ? true : false,
        e_block_type: this.blocksTypeArr[index],
        order_number: data.controls['order'].value,
      };

      this.blockOperationsSub = this.svc
        .updateBlock(this.user_id!, obj)
        .pipe(
          catchError((err) => {
            this.isOpBlock = false;
            throw err;
          })
        )
        .subscribe((res) => {
          setTimeout(() => {
            this.isOpBlock = false;
            document
              .querySelector('#blockUParagMod' + index)
              ?.classList.remove('opacity-0');
            setTimeout(() => {
              document
                .querySelector('#blockUParagMod' + index)
                ?.classList.add('opacity-0');
              this.getBlocks();
            }, 2000);
          }, 1000);
        });
    }
  }
}
