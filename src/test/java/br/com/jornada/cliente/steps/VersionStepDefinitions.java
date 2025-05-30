package br.com.jornada.cliente.steps;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.cucumber.java.en.Then;
import io.restassured.RestAssured;
import io.restassured.response.Response;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.boot.test.context.SpringBootTest;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.containsString;
import static org.junit.Assert.assertEquals;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
public class VersionStepDefinitions {

    @LocalServerPort
    private int port;

    private Response response;

    @Given("the API is running")
    public void the_api_is_running() {
        RestAssured.baseURI = "http://localhost:" + port;
        // We can add a check here to ensure the API is responsive if needed
        // For now, we assume it's running as part of the SpringBootTest context
        System.out.println("API is assumed to be running at: " + RestAssured.baseURI);
    }

    @When("I make a GET request to {string}")
    public void i_make_a_get_request_to(String path) {
        response = given().get(path);
    }

    @Then("the response status code should be {int}")
    public void the_response_status_code_should_be(Integer statusCode) {
        assertEquals(statusCode.intValue(), response.getStatusCode());
    }

    @Then("the response body should contain {string}")
    public void the_response_body_should_contain(String content) {
        response.then().body(containsString(content));
    }
}
