import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModerationService } from 'src/app/services/moderation.service';
import { OrangeButtonComponent } from '../../orange-button/orange-button.component';
import { InlineLoaderComponent } from '../../inline-loader/inline-loader.component';
import { FormsModule, NgForm } from '@angular/forms';
import { EMPTY, Subscription, catchError } from 'rxjs';
import { ISectionData } from 'src/app/interfaces/isection-data';
import { ISubSectionData } from 'src/app/interfaces/isub-section-data';

@Component({
  selector: 'app-sections',
  standalone: true,
  imports: [
    CommonModule,
    OrangeButtonComponent,
    InlineLoaderComponent,
    FormsModule,
  ],
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.scss'],
})
export class SectionsComponent {
  constructor(private svc: ModerationService) {}

  @Input() isCreateSectionView: boolean = true;
  @Input() isCreateSubSectionView: boolean = false;
  previousCreateSubSectionView: boolean = false;
  @Input() isAllView: boolean = false;
  previousAllView: boolean = false;
  @Input() user_id: number | undefined = 0;

  sectionsArr: ISectionData[] = [];
  sectionsTitleArr: string[] = [];
  selectedSection: ISectionData | undefined;
  selectedSSIndex: number = -1;
  newSubSectionParentId: number = -1;

  isOpSection: boolean = false;
  isError: boolean = false;
  errorMsg: string = '';
  isErrorSS: boolean = false;
  errorSSMsg: string = '';
  isLoadingSections: boolean = false;
  getSectionSub!: Subscription;
  createSub!: Subscription;
  createSubSub!: Subscription;
  sectionOpSub!: Subscription;
  subSectionOpSub!: Subscription;

  @ViewChild('activeRadioOne') radioActive!: ElementRef<HTMLInputElement>;
  @ViewChild('activeSSRadioOne') radioSSActive!: ElementRef<HTMLInputElement>;
  @ViewChild('sectionCParagMod') sectionCMod!: ElementRef<HTMLElement>;
  @ViewChild('subsectionCParagMod') subSectionCMod!: ElementRef<HTMLElement>;

  ngOnInit() {
    //
  }

  ngDoCheck() {
    if (this.previousAllView != this.isAllView) {
      this.previousAllView = this.isAllView;
      this.getSections();
    }
    if (this.previousCreateSubSectionView != this.isCreateSubSectionView) {
      this.previousCreateSubSectionView = this.isCreateSubSectionView;
      this.getSections();
    }
  }

  ngOnDestroy() {
    if (this.createSub) this.createSub.unsubscribe();
    if (this.getSectionSub) this.getSectionSub.unsubscribe();
    if (this.createSubSub) this.createSubSub.unsubscribe();
    if (this.sectionOpSub) this.sectionOpSub.unsubscribe();
    if (this.subSectionOpSub) this.subSectionOpSub.unsubscribe();
  }

  getSections() {
    this.errorMsg = '';
    this.isError = false;
    this.isLoadingSections = true;
    this.selectedSection = undefined;
    this.selectedSSIndex = -1;

    this.sectionsTitleArr = [];
    this.sectionsArr = [];
    this.getSectionSub = this.svc
      .getSections()
      .pipe(
        catchError((err) => {
          this.errorMsg = 'Errore nel caricamento delle sezioni.';
          this.isError = true;
          this.isLoadingSections = false;
          return EMPTY;
        })
      )
      .subscribe((res) => {
        this.sectionsArr = res;
        for (let i = 0; i < this.sectionsArr.length; i++) {
          this.sectionsTitleArr.push(res[i].title);
        }
        this.isLoadingSections = false;
      });
  }

