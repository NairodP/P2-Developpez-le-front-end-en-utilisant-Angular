import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from '../../core/models/Olympic';
import { Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import { Statistic } from 'src/app/core/models/Statistics';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<Olympic[]>;

  statistics: Statistic[] = [];

  // Highcharts
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  updateFlag = false;

  // Propriétés pour les totaux
  totalJOs: number = 0;
  totalCountries: number = 0;

  constructor(private olympicService: OlympicService, private router: Router) {
    this.olympics$ = this.olympicService.getOlympics();
  }

  ngOnInit(): void {
    this.olympics$.subscribe((olympics) => {
      if (olympics) {
        this.statistics = [
          {
            label: 'Number of JOs',
            value: olympics.reduce(
              (total, country) => total + country.participations.length,
              0
            )
          },
          {
            label: 'Number of countries',
            value: olympics.length
          }
        ];

        // Calcul des médailles par pays
        const medalsByCountry = this.olympicService.getTotalMedalsByCountry(olympics);
        

        this.chartOptions = {
          chart: {
            type: 'pie',
            style: {
              fontFamily: "Montserrat"
            },
            margin: [0, 0, 0, 0],      // Supprime les marges internes
          },
          title: {
            text: '',
          },
          credits: {
            enabled: false, // Désactive les crédits
          },
          tooltip: {
            useHTML: true,
            backgroundColor: '#26838e',
            shadow: false,
            borderRadius: 10,
            padding: 7,
            style: {
              textAlign: 'center',
              color: '#fff',
              fontSize: '14px',
            },
            formatter: function (this: Highcharts.Point) {
              return `
              <div style="text-align: center;">
                ${this.name}<br/>
                <img src="/assets/icons/ruban.png" alt="Medal" style="width: 15px; height: 15px; padding-top: 8px; margin: 0 -4px -2px 0;" />
                ${this.y} medals
              </div>`;
            },
          },
          plotOptions: {
            pie: {
              center: ['50%', '50%'],
              allowPointSelect: false,
              cursor: 'pointer',
              dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>',
                style: {
                  fontSize: '14px',
                },
              },
              borderWidth: 0,
              borderRadius: 0,
              innerSize: '0%',
              events: {
                click: (e) => {
                  const countryName = e.point?.name;
                  const olympics = this.olympics$;  // Récupère les données olympiques
                  olympics.subscribe((olympics) => {
                    const country = olympics.find(o => o.country === countryName);
                    if (country) {
                      this.router.navigate([`/detail/${country.id}`]);  // Correcte la route ici
                    }
                  });
                }
              }
            },
          },
          colors: ['#793D53', '#8AA1DC', '#9780A1', '#B8CBE7', '#956066'],
          series: [
            {
              name: 'Medals',
              colorByPoint: true,
              data: medalsByCountry.map((item) => ({
                name: item.country,
                y: isNaN(item.medals) ? 0 : item.medals,
              })),
            },
          ] as any,
        };

        this.updateFlag = true;
      }
    });
  }
}
