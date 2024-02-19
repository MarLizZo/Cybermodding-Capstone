import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModerationService } from 'src/app/services/moderation.service';
import { OrangeButtonComponent } from 'src/app/components/orange-button/orange-button.component';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { EMPTY, Subscription, catchError } from 'rxjs';
import {
  NgbCarouselConfig,
  NgbCarouselModule,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-thread-stats',
  standalone: true,
  imports: [
    CommonModule,
    OrangeButtonComponent,
    NgChartsModule,
    NgbCarouselModule,
  ],
  templateUrl: './thread-stats.component.html',
  styleUrls: ['./thread-stats.component.scss'],
})
export class ThreadStatsComponent {
  constructor(private svc: ModerationService, carConfig: NgbCarouselConfig) {
    carConfig.interval = 0;
    carConfig.showNavigationIndicators = false;
  }

  threadSub!: Subscription;
  actualStat: number = 0;

  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [
      'Gennaio',
      'Febbraio',
      'Marzo',
      'Aprile',
      'Maggio',
      'Giugno',
      'Luglio',
      'Agosto',
      'Settembre',
      'Ottobre',
      'Novembre',
      'Dicembre',
    ],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        label: 'Creazione Threads',
        fill: true,
        tension: 0.4,
        borderColor: '#171717',
        backgroundColor: 'rgba(214, 118, 0, 0.3)',
      },
    ],
  };
  lineChartOptions: ChartOptions<'line'> = {
    responsive: false,
  };
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;
  selectedStatsYear = 0;

  ngOnInit() {
    this.getStatsInfo(2023);
  }

  ngOnDestroy() {
    if (this.threadSub) this.threadSub.unsubscribe();
  }

  getStatsInfo(year: number) {
    if (this.threadSub) this.threadSub.unsubscribe();
    this.selectedStatsYear = year;

    if (this.actualStat == 0) {
      this.threadSub = this.svc
        .getPostsPerYear(year)
        .pipe(
          catchError((err) => {
            return EMPTY;
          })
        )
        .subscribe((res) => {
          let dateArr: Date[] = res.map((date) => new Date(date));

          this.lineChartData.datasets[0].data = [
            dateArr.filter((el) => el.getMonth() == 0).length,
            dateArr.filter((el) => el.getMonth() == 1).length,
            dateArr.filter((el) => el.getMonth() == 2).length,
            dateArr.filter((el) => el.getMonth() == 3).length,
            dateArr.filter((el) => el.getMonth() == 4).length,
            dateArr.filter((el) => el.getMonth() == 5).length,
            dateArr.filter((el) => el.getMonth() == 6).length,
            dateArr.filter((el) => el.getMonth() == 7).length,
            dateArr.filter((el) => el.getMonth() == 8).length,
            dateArr.filter((el) => el.getMonth() == 9).length,
            dateArr.filter((el) => el.getMonth() == 10).length,
            dateArr.filter((el) => el.getMonth() == 11).length,
          ];
          this.lineChartData.datasets[0].label =
            'Creazione Threads Anno ' + year;
          this.chart.chart?.update();
        });
    } else if (this.actualStat == 1) {
      this.threadSub = this.svc
        .getCommentsPerYear(this.selectedStatsYear)
        .pipe(
          catchError((err) => {
            return EMPTY;
          })
        )
        .subscribe((res) => {
          let dateArr: Date[] = res.map((date) => new Date(date));

          this.lineChartData.datasets[0].data = [
            dateArr.filter((el) => el.getMonth() == 0).length,
            dateArr.filter((el) => el.getMonth() == 1).length,
            dateArr.filter((el) => el.getMonth() == 2).length,
            dateArr.filter((el) => el.getMonth() == 3).length,
            dateArr.filter((el) => el.getMonth() == 4).length,
            dateArr.filter((el) => el.getMonth() == 5).length,
            dateArr.filter((el) => el.getMonth() == 6).length,
            dateArr.filter((el) => el.getMonth() == 7).length,
            dateArr.filter((el) => el.getMonth() == 8).length,
            dateArr.filter((el) => el.getMonth() == 9).length,
            dateArr.filter((el) => el.getMonth() == 10).length,
            dateArr.filter((el) => el.getMonth() == 11).length,
          ];

          this.lineChartData.datasets[0].label = 'Commenti per Anno ' + year;
          this.chart.chart?.update();
        });
    }
  }

  setStat(type: number) {
    this.actualStat = type;
    this.selectedStatsYear = 2023;
    this.getStatsInfo(2023);
    this.getStatsInfo(2023);
  }
}