  doSectionsCheck(form: NgForm): boolean {
    let bool: boolean = true;

    let titleP: HTMLElement | null = document.getElementById('err-ti-');
    let descriptionP: HTMLElement | null =
      document.getElementById('err-descr-');
    let orderP: HTMLElement | null = document.getElementById('err-order-');

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

  resetSingleSectionView() {
    this.selectedSection = undefined;
  }

  setSingleSectionView(sec: ISectionData) {
    this.selectedSection = sec;
  }

  doSectionUpdate(data: NgForm) {
    if (this.doSectionsCheck(data)) {
      this.isOpSection = true;
      let obj: ISectionData = {
        id: data.controls['id'].value,
        title: data.controls['title'].value,
        description: data.controls['description'].value,
        active: this.selectedSection!.active,
        order_number: data.controls['order'].value,
      };

      this.sectionOpSub = this.svc
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
              .querySelector('#sectionUParagMod')
              ?.classList.remove('opacity-0');
            setTimeout(() => {
              document
                .querySelector('#sectionUParagMod')
                ?.classList.add('opacity-0');
              // this.selectedSSIndex = -1;
              this.resetSingleSectionView();
              this.getSections();
            }, 2000);
          }, 1000);
        });
    }
  }

  doSubSectionsCheck(form: NgForm): boolean {
    let bool: boolean = true;

    let titleP: HTMLElement | null = document.getElementById('err-ssti');
    let descriptionP: HTMLElement | null =
      document.getElementById('err-ssdescr');
    let orderP: HTMLElement | null = document.getElementById('err-ssorder');

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
    if (this.doSubSectionsCheck(data)) {
      this.isOpSection = true;
      let obj: Partial<ISubSectionData> = {
        id: data.controls['ssid'].value,
        title: data.controls['sstitle'].value,
        description: data.controls['ssdescription'].value,
        active: this.radioSSActive.nativeElement.checked ? true : false,
        order_number: data.controls['ssorder'].value,
        parent_id: parent_section_id,
      };

      this.subSectionOpSub = this.svc
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
              .querySelector('#subsectionUParagMod')
              ?.classList.remove('opacity-0');
            setTimeout(() => {
              document
                .querySelector('#subsectionUParagMod')
                ?.classList.add('opacity-0');
              this.getSections();
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
    this.errorMsg = '';
    this.isError = false;

    if (this.doNewSecChecks(data)) {
      this.isOpSection = true;
      let obj: Partial<ISectionData> = {
        title: data.controls['title'].value,
        description: data.controls['description'].value,
        order_number: data.controls['order'].value,
        active: this.radioActive.nativeElement.checked ? true : false,
      };

      this.sectionOpSub = this.svc
        .createSection(obj)
        .pipe(
          catchError((err) => {
            this.isOpSection = false;
            this.errorMsg = 'Errore nella creazione della sezione';
            this.isError = true;
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
    this.errorMsg = '';
    this.isError = false;

    if (this.doNewSubSecChecks(data)) {
      this.isOpSection = true;
      let obj: Partial<ISubSectionData> = {
        title: data.controls['title'].value,
        description: data.controls['description'].value,
        order_number: data.controls['order'].value,
        active: this.radioActive.nativeElement.checked ? true : false,
        parent_section_id: this.newSubSectionParentId,
      };
      this.subSectionOpSub = this.svc
        .createSubSection(obj)
        .pipe(
          catchError((err) => {
            this.isOpSection = false;
            this.errorSSMsg = 'Errore nella creazione della sotto-sezione';
            this.isErrorSS = true;
            return EMPTY;
          })
        )
        .subscribe((res) => {
          if (res.response?.ok) {
            setTimeout(() => {
              this.isOpSection = false;
              this.subSectionCMod.nativeElement.classList.remove('opacity-0');
              setTimeout(() => {
                this.subSectionCMod.nativeElement.classList.add('opacity-0');
              }, 3000);
            }, 1000);
          } else {
            this.isOpSection = false;
            this.errorSSMsg = res.response!.message;
            this.isErrorSS = true;
          }
          data.resetForm();
        });
    }
  }

  deleteSection(id: number) {
    this.sectionOpSub = this.svc
      .deleteSection(id)
      .pipe(
        catchError((err) => {
          throw err;
        })
      )
      .subscribe((res) => {
        console.log(res.message);
        this.resetSingleSectionView();
        this.getSections();
      });
  }

  deleteSubSection(id: number) {
    this.subSectionOpSub = this.svc
      .deleteSubSection(id)
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
}
