/** Les quatre routes de l'API : GET calculator/{operation}/{nombre1}/{nombre2} */
export type Operation = 'add' | 'subtract' | 'multiply' | 'divide';

export interface OperationInfo {
  /** Segment de l'URL REST (ex. add) */
  readonly id: Operation;
  /** Symbole affiché sur le bouton */
  readonly symbole: string;
  /** Nom en français, lu par les lecteurs d'écran */
  readonly nom: string;
}

export const OPERATIONS: readonly OperationInfo[] = [
  { id: 'add', symbole: '+', nom: 'Addition' },
  { id: 'subtract', symbole: '−', nom: 'Soustraction' },
  { id: 'multiply', symbole: '×', nom: 'Multiplication' },
  { id: 'divide', symbole: '÷', nom: 'Division' }
];

export function symbole(operation: Operation): string {
  return OPERATIONS.find((op) => op.id === operation)?.symbole ?? '?';
}
