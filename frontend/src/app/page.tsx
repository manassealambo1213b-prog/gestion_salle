'use client';
import { useState, useEffect } from 'react';

type Salle = {
  id: number;
  nom: string;
  capacite: number;
  statut: string;
};

export default function Home() {
  const [salles, setSalles] = useState<Salle[]>([]);
  const [nb, setNb] = useState<number>(0);
  const [resultat, setResultat] = useState<string>("");

  const chargerSalles = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/salles`);
    const data = await res.json();
    setSalles(data);
  };

  useEffect(() => { chargerSalles(); }, []);

  const reserver = async (id: number) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reserver/${id}`, { method: 'POST' });
    const data = await res.json();
    setSalles(data.salles);
  };

  const recommanderSalle = (nb: number) => {
    if (salles.length === 0) return "Chargement IA...";
    const possible = salles.filter(s => s.capacite >= nb && s.statut === 'Disponible').sort((a, b) => a.capacite - b.capacite);
    if (possible.length === 0) return `Aucune salle DISPONIBLE pour ${nb} etudiants`;
    const best = possible[0];
    return `${best.nom} (${best.capacite} places) - Taux: ${Math.round((nb / best.capacite) * 100)}%`;
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        {/* HEADER UWB */}
        <div className="bg-white p-4 rounded shadow flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-900 text-white flex items-center justify-center rounded-full font-bold text-xl">U</div>
            <div>
              <h1 className="text-2xl font-bold text-blue-900 leading-none">Université William Booth</h1>
              <p className="text-sm text-gray-500">Kinshasa - RDC | Sciences Informatiques & IA</p>
            </div>
          </div>
        </div>

        {/* RECOMMANDATION IA */}
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-xl font-bold mb-3">Recommandation IA</h2>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Nombre d'étudiants"
              value={nb || ""}
              onChange={(e) => setNb(Number(e.target.value))}
              className="border p-2 rounded flex-1"
            />
            <button
              onClick={() => setResultat(recommanderSalle(nb))}
              className="bg-blue-900 text-white px-4 py-2 rounded font-bold"
            >
              Recommander
            </button>
          </div>
          {resultat && <p className="mt-3 bg-blue-50 p-3 rounded font-bold text-blue-900">{resultat}</p>}
        </div>

        {/* LISTE DES SALLES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {salles.length === 0 && <p>Chargement IA...</p>}
          {salles.map((s) => (
            <div key={s.id} className="bg-white p-4 rounded shadow">
              <h3 className="font-bold text-lg">{s.nom}</h3>
              <p>Capacité : {s.capacite} places</p>
              <p className={s.statut === 'Disponible' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                {s.statut}
              </p>
              <button
                onClick={() => reserver(s.id)}
                disabled={s.statut !== 'Disponible'}
                className="mt-3 w-full bg-green-600 text-white py-2 rounded font-bold disabled:bg-gray-300"
              >
                Réserver
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
