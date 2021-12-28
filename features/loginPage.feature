Feature: Login Page

    Scenario: I want to login
        Given I am on the login page
        When User enters a username '<username>' and password '<password>'
        Then System logs user in

    Examples:
        | username | password |
        | taratest@email.com  | testing  |