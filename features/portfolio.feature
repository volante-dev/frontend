Feature: Page Portfolio Studio Volante

  Background:
    Given je suis sur la page "/portfolio"

  Scenario: Visiteur voit le titre de la page portfolio
    Then je vois un titre contenant "projets"

  Scenario: La page portfolio se charge correctement
    Then la page répond avec un statut OK
