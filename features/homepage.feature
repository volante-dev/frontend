Feature: Page d'accueil Studio Volante

  Background:
    Given je suis sur la page d'accueil

  Scenario: Visiteur voit le message principal
    Then je vois le titre principal du studio

  Scenario: Visiteur consulte les services depuis l'accueil
    When je fais défiler jusqu'à la section services
    Then je vois au moins 1 service affiché

  Scenario: Visiteur navigue vers le portfolio
    When je clique sur "Voir nos projets"
    Then je suis sur la page "/portfolio"

  Scenario: Visiteur navigue vers la page contact
    When je clique sur "Travailler ensemble"
    Then je suis sur la page "/contact"
