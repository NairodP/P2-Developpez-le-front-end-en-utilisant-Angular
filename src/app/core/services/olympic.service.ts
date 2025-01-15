import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[]>([]);

  constructor(private http: HttpClient) {}

  loadInitialData(): Observable<Olympic[]> {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((olympics) => this.olympics$.next(olympics)),
      catchError((error) => {
        console.error('Error loading olympic data:', error);
        this.olympics$.next([]);
        throw error;
      })
    );
  }

  getOlympics(): Observable<Olympic[]> {
    return this.olympics$.asObservable();
  }

  getTotalMedalsByCountry(olympics: Olympic[]): { country: string; medals: number }[] {
    return olympics.map(olympic => ({
      country: olympic.country,
      medals: olympic.participations.reduce((total, p) => total + p.medalsCount, 0)
    }));
  }

  getCountryDetails(countryId: number): Observable<Olympic | undefined> {
    return this.olympics$.pipe(
      map(olympics => olympics.find(olympic => olympic.id === countryId))
    );
  }
}
