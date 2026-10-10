SELECT * FROM entreprises;
SELECT * FROM departements;
SELECT * FROM personnes;
SELECT * FROM employes;
SELECT * FROM contacts;
SELECT * FROM postes;

SELECT DISTINCT
  e.nom AS "entreprise",
  e.capital,
  d.nom AS "departement",
  pe.nom AS "nom",
  pe.prenom AS "prénom",
  c.mail,
  emp.salaire,
  po.nom AS "poste"
FROM entreprises e, departements d,
     personnes pe, employes emp, contacts c,
     postes po
WHERE e.id = d.entreprise_id
  AND e.id = emp.entreprise_id
  AND pe.id = emp.id
  AND pe.id = c.personne_id
  AND d.id = po.departement_id
  AND emp.poste_id = po.id;

UPDATE departements
SET responsable_id = (
  SELECT e.id
  FROM employes e
  INNER JOIN personnes p ON e.id = p.id
  WHERE p.nom = 'Dupont'
    AND p.prenom = 'Jean'
)
WHERE nom = 'Informatique';

SELECT * FROM departements;

UPDATE employes
SET salaire = 1.2 * salaire
WHERE employes.id IN (
  SELECT id
  FROM personnes
  WHERE nom = 'Dupont'
    AND prenom = 'Jean'
);

SELECT * FROM employes;