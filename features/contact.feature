Feature: Page Contact Studio Volante

  Background:
    Given je suis sur la page "/contact"

  Scenario: Visiteur voit le formulaire de contact
    Then je vois le formulaire de contact

  Scenario: Visiteur soumet le formulaire vide
    When je clique sur "Envoyer le message"
    Then le formulaire reste visible (champs requis non remplis)

  Scenario: Visiteur remplit et soumet le formulaire
    When je remplis le champ "Prénom" avec "Marie"
    And je remplis le champ "Nom" avec "Dupont"
    And je remplis le champ "Email" avec "marie@exemple.fr"
    And je remplis le champ "Votre projet" avec "Refonte de notre identité visuelle"
    And je clique sur "Envoyer le message"
    Then je vois le message de confirmation
