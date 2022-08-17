package br.com.jornada.cliente;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.containsString;

import org.apache.http.HttpStatus;
import org.junit.Before;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;

import io.restassured.RestAssured;


@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT )
class ClienteApplicationTests {
	
	@LocalServerPort
	private int port;
	
	@Before
	public void setUp() throws Exception {
		RestAssured.baseURI = "http://localhost:" + port;
	}

	@Test
	public void confereVersaoTest(){
		System.out.println("Base URI" + RestAssured.baseURI);
		System.out.println("Base PATH" + RestAssured.basePath);
		given()
				.get("http://localhost:5000/")
				.then()
				.statusCode(HttpStatus.SC_OK)
				.and()
				.body(containsString("cliente-V1"));
	}

}
