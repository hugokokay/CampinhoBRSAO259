/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import MapChart from './components/MapChart';
import { Users, MapPin } from 'lucide-react';

const BRAZIL_STATES = [
  { id: 'AC', name: 'Acre' },
  { id: 'AL', name: 'Alagoas' },
  { id: 'AP', name: 'Amapá' },
  { id: 'AM', name: 'Amazonas' },
  { id: 'BA', name: 'Bahia' },
  { id: 'CE', name: 'Ceará' },
  { id: 'DF', name: 'Distrito Federal' },
  { id: 'ES', name: 'Espírito Santo' },
  { id: 'GO', name: 'Goiás' },
  { id: 'MA', name: 'Maranhão' },
  { id: 'MT', name: 'Mato Grosso' },
  { id: 'MS', name: 'Mato Grosso do Sul' },
  { id: 'MG', name: 'Minas Gerais' },
  { id: 'PA', name: 'Pará' },
  { id: 'PB', name: 'Paraíba' },
  { id: 'PR', name: 'Paraná' },
  { id: 'PE', name: 'Pernambuco' },
  { id: 'PI', name: 'Piauí' },
  { id: 'RJ', name: 'Rio de Janeiro' },
  { id: 'RN', name: 'Rio Grande do Norte' },
  { id: 'RS', name: 'Rio Grande do Sul' },
  { id: 'RO', name: 'Rondônia' },
  { id: 'RR', name: 'Roraima' },
  { id: 'SC', name: 'Santa Catarina' },
  { id: 'SP', name: 'São Paulo' },
  { id: 'SE', name: 'Sergipe' },
  { id: 'TO', name: 'Tocantins' }
];

export default function App() {
  const [people, setPeople] = useState<{name: string, state: string}[]>([]);
  const [name, setName] = useState('');
  const [selectedState, setSelectedState] = useState('');

  // Fetch initial data from server
  useEffect(() => {
    fetch('/api/people')
      .then(res => res.json())
      .then(data => setPeople(data))
      .catch(err => console.error("Failed to load data", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name && selectedState) {
      const newPerson = { name, state: selectedState };
      
      // Optimistic update
      setPeople([...people, newPerson]);
      setName('');
      setSelectedState('');

      // Save to server
      try {
        await fetch('/api/people', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPerson)
        });
      } catch (err) {
        console.error("Failed to save person", err);
      }
    }
  };

  const stateCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    people.forEach(p => {
      counts[p.state] = (counts[p.state] || 0) + 1;
    });
    return counts;
  }, [people]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-green-700">Campinho Digital BRSAO259</h1>
          <p className="text-slate-500 mt-2">Acompanhe a adesão por estado em tempo real</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              Mapa de Adesão
            </h2>
            <div className="flex-1 w-full bg-slate-50/50 rounded-xl overflow-hidden border border-slate-100 min-h-[600px] relative">
              <MapChart data={stateCounts} />
              
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-md border border-slate-200 max-h-64 overflow-y-auto min-w-[180px]">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Total por Estado</h3>
                {Object.entries(stateCounts).length === 0 ? (
                  <p className="text-sm text-slate-400">Nenhum registro</p>
                ) : (
                  <ul className="space-y-2">
                    {Object.entries(stateCounts)
                      .sort((a, b) => b[1] - a[1])
                      .map(([state, count]) => (
                        <li key={state} className="flex justify-between items-center text-sm">
                          <span className="font-semibold text-slate-700">{state}</span>
                          <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded-full">{count}</span>
                        </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-semibold mb-4">De onde você estuda?</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Nome</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                    placeholder="Seu nome completo"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
                  <select
                    id="state"
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-white"
                    required
                  >
                    <option value="" disabled>Selecione um estado</option>
                    {BRAZIL_STATES.map(st => (
                      <option key={st.id} value={st.id}>{st.name} ({st.id})</option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition-colors"
                >
                  Confirmar Participação
                </button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Últimos Registros
              </h2>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {people.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-4">Nenhum registro ainda.</p>
                ) : (
                  [...people].reverse().map((p, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="font-medium text-slate-800 truncate mr-2">{p.name}</span>
                      <span className="text-xs font-bold bg-green-100 text-green-800 px-2 py-1 rounded-full shrink-0">
                        {p.state}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

