import { Component, inject, OnInit } from '@angular/core';
import { Calculator } from './calculator/calculator';
import { API_URL, CalculatorService } from './service/calculator-service';

@Component({
  selector: 'app-root',
  imports: [Calculator],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly calculatorService = inject(CalculatorService);

  /** État de la connexion à l'API, affiché dans le bandeau */
  protected readonly status = this.calculatorService.status;

  /** Swagger UI généré par springdoc-openapi */
  protected readonly swaggerUrl = `${API_URL}/swagger-ui.html`;

  ngOnInit(): void {
    this.calculatorService.verifier();
  }
}
