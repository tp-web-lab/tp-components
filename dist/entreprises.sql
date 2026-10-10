CREATE TABLE IF NOT EXISTS entreprises (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  nom varchar(20),
  capital float DEFAULT 0
);
CREATE TABLE IF NOT EXISTS departements (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  nom varchar(20),
  entreprise_id INTEGER,
  responsable_id INTEGER,
  FOREIGN KEY (entreprise_id) REFERENCES entreprises,
  FOREIGN KEY (responsable_id) REFERENCES employes
  );
CREATE TABLE IF NOT EXISTS personnes (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  nom varchar(20),
  prenom varchar(20)
  );
CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  mail varchar(30),
  personne_id INTEGER,
  FOREIGN KEY (personne_id) REFERENCES personnes
  );
CREATE TABLE IF NOT EXISTS employes (
  id INTEGER NOT NULL PRIMARY KEY,
  salaire SMALLINT,
  entreprise_id INTEGER,
  poste_id INTEGER,
  chef_id  INTEGER,
  FOREIGN KEY (id) REFERENCES personnes,
  FOREIGN KEY (entreprise_id) REFERENCES entreprises,
  FOREIGN KEY (poste_id) REFERENCES postes,
  FOREIGN KEY (chef_id) REFERENCES personnes
);
CREATE TABLE IF NOT EXISTS postes (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  nom varchar(20),
  departement_id  INTEGER,
  FOREIGN KEY (departement_id) REFERENCES departements
);

INSERT INTO entreprises(nom) VALUES ('ENIB');
INSERT INTO departements(nom,entreprise_id,responsable_id)
VALUES ('Informatique',(SELECT id FROM entreprises WHERE nom='ENIB'),NULL);
INSERT INTO departements(nom,entreprise_id,responsable_id)
VALUES ('Electronique',(SELECT id FROM entreprises WHERE nom='ENIB'),NULL);
INSERT INTO personnes(nom,prenom) VALUES ('Dupont','Jean');
INSERT INTO personnes(nom,prenom) VALUES ('Durand','Albert');
INSERT INTO personnes(nom,prenom) VALUES ('Dupond','Alfred');
INSERT INTO contacts(mail,personne_id)
VALUES ('jean.dupont@enib.fr',(SELECT id FROM personnes WHERE nom='Dupont' AND prenom='Jean'));
INSERT INTO contacts(mail,personne_id)
VALUES ('jean.dupont@gmail.com',(SELECT id FROM personnes WHERE nom='Dupont' AND prenom='Jean'));
INSERT INTO contacts(mail,personne_id)
VALUES ('albert.durand@enib.fr',(SELECT id FROM personnes WHERE nom='Durand' AND prenom='Albert'));
INSERT INTO employes(id,salaire,entreprise_id,poste_id,chef_id)
VALUES (
  (SELECT id FROM personnes WHERE nom='Dupont' AND prenom='Jean'),
  30000,
  (SELECT id FROM entreprises WHERE nom='ENIB'),
  NULL,
  NULL
);
INSERT INTO employes(id,salaire,entreprise_id,poste_id,chef_id)
VALUES (
  (SELECT id FROM personnes WHERE nom='Durand' AND prenom='Albert'),
  60000,
  (SELECT id FROM entreprises WHERE nom='ENIB'),
  NULL,
  NULL
);
INSERT INTO postes(nom,departement_id) VALUES ('MdC',(SELECT id FROM departements WHERE nom='Informatique'));
UPDATE employes SET poste_id=(SELECT id FROM postes WHERE nom='MdC') WHERE  id=1;
INSERT INTO postes(nom,departement_id) VALUES ('PRAG',(SELECT id FROM departements WHERE nom='Electronique'));
INSERT INTO postes(nom,departement_id) VALUES ('PU',(SELECT id FROM departements WHERE nom='Electronique'));