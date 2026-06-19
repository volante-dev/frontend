Feature: Transitions entre les pages publiques

  Scenario: Un chargement initial de l'accueil conserve l'introduction
    Given j'ouvre la page "/"
    Then l'animation d'introduction se joue

  Scenario: Une navigation client vers l'accueil ne rejoue pas l'introduction
    Given j'ouvre la page "/contact"
    When je clique sur "STUDIO VOLANTE"
    Then je suis sur la page "/"
    And l'animation d'introduction ne se joue pas
