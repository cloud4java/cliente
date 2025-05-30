Feature: API Version Verification

  Scenario: Check API version
    Given the API is running
    When I make a GET request to "/"
    Then the response status code should be 200
    And the response body should contain "cliente-V1"
