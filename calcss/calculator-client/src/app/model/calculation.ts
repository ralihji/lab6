import { Operation } from './operation';

/** Une requête envoyée à l'API REST et la réponse reçue */
export interface Calculation {
  readonly id: number;
  readonly operation: Operation;
  /** Valeurs placées dans l'URL (la virgule est déjà remplacée par un point) */
  readonly nombre1: string;
  readonly nombre2: string;
  /** URL complète de la requête GET */
  readonly url: string;
  /** Code HTTP : 200, 400, ou 0 quand l'API ne répond pas */
  readonly status: number;
  /** Corps brut de la réponse (ex. 3.5 ou Division by zero is not allowed) */
  readonly body: string;
  /** Résultat numérique si le statut est 200, sinon null */
  readonly result: number | null;
  /** Durée de l'aller-retour, en millisecondes */
  readonly durationMs: number;
}

/** Texte du badge de statut : 200 OK, 400 Bad Request, Hors ligne... */
export function libelleStatut(status: number): string {
  switch (status) {
    case 0:
      return 'Hors ligne';
    case 200:
      return '200 OK';
    case 400:
      return '400 Bad Request';
    default:
      return String(status);
  }
}
