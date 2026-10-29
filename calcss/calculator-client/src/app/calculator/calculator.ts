import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiResponse, CalculatorService } from '../service/calculator-service';
import { Calculation } from '../model/calculation';
import { Operation, OPERATIONS } from '../model/operation';
import { CalculationResult } from '../calculation-result/calculation-result';
import { RequestHistory } from '../request-history/request-history';

/** Un nombre : signe facultatif, décimales avec un point ou une virgule (ex. -2,5) */
export const NOMBRE = /^[-+]?(\d+([.,]\d+)?|[.,]\d+)$/;

/** Nombre de requêtes gardées dans l'historique */
const TAILLE_HISTORIQUE = 8;

@Component({
  selector: 'app-calculator',
  imports: [ReactiveFormsModule, CalculationResult, RequestHistory],
  templateUrl: './calculator.html',
  styleUrl: './calculator.css'
})
export class Calculator {
  private readonly calculatorService = inject(CalculatorService);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly operations = OPERATIONS;

  protected readonly form = this.formBuilder.nonNullable.group({
    nombre1: ['', [Validators.required, Validators.pattern(NOMBRE)]],
    operation: ['add' as Operation],
    nombre2: ['', [Validators.required, Validators.pattern(NOMBRE)]]
  });

  /** Valeurs du formulaire sous forme de signal, pour l'aperçu de la requête */
  private readonly valeurs = toSignal(this.form.valueChanges, {
    initialValue: this.form.getRawValue()
  });

  /** Morceaux de l'URL qui sera appelée, mis à jour pendant la saisie */
  protected readonly apercu = computed(() => {
    const valeurs = this.valeurs();
    return {
      operation: valeurs.operation ?? 'add',
      nombre1: this.calculatorService.normaliser(valeurs.nombre1 ?? '') || '{nombre1}',
      nombre2: this.calculatorService.normaliser(valeurs.nombre2 ?? '') || '{nombre2}'
    };
  });

  protected readonly enCours = signal(false);
  protected readonly dernier = signal<Calculation | null>(null);
  protected readonly historique = signal<Calculation[]>([]);
  private compteur = 0;

  protected invalide(champ: 'nombre1' | 'nombre2'): boolean {
    const control = this.form.controls[champ];
    return control.invalid && control.touched;
  }

  protected messageErreur(champ: 'nombre1' | 'nombre2'): string {
    return this.form.controls[champ].hasError('required')
      ? 'Ce nombre est obligatoire.'
      : 'Entrez un nombre, par exemple 12, -3 ou 2,5.';
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { nombre1, operation, nombre2 } = this.form.getRawValue();
    const n1 = this.calculatorService.normaliser(nombre1);
    const n2 = this.calculatorService.normaliser(nombre2);
    const debut = performance.now();
    this.enCours.set(true);
    this.calculatorService.calculate(operation, n1, n2).subscribe({
      next: (response) => this.enregistrer(operation, n1, n2, response, debut),
      error: (error: ApiResponse) => this.enregistrer(operation, n1, n2, error, debut)
    });
  }

  protected effacerHistorique(): void {
    this.historique.set([]);
  }

  /** Garde la réponse de l'API pour la carte Résultat et pour l'historique */
  private enregistrer(
    operation: Operation,
    nombre1: string,
    nombre2: string,
    reponse: ApiResponse,
    debut: number
  ): void {
    const valeur = Number(reponse.body);
    const calcul: Calculation = {
      id: ++this.compteur,
      operation,
      nombre1,
      nombre2,
      url: this.calculatorService.url(operation, nombre1, nombre2),
      status: reponse.status,
      body: reponse.body,
      result: reponse.status === 200 && Number.isFinite(valeur) ? valeur : null,
      durationMs: Math.round(performance.now() - debut)
    };
    this.dernier.set(calcul);
    this.historique.update((liste) => [calcul, ...liste].slice(0, TAILLE_HISTORIQUE));
    this.enCours.set(false);
  }
}
