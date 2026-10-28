package seg3x02.calculatorapi.controller

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class ControllerExceptionHandler {

	// Division par zéro : message explicite
	@ExceptionHandler
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	fun handleArithmeticException(ex: ArithmeticException): ResponseEntity<String> {
		return ResponseEntity.badRequest().body(ex.message ?: "Arithmetic error")
	}

	// Toute autre erreur (ex. /calculator/add/abc/2) : même traitement que dans le lab
	@ExceptionHandler
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	fun handleException(ex: Exception): ResponseEntity<String> {
		return ResponseEntity.badRequest().body("Unable to process request")
	}
}
