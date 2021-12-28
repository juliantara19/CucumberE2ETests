Feature: SprintPage

    Scenario: Create task with text from workdrawer
        Given User is logged in
        * User is on the sprint page
        When User enters '<text>' in the create tasks workdrawer
        Then System creates task with '<text>' in the workdrawer
        * User deletes created task with '<text>'
        

        Examples:
            | text |
            | Testing |
        
    Scenario: Drag task into sprint
        Given User is logged in
        * User is on the sprint page
        * A task has been created
        When User drags task into sprint
        Then System moves task into sprint