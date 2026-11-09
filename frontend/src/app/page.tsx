"use client";
import { useState, useEffect } from 'react';

export default function Home() {
  const [salles, setSalles] = useState<any[]>([]);
  const [nbEtudiants, setNbEtudiants] = useState(45);

  const chargerSalles = () => {
    fetch('http://localhost:5000/api/salles')
      .then(res => res.json())
      .then(data => setSalles(data));
  };

  useEffect(() => { chargerSalles(); }, []);

  const reserver = async (id: number) => {
    const res = await fetch(`http://localhost:5000/api/reserver/${id}`, { method: 'POST' });
    const data = await res.json();
    setSalles(data.salles);
  };

  const recommanderSalle = (nb: number) => {
    if (salles.length === 0) return "Chargement IA...";
    const possible = salles.filter(s => s.capacite >= nb && s.statut === 'Disponible').sort((a,b) => a.capacite - b.capacite);
    if (possible.length === 0) return `Aucune salle DISPONIBLE pour ${nb} etudiants`;
    const best = possible[0];
    return `${best.nom} (${best.capacite} places) - Taux: ${Math.round((nb/best.capacite)*100)}%`;
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        {/* HEADER UWB */}
        <div className="bg-white p-4 rounded shadow flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-900 text-white flex items-center justify-center rounded-full font-bold text-xl">UWB</div>
            <div>
              <h1 className="text-2xl font-bold text-blue-900 leading-none">Université William Booth</h1>
              <p className="text-sm text-gray-500">Kinshasa - RDC | Sciences Informatiques & IA</p>
            </div>
          </div>
          <button onClick={() => window.print()} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-bold text-sm">
            📄 Export PDF
          </button>
        </div>

        <p className="text-gray-600 mb-6">Gestion Intelligente des Salles - Projet TFC - Manassé - B3 Info & IA</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {salles.map((salle) => {
            const isDispo = salle.statut === 'Disponible';
            return (
              <div key={salle.id} className="bg-white p-4 rounded shadow">
                <h3 className="font-bold">{salle.nom}</h3>
                <p className="text-sm text-gray-500">{salle.batiment}</p>
                <p className="mt-1">{salle.capacite} places</p>
                <p className={isDispo ? 'mt-2 text-sm px-2 py-1 rounded bg-green-100 text-green-700 inline-block' : 'mt-2 text-sm px-2 py-1 rounded bg-red-100 text-red-700 inline-block'}>
                  {salle.statut}
                </p>
                <button
                  onClick={() => reserver(salle.id)}
                  className={isDispo ? 'mt-3 w-full py-2 rounded bg-blue-600 text-white hover:bg-blue-700' : 'mt-3 w-full py-2 rounded bg-gray-400 text-white hover:bg-gray-500'}
                >
                  {isDispo ? 'Réserver' : 'Libérer'}
                </button>
              </div>
            );
          })}
        </div>

        <div className="bg-white p-6 rounded shadow border-l-4 border-blue-600">
          <h3 className="font-bold mb-4">🤖 Module IA - Recommandation (Salles Libres Uniquement)</h3>
          <div className="flex gap-2 items-center mb-3">
            <label>Nb etudiants:</label>
            <input type="number" value={nbEtudiants} onChange={(e) => setNbEtudiants(parseInt(e.target.value) || 0)} className="border p-2 rounded w-24" />
          </div>
          <div className="p-3 bg-blue-50 rounded">
            <p className="font-bold text-blue-800">{recommanderSalle(nbEtudiants)}</p>
          </div>
          <p className="text-xs text-gray-400 mt-4">Système développé par Manassé - UWB Kinshasa - 2026</p>
        </div>
      </div>
    </main>
  );
}