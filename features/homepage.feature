Feature: Page d'accueil Studio Volante

  Background:
    Given je suis sur la page d'accueil

  Scenario: Visiteur voit le message principal
    Then je vois le titre principal du studio

  Scenario: Visiteur consulte les services depuis l'accueil
    When je fais défiler jusqu'à la section services
    Then je vois au moins 1 service affiché

  Scenario: Visiteur passe de la vidéo au contenu avec un scroll contrôlé
    When je scrolle vers le bas depuis la vidéo d'accueil
    Then la section principale de l'accueil est alignée en haut de l'écran
    When je scrolle librement plus bas dans la page
    Then la page descend sous la section principale de l'accueil
    When je remonte jusqu'à la limite de la section principale de l'accueil
    And je scrolle vers le haut depuis cette limite
    Then je reviens sur la vidéo d'accueil

  Scenario: Visiteur navigue vers le portfolio
    When je clique sur "Voir nos projets"
    Then je suis sur la page "/portfolio"

  Scenario: Visiteur navigue vers la page contact
    When je marque le header courant
    And je clique sur "Travailler ensemble"
    Then je suis sur la page "/contact"
    And le même header est resté monté
    And le header est exclu du fade de page
    And une View Transition a été déclenchée

  Scenario: Visiteur change la langue sans recharger le header
    When je marque le header courant
    And je passe le site en anglais
    Then je suis sur la page "/en"
    And le même header est resté monté
    And le sélecteur de langue affiche "EN"
    And le contenu principal est affiché en anglais
    And la langue du document est "en"
    When je repasse le site en français
    Then je suis sur la page "/"
    And le même header est resté monté
    And le contenu principal est affiché en français
    And la langue du document est "fr"

  Scenario: Une URL anglaise reste anglaise après un rechargement
    Given j'ouvre la page "/en"
    Then le contenu principal est affiché en anglais
    When je recharge la page
    Then le contenu principal est affiché en anglais
    And la langue du document est "en"

  Scenario: Un ancien cookie anglais ne modifie pas une URL française
    When j'enregistre une ancienne préférence anglaise et je recharge
    Then le contenu principal est affiché en français
    And la langue du document est "fr"
