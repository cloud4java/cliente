Feature: Cliente Management API
  As an API user
  I want to manage client information
  So that I can create, read, update, and list clients

  Background:
    Given the API is running

  Scenario: Get all clients when none exist
    When I make a GET request to "/cliente"
    Then the response status code should be 200
    And the response should be an empty list

  Scenario: Create a new client
    When I send a POST request to "/cliente" with body:
      """
      {
        "id": 1,
        "nome": "John Doe",
        "idade": 30
      }
      """
    Then the response status code should be 200
    And the response should contain a client with name "John Doe"

  Scenario: Get client by ID
    Given a client exists with id 1
    When I make a GET request to "/cliente/1"
    Then the response status code should be 200
    And the response should contain a client with name "John Doe"

  Scenario: Get non-existent client
    When I make a GET request to "/cliente/999"
    Then the response status code should be 404

  Scenario: Update existing client
    Given a client exists with id 1
    When I send a PUT request to "/cliente/1" with body:
      """
      {
        "nome": "John Updated",
        "idade": 31
      }
      """
    Then the response status code should be 200
    And the response should contain a client with name "John Updated"
    And the response should contain a client with age 31

  Scenario: Update non-existent client
    When I send a PUT request to "/cliente/999" with body:
      """
      {
        "nome": "Non Existent",
        "idade": 25
      }
      """
    Then the response status code should be 404
