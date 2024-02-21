import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModerationService } from 'src/app/services/moderation.service';
import { EMPTY, Subscription, catchError } from 'rxjs';
import { ISideBlockData } from 'src/app/interfaces/iside-block-data';
import { FormsModule, NgForm } from '@angular/forms';
import { OrangeButtonComponent } from '../../orange-button/orange-button.component';
import { InlineLoaderComponent } from '../../inline-loader/inline-loader.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../modal/modal.component';

@Component({
  selector: 'app-blocks',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    OrangeButtonComponent,
    InlineLoaderComponent,
    ModalComponent,
  ],
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.scss'],
})
export class BlocksComponent {
  constructor(private svc: ModerationService, private modalSvc: NgbModal) {}

  @Input() isCreateView: boolean = false;
  @Input() isAllView: boolean = false;
  previousAllView: boolean = false;
  @Input() user_id: number | undefined = 0;

  blockType: string = 'BLOCK_ALL';
  blockContent: string = '';
  blockTitle: string = '';
  blocksArr: ISideBlockData[] = [];
  blocksTitleArr: string[] = [];
  blocksTypeArr: string[] = [];
  selectedBlock: ISideBlockData | undefined;

  isLoadingBlocks: boolean = false;
  isError: boolean = false;
  errorMsg: string = '';
  isOpBlock: boolean = false;
  getBlocksSub!: Subscription;
  blockOperationsSub!: Subscription;
  @ViewChild('blockParagMod') blockMod!: ElementRef<HTMLElement>;
  @ViewChild('activeRadioOne')
  radioActive!: ElementRef<HTMLInputElement>;

  ngOnInit() {
    //
  }

  ngDoCheck() {
    if (this.previousAllView != this.isAllView) {
      this.previousAllView = this.isAllView;
      this.getBlocks();
    }
  }

  ngOnDestroy() {
    if (this.blockOperationsSub) this.blockOperationsSub.unsubscribe();
    if (this.getBlocksSub) this.getBlocksSub.unsubscribe();
  }

  getBlocks() {
    this.isLoadingBlocks = true;
    this.isError = false;
    this.errorMsg = '';
    this.selectedBlock = undefined;

    this.blocksTitleArr = [];
    this.blocksArr = [];
    if (this.getBlocksSub) this.getBlocksSub.unsubscribe();

    this.getBlocksSub = this.svc
      .getBlocks()
      .pipe(
        catchError((err) => {
          this.errorMsg = 'Errore nel caricamento dei blocchi';
          this.isError = true;
          this.isLoadingBlocks = false;
          return EMPTY;
        })
      )
      .subscribe((res) => {
        this.blocksArr = res;
        for (let i = 0; i < res.length; i++) {
          this.blocksTitleArr.push(res[i].title);
          this.blocksTypeArr.push(res[i].e_block_type.toString());
        }
        this.isLoadingBlocks = false;
      });
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
    this.errorMsg = '';
    this.isError = false;

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
            this.errorMsg = 'Errore nella creazione del blocco.';
            this.isError = true;
            return EMPTY;
          })
        )
        .subscribe((res) => {
          data.resetForm();
          setTimeout(() => {
            this.isOpBlock = false;
            this.blockMod.nativeElement.classList.remove('opacity-0');
            setTimeout(() => {
              this.blockMod.nativeElement.classList.add('opacity-0');
            }, 2000);
          }, 1000);
        });
    }
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

  resetSingleView() {
    this.selectedBlock = undefined;
  }

  doUpdateBlockChecks(form: NgForm): boolean {
    let bool: boolean = true;

    let titleP: HTMLElement | null = document.getElementById('err-ti');
    let orderP: HTMLElement | null = document.getElementById('err-order');
    let contentP: HTMLElement | null = document.getElementById('err-content');

    if (this.selectedBlock!.title.length < 3) {
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

  doUpdateBlock(data: NgForm) {
    this.resetBFields();
    if (this.doUpdateBlockChecks(data)) {
      this.isOpBlock = true;
      let obj: ISideBlockData = {
        id: this.selectedBlock!.id,
        title: data.controls['title'].value,
        content: data.controls['content'].value,
        active: this.selectedBlock!.active ? true : false,
        e_block_type: this.selectedBlock!.e_block_type,
        order_number: data.controls['order'].value,
      };

      this.blockOperationsSub = this.svc
        .updateBlock(this.user_id!, obj)
        .pipe(
          catchError((err) => {
            this.isOpBlock = false;
            return EMPTY;
          })
        )
        .subscribe((res) => {
          setTimeout(() => {
            this.isOpBlock = false;
            document
              .querySelector('#blockUParagMod')
              ?.classList.remove('opacity-0');
            setTimeout(() => {
              document
                .querySelector('#blockUParagMod')
                ?.classList.add('opacity-0');
              this.getBlocks();
            }, 2000);
          }, 1000);
        });
    }
  }
}
