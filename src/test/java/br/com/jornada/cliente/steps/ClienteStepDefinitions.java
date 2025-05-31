package br.com.jornada.cliente.steps;

import br.com.jornada.cliente.domain.Cliente;
import br.com.jornada.cliente.domain.ClienteRepository;
import io.cucumber.java.Before;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.server.LocalServerPort;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;

public class ClienteStepDefinitions {

    @LocalServerPort
    private int port;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private TestContext testContext;

    @Before
    public void setup() {
        clienteRepository.deleteAll();
    }

    @When("I send a POST request to {string} with body:")
    public void i_send_a_post_request_to_with_body(String path, String body) {
        Response response = given()
            .baseUri("http://localhost:" + port)
            .contentType("application/json")
            .body(body)
            .when()
            .post(path);
        testContext.setResponse(response);
    }

    @When("I send a PUT request to {string} with body:")
    public void i_send_a_put_request_to_with_body(String path, String body) {
        Response response = given()
            .baseUri("http://localhost:" + port)
            .contentType("application/json")
            .body(body)
            .when()
            .put(path);
        testContext.setResponse(response);
    }

    @Then("the response should be an empty list")
    public void the_response_should_be_an_empty_list() {
        testContext.getResponse().then().body("size()", is(0));
    }

    @Then("the response should contain a client with name {string}")
    public void the_response_should_contain_a_client_with_name(String name) {
        testContext.getResponse().then().body("nome", equalTo(name));
    }

    @Then("the response should contain a client with age {int}")
    public void the_response_should_contain_a_client_with_age(Integer age) {
        testContext.getResponse().then().body("idade", equalTo(age));
    }

    @Given("a client exists with id {int}")
    public void a_client_exists_with_id(Integer id) {
        Cliente cliente = new Cliente(id.longValue(), "John Doe", 30);
        clienteRepository.save(cliente);
    }
}
