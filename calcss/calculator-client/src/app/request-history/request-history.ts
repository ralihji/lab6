import { Component, input, output } from '@angular/core';
import { Calculation, libelleStatut } from '../model/calculation';

@Component({
  selector: 'app-request-history',
  templateUrl: './request-history.html',
  styleUrl: './request-history.css'
})
export class RequestHistory {
  /** Requêtes envoyées, de la plus récente à la plus ancienne */
  readonly entrees = input.required<Calculation[]>();

  /** Demande au composant parent de vider l'historique */
  readonly effacer = output<void>();

  protected readonly statut = libelleStatut;
}
