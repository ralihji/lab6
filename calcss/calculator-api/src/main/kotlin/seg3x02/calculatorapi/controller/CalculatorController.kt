package seg3x02.calculatorapi.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("calculator")
@Tag(name = "Calculator", description = "Opérations arithmétiques sur deux nombres")
class CalculatorController {

	@GetMapping("/add/{nombre1}/{nombre2}")
	@Operation(summary = "Addition", description = "Retourne nombre1 + nombre2")
	fun add(
		@Parameter(description = "Premier nombre", example = "2") @PathVariable nombre1: Double,
		@Parameter(description = "Deuxième nombre", example = "3") @PathVariable nombre2: Double
	) = nombre1 + nombre2

	@GetMapping("/subtract/{nombre1}/{nombre2}")
	@Operation(summary = "Soustraction", description = "Retourne nombre1 - nombre2")
	fun subtract(
		@Parameter(description = "Premier nombre", example = "10") @PathVariable nombre1: Double,
		@Parameter(description = "Deuxième nombre", example = "4") @PathVariable nombre2: Double
	) = nombre1 - nombre2

	@GetMapping("/multiply/{nombre1}/{nombre2}")
	@Operation(summary = "Multiplication", description = "Retourne nombre1 * nombre2")
	fun multiply(
		@Parameter(description = "Premier nombre", example = "2.5") @PathVariable nombre1: Double,
		@Parameter(description = "Deuxième nombre", example = "4") @PathVariable nombre2: Double
	) = nombre1 * nombre2

	@GetMapping("/divide/{nombre1}/{nombre2}")
	@Operation(
		summary = "Division",
		description = "Retourne nombre1 / nombre2. Une division par zéro renvoie 400 (Bad Request)."
	)
	fun divide(
		@Parameter(description = "Dividende", example = "7") @PathVariable nombre1: Double,
		@Parameter(description = "Diviseur (non nul)", example = "2") @PathVariable nombre2: Double
	): Double {
		if (nombre2 == 0.0) throw ArithmeticException("Division by zero is not allowed")
		return nombre1 / nombre2
	}
}
