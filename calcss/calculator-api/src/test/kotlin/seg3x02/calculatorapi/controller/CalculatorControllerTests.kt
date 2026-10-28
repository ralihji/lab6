package seg3x02.calculatorapi.controller

import org.junit.jupiter.api.Test
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import kotlin.test.assertEquals

class CalculatorControllerTests {

	private val mockMvc: MockMvc = MockMvcBuilders
		.standaloneSetup(CalculatorController())
		.setControllerAdvice(ControllerExceptionHandler())
		.build()

	private fun result(path: String): Double =
		mockMvc.get(path)
			.andExpect { status { isOk() } }
			.andReturn().response.contentAsString.toDouble()

	@Test
	fun add() {
		assertEquals(5.0, result("/calculator/add/2/3"))
	}

	@Test
	fun subtract() {
		assertEquals(6.0, result("/calculator/subtract/10/4"))
		assertEquals(-8.0, result("/calculator/subtract/-5/3"))
	}

	@Test
	fun multiply() {
		assertEquals(10.0, result("/calculator/multiply/2.5/4"))
	}

	@Test
	fun divide() {
		assertEquals(3.5, result("/calculator/divide/7/2"))
	}

	@Test
	fun divideByZeroReturnsBadRequest() {
		mockMvc.get("/calculator/divide/5/0").andExpect {
			status { isBadRequest() }
			content { string("Division by zero is not allowed") }
		}
	}

	@Test
	fun invalidNumberReturnsBadRequest() {
		mockMvc.get("/calculator/add/abc/2").andExpect {
			status { isBadRequest() }
			content { string("Unable to process request") }
		}
	}
}
