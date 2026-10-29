import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import localeFrCa from '@angular/common/locales/fr-CA';
import { Calculator } from './calculator';

describe('Calculator', () => {
  let fixture: ComponentFixture<Calculator>;
  let http: HttpTestingController;
  let page: HTMLElement;

  beforeEach(async () => {
    registerLocaleData(localeFrCa);
    await TestBed.configureTestingModule({
      imports: [Calculator],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: LOCALE_ID, useValue: 'fr-CA' }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(Calculator);
    http = TestBed.inject(HttpTestingController);
    page = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  function saisir(id: string, valeur: string): void {
    const champ = page.querySelector<HTMLInputElement>(`#${id}`)!;
    champ.value = valeur;
    champ.dispatchEvent(new Event('input'));
    champ.dispatchEvent(new Event('blur'));
  }

  /** Coche le bouton radio de l'opération (son nom accessible : Addition, Division...) */
  function choisir(nom: string): void {
    page.querySelector<HTMLInputElement>(`input[type=radio][aria-label="${nom}"]`)!.click();
  }

  function calculer(): void {
    page.querySelector<HTMLButtonElement>('button.calculer')!.click();
    fixture.detectChanges();
  }

  it("n'envoie aucune requête si un nombre est absent ou invalide", () => {
    saisir('nombre1', 'abc');
    calculer();
    http.expectNone(() => true);
    expect(page.querySelectorAll('.erreur').length).toBe(2);
  });

  it("affiche le résultat renvoyé par l'API et l'ajoute à l'historique", () => {
    saisir('nombre1', '7');
    choisir('Division');
    saisir('nombre2', '2');
    calculer();
    http.expectOne('http://localhost:8080/calculator/divide/7/2').flush('3.5');
    fixture.detectChanges();
    expect(page.querySelector('.valeur')?.textContent).toContain('3,5');
    expect(page.querySelectorAll('tbody tr').length).toBe(1);
  });

  it('accepte une virgule décimale', () => {
    saisir('nombre1', '2,5');
    choisir('Multiplication');
    saisir('nombre2', '4');
    calculer();
    http.expectOne('http://localhost:8080/calculator/multiply/2.5/4').flush('10.0');
    fixture.detectChanges();
    expect(page.querySelector('.valeur')?.textContent).toContain('10');
  });

  it("explique l'erreur 400 d'une division par zéro", () => {
    saisir('nombre1', '5');
    choisir('Division');
    saisir('nombre2', '0');
    calculer();
    http
      .expectOne('http://localhost:8080/calculator/divide/5/0')
      .flush('Division by zero is not allowed', { status: 400, statusText: 'Bad Request' });
    fixture.detectChanges();
    expect(page.querySelector('.titre-erreur')?.textContent).toContain('Division par zéro');
    expect(page.querySelector('.badge.ko')?.textContent).toContain('400');
  });
});
