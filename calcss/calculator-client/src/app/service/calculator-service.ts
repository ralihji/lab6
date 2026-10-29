import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Operation } from '../model/operation';

/** Adresse de l'API Spring Boot (calcss/calculator-api) */
export const API_URL = 'http://localhost:8080';
const baseUrl = `${API_URL}/calculator`;

/** Réponse HTTP réduite à ce que l'interface affiche */
export interface ApiResponse {
  readonly status: number;
  readonly body: string;
}

export type ApiStatus = 'inconnu' | 'en-ligne' | 'hors-ligne';

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {
  private httpClient: HttpClient = inject(HttpClient);

  /** État de la connexion à l'API, affiché dans le bandeau */
  readonly status = signal<ApiStatus>('inconnu');

  /** "2,5" devient "2.5" : l'API attend un point décimal */
  normaliser(valeur: string): string {
    return valeur.trim().replace(',', '.');
  }

  /** URL de la route GET calculator/{operation}/{nombre1}/{nombre2} */
  url(operation: Operation, nombre1: string, nombre2: string): string {
    return `${baseUrl}/${operation}/${encodeURIComponent(nombre1)}/${encodeURIComponent(nombre2)}`;
  }

  public add(nombre1: string, nombre2: string): Observable<ApiResponse> {
    return this.calculate('add', nombre1, nombre2);
  }

  public subtract(nombre1: string, nombre2: string): Observable<ApiResponse> {
    return this.calculate('subtract', nombre1, nombre2);
  }

  public multiply(nombre1: string, nombre2: string): Observable<ApiResponse> {
    return this.calculate('multiply', nombre1, nombre2);
  }

  public divide(nombre1: string, nombre2: string): Observable<ApiResponse> {
    return this.calculate('divide', nombre1, nombre2);
  }

  /**
   * Envoie la requête GET et renvoie le code HTTP et le corps de la réponse.
   * Le corps est lu en texte pour afficher exactement ce que l'API renvoie (ex. 5.0).
   */
  public calculate(operation: Operation, nombre1: string, nombre2: string): Observable<ApiResponse> {
    return this.httpClient
      .get(this.url(operation, nombre1, nombre2), { observe: 'response', responseType: 'text' })
      .pipe(
        map((response: HttpResponse<string>) => {
          this.status.set('en-ligne');
          return { status: response.status, body: response.body ?? '' };
        }),
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  /** Requête discrète au démarrage pour savoir si l'API répond */
  verifier(): void {
    this.add('0', '0').subscribe({ error: () => undefined });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    // Statut 0 : aucune réponse (API arrêtée ou requête bloquée par CORS)
    this.status.set(error.status === 0 ? 'hors-ligne' : 'en-ligne');
    const body = typeof error.error === 'string' ? error.error : '';
    return throwError(() => ({ status: error.status, body }) as ApiResponse);
  }
}
