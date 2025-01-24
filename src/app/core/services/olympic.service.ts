import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic'; // Pas encore ajouté donc en erreur mais ajout proche

@Injectable({
  providedIn: 'root', // Disponible dans toute l'application
})
export class OlympicService {
  // URL du fichier JSON contenant les données olympiques
  private olympicUrl = './assets/mock/olympic.json';
  
  // Observable qui stocke et émet la liste des données olympiques
  private olympics$ = new BehaviorSubject<Olympic[]>([]);

  constructor(private http: HttpClient) {}

  // Méthode pour charger initialement les données depuis le fichier JSON
  loadInitialData(): Observable<Olympic[]> {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      // Met à jour l'observable avec les données chargées
      tap((olympics) => this.olympics$.next(olympics)),
      // Gère les erreurs de chargement
      catchError((error) => {
        console.error('Error loading olympic data:', error);
        // En cas d'erreur, initialise l'observable avec un tableau vide
        this.olympics$.next([]);
        throw error;
      })
    );
  }

  // Getter qui expose l'observable des données olympiques
  getOlympics(): Observable<Olympic[]> {
    return this.olympics$.asObservable();
  }

  // Calcule le nombre total de médailles par pays
  getTotalMedalsByCountry(olympics: Olympic[]): { country: string; medals: number }[] {
    return olympics.map(olympic => ({
      country: olympic.country,
      // Somme des médailles pour toutes les participations du pays
      medals: olympic.participations.reduce((total, p) => total + (p.medalsCount || 0), 0)
    }));
  }

  // Récupère les détails d'un pays spécifique par son ID
  getCountryDetails(countryId: number): Observable<Olympic | undefined> {
    return this.olympics$.pipe(
      // Trouve le pays correspondant à l'ID dans la liste des olympiques
      map(olympics => olympics.find(olympic => olympic.id === countryId))
    );
  }
}

// oral pres : Service qui gère les données olympiques dans l'appli. Il a principalement quatre responsabilités :

// 1. Charger les données initiales depuis un fichier JSON
// 2. Fournir un accès observable à ces données
// 3. Calculer le nombre total de médailles par pays
// 4. Permettre de récupérer les détails d'un pays spécifique

// Il utilise RxJS pour gérer de manière réactive les données et charge les informations une seule fois et les stocke dans un BehaviorSubject, ce qui permet de les partager facilement entre différents composants de l'application."
// Les points clés à retenir sont :
// Utilisation de RxJS pour la gestion des données
// Chargement unique des données
// Gestion des erreurs
// Méthodes utilitaires pour manipuler les données olympiques