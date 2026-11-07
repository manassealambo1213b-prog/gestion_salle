const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// On met let pour pouvoir modifier le statut
let salles = [
  { id: 1, nom: "Salle Machine", capacite: 50, type: "Labo Info", batiment: "Bloc Info", equipements: ["PC", "Projecteur"], statut: "Disponible" },
  { id: 2, nom: "Auditoire L1", capacite: 120, type: "Amphi", batiment: "Bloc Principal", equipements: ["Sono", "Micro"], statut: "Occupé" },
  { id: 3, nom: "Salle Bibliothèque Électronique", capacite: 40, type: "Bibliothèque", batiment: "Bibliothèque", equipements: ["PC", "Internet"], statut: "Disponible" }
];

app.get('/api/salles', (req, res) => {
  res.json(salles);
});

// NOUVELLE ROUTE IA - RESERVATION
app.post('/api/reserver/:id', (req, res) => {
  const id = parseInt(req.params.id);
  salles = salles.map(s => {
    if (s.id === id) {
      return { ...s, statut: s.statut === 'Disponible' ? 'Occupé' : 'Disponible' };
    }
    return s;
  });
  const salleModifiee = salles.find(s => s.id === id);
  res.json({ message: `Salle ${salleModifiee.nom} maintenant ${salleModifiee.statut}`, salles });
});

app.listen(PORT, () => {
  console.log(`Backend UWB sur http://localhost:${PORT}`);
});