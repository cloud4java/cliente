package br.com.jornada.cliente.steps;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.cucumber.java.en.Then;
import io.restassured.RestAssured;
import io.cucumber.java.Before;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.beans.factory.annotation.Autowired;
import io.restassured.response.Response;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.containsString;
import static org.junit.Assert.assertEquals;

@io.cucumber.spring.CucumberContextConfiguration
@SpringBootTest(
    classes = br.com.jornada.cliente.ClienteApplication.class,
    webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT
)
public class VersionStepDefinitions {

    @LocalServerPort
    private int port;

    @Autowired
    private TestContext testContext;

    @Before
    public void setup() {
        testContext.reset();
    }

    @Given("the API is running")
    public void the_api_is_running() {
        RestAssured.baseURI = "http://localhost:" + port;
    }

    @When("I make a GET request to {string}")
    public void i_make_a_get_request_to(String path) {
        Response response = given()
            .when()
            .get(path);
        testContext.setResponse(response);
    }

    @Then("the response status code should be {int}")
    public void the_response_status_code_should_be(Integer expectedStatusCode) {
        assertEquals(expectedStatusCode.intValue(), testContext.getResponse().getStatusCode());
    }

    @Then("the response body should contain {string}")
    public void the_response_body_should_contain(String expectedContent) {
        testContext.getResponse().then().body(containsString(expectedContent));
    }
}
