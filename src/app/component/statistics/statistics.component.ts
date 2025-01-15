import { Component, Input } from '@angular/core';
import { Statistic } from 'src/app/core/models/Statistics';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
})
export class StatisticsComponent {
  @Input() title: string = ''; // Titre principal (ex. "Medals per country")
  @Input() statistics: Statistic[] = [];
}
