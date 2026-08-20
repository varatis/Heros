# Sources PDF des histoires

Déposer ici les PDF de référence des futures aventures à intégrer dans HeroBook.

## Convention de nommage

Utiliser de préférence un nom stable, lisible et sans accents :

```text
<slug-histoire>.pdf
```

Exemple :

```text
loup-solitaire-01-les-maitres-des-tenebres.pdf
```

## Processus d’intégration

1. Ajouter le PDF dans ce dossier ou le joindre à la session.
2. Indiquer le titre et, si nécessaire, les contraintes éditoriales particulières.
3. Le PDF servira de référence pour la structure, les embranchements, les objets et les fins.
4. Le contenu intégré en base devra rester une adaptation originale : ne pas recopier une traduction commerciale intégrale dans une migration SQL.
5. L’histoire sera ajoutée via une migration Supabase versionnée, avec ses nœuds, choix, effets et tests.

Les PDF source sont conservés hors de Git afin d’éviter de versionner des fichiers volumineux ou des œuvres protégées. Ils restent disponibles localement dans le workspace pour les sessions de travail.
