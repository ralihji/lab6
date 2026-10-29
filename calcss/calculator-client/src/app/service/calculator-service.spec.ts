import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Observable } from 'rxjs';
import { ApiResponse, CalculatorService } from './calculator-service';

describe('CalculatorService', () => {
  let service: CalculatorService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(CalculatorService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('appelle GET calculator/{operation}/{nombre1}/{nombre2} pour les 4 opérations', () => {
    const appels: [Observable<ApiResponse>, string, string][] = [
      [service.add('2', '3'), 'add/2/3', '5.0'],
      [service.subtract('10', '4'), 'subtract/10/4', '6.0'],
      [service.multiply('2.5', '4'), 'multiply/2.5/4', '10.0'],
      [service.divide('7', '2'), 'divide/7/2', '3.5']
    ];
    for (const [appel, route, corps] of appels) {
      let reponse: ApiResponse | undefined;
      appel.subscribe((r) => (reponse = r));
      const requete = http.expectOne(`http://localhost:8080/calculator/${route}`);
      expect(requete.request.method).toBe('GET');
      requete.flush(corps);
      expect(reponse).toEqual({ status: 200, body: corps });
    }
    expect(service.status()).toBe('en-ligne');
  });

  it("transmet le message de l'API pour une division par zéro (400)", () => {
    let erreur: ApiResponse | undefined;
    service.divide('5', '0').subscribe({ error: (e: ApiResponse) => (erreur = e) });
    http
      .expectOne('http://localhost:8080/calculator/divide/5/0')
      .flush('Division by zero is not allowed', { status: 400, statusText: 'Bad Request' });
    expect(erreur).toEqual({ status: 400, body: 'Division by zero is not allowed' });
  });

  it("signale une API injoignable avec le statut 0", () => {
    let erreur: ApiResponse | undefined;
    service.add('1', '1').subscribe({ error: (e: ApiResponse) => (erreur = e) });
    http.expectOne('http://localhost:8080/calculator/add/1/1').error(new ProgressEvent('error'));
    expect(erreur?.status).toBe(0);
    expect(service.status()).toBe('hors-ligne');
  });

  it('remplace la virgule décimale par un point', () => {
    expect(service.normaliser(' 2,5 ')).toBe('2.5');
    expect(service.normaliser('-3')).toBe('-3');
  });
});
