import { Component, computed, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Calculation, libelleStatut } from '../model/calculation';
import { symbole } from '../model/operation';

/** Titre et explication en français d'une réponse d'erreur */
export interface Explication {
  readonly titre: string;
  readonly detail: string;
}

export function expliquer(calcul: Calculation): Explication {
  if (calcul.status === 0) {
    return {
      titre: 'API injoignable',
      detail: 'Aucune réponse de localhost:8080. Démarrez calculator-api (gradlew bootRun), puis réessayez.'
    };
  }
  if (calcul.status === 400 && /zero/i.test(calcul.body)) {
    return {
      titre: 'Division par zéro impossible',
      detail: "L'API refuse de diviser par 0 et répond 400 Bad Request."
    };
  }
  if (calcul.status === 400) {
    return {
      titre: 'Requête refusée',
      detail: "L'API n'a pas pu traiter les nombres envoyés (400 Bad Request)."
    };
  }
  if (calcul.status === 200) {
    return {
      titre: 'Résultat hors limites',
      detail: "L'API a répondu, mais la valeur reçue n'est pas un nombre affichable."
    };
  }
  return { titre: `Erreur ${calcul.status}`, detail: "L'API a renvoyé une erreur inattendue." };
}

@Component({
  selector: 'app-calculation-result',
  imports: [DecimalPipe],
  templateUrl: './calculation-result.html',
  styleUrl: './calculation-result.css'
})
export class CalculationResult {
  /** Dernier calcul envoyé, ou null avant le premier envoi */
  readonly calcul = input<Calculation | null>(null);

  protected readonly etat = computed(() => {
    const calcul = this.calcul();
    if (!calcul) {
      return 'vide';
    }
    return calcul.result !== null ? 'succes' : 'echec';
  });

  protected readonly explication = computed(() => {
    const calcul = this.calcul();
    return calcul ? expliquer(calcul) : null;
  });

  protected readonly symbole = symbole;
  protected readonly statut = libelleStatut;

  protected nombre(texte: string): number {
    return Number(texte);
  }

  /** Chemin de la route sans l'adresse du serveur (ex. /calculator/divide/7/2) */
  protected chemin(url: string): string {
    return new URL(url).pathname;
  }
}
