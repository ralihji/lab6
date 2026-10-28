package seg3x02.calculatorapi

import io.swagger.v3.oas.annotations.OpenAPIDefinition
import io.swagger.v3.oas.annotations.info.Info
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
@OpenAPIDefinition(
	info = Info(
		title = "Calculator API",
		version = "1.0",
		description = "Service Web REST de calculatrice (SEG3502 - Lab 6)"
	)
)
class CalculatorApiApplication

fun main(args: Array<String>) {
	runApplication<CalculatorApiApplication>(*args)
}
