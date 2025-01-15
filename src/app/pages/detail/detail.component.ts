import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from 'src/app/core/models/Olympic';
import * as Highcharts from 'highcharts';
import { Statistic } from 'src/app/core/models/Statistics';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  olympic: Olympic | undefined; // Détails du pays spécifique
  countryName: string | undefined;
  // totalNumberOfAtlete: number = 0; // Nombre total d'athlètes ayant participés'
  // totalMedals: number = 0; // Nombre total de medailles
  // numberOfEntries: number = 0; // Nombre de participations
  isLoading: boolean = true; // État de chargement
  error: string | undefined; // Message d'erreur

  statistics: Statistic[] = [];

  // Highcharts
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  updateFlag = false;

  constructor(
    private olympicService: OlympicService, // Service pour récupérer les données
    private router: Router, // Pour naviguer entre les pages
    private route: ActivatedRoute // Pour accéder aux paramètres d'URL
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    // Vérifiez si l'ID est présent et valide
    if (!idParam || isNaN(+idParam)) {
      // Redirection si l'ID est absent ou incorrect
      this.router.navigate(['/not-found']); // Ou une autre page d'erreur
      return;
    }

    const countryId = +idParam;

    this.olympicService.getCountryDetails(countryId).subscribe(
      (data) => {
        if (data) {
          this.olympic = data;
          this.countryName = data.country;

          // Préparer les statistiques pour le pays
          this.statistics = [
            {
              label: 'Number of entries',
              value: data.participations.length,
            },
            {
              label: 'Total number medals',
              value: data.participations.reduce(
                (sum, p) => sum + p.medalsCount,
                0
              ),
            },
            {
              label: 'Total number of athletes',
              value: data.participations.reduce(
                (sum, p) => sum + p.athleteCount,
                0
              ),
            },
          ];

          // Configuration du graphique Highcharts
          this.chartOptions = {
            chart: {
              type: 'line',
              style: {
                fontFamily: 'Montserrat',
              },
            },
            title: {
              text: '',
            },
            xAxis: {
              categories: data.participations.map((p) => p.year.toString()),
              title: {
                text: 'Year',
              },
            },
            yAxis: {
              title: {
                text: 'Number of medals',
              },
            },
            credits: {
              enabled: false,
            },
            tooltip: {
              useHTML: true,
              backgroundColor: '#956067',
              shadow: false,
              borderRadius: 10,
              padding: 7,
              style: {
                textAlign: 'center',
                color: '#fff',
                fontSize: '14px',
              },
              formatter: function () {
                return `
                  <div style="text-align: center;">
                    ${this.x + 1}<br/>
                    <img src="/assets/icons/ruban.png" alt="Medal" style="width: 15px; height: 15px; padding-top: 8px; margin: 0 -4px -2px 0;" />
                    ${this.y} medals
                  </div>`;
              },
            },
            series: [
              {
                name: this.countryName,
                data: data.participations.map((p) => p.medalsCount),
                color: '#956067',
              },
            ] as any,
          };

          this.updateFlag = true;
          this.isLoading = false;
        }
        else {
          this.router.navigate(['/not-found']);
        }
      },
      (error) => {
        this.error = 'Erreur lors du chargement des détails du pays';
        console.error('Error loading country details:', error);
        this.isLoading = false;
        this.router.navigate(['/not-found']);
      }
    );
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
