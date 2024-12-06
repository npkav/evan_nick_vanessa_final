import React, { useState } from 'react';
import { capitalize } from './Capitalize.jsx';

const Tracker = () => {
  const [pokemonName, setPokemonName] = useState('');
  const [encounterData, setEncounterData] = useState([]);
  const [error, setError] = useState(null);

  const fetchPokemon = async () => {
    try {
      setError(null);
      setEncounterData([]);
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
      if (!response.ok) {
        throw new Error('Pokémon not found!');
      }
      const data = await response.json();

      console.log(`Pokémon: ${capitalize(pokemonName)}`);

      const encounterResponse = await fetch(data.location_area_encounters);
      if (!encounterResponse.ok) {
        throw new Error('Encounters not available!');
      }
      const encounterData = await encounterResponse.json();
      setEncounterData(encounterData);

      if (encounterData.length > 0) {
        console.log('Encounter Data:');
        encounterData.forEach((encounter, index) => {
          console.log(`Location: ${capitalize(encounter.location_area.name.replace(/-/g, ' '))}`);
          encounter.version_details.forEach((detail, idx) => {
            console.log(`  Game: ${capitalize(detail.version.name.replace(/-/g, ' '))}`);
            detail.encounter_details.forEach((encDetail, edx) => {
              console.log(`    Chance: ${encDetail.chance}%`);
              console.log(`    Method: ${capitalize(encDetail.method.name.replace(/-/g, ' '))}`);
              console.log(`    Levels: ${encDetail.min_level} to ${encDetail.max_level}`);
            });
          });
        });
      } else {
        console.log('No encounter data available.');
      }
    } catch (err) {
      setEncounterData([]);
      setError(err.message);
      console.error('Error:', err.message);
    }
  };

  return (
    <div className="p-5 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold text-red-600 mb-5">PokéTracker</h1>
      <input
        type="text"
        placeholder="Enter Pokémon Name"
        value={pokemonName}
        onChange={(e) => setPokemonName(e.target.value)}
        className="w-full max-w-md p-2 border-2 border-gray-300 rounded-md mb-4 text-lg focus:border-red-600 focus:outline-none"
      />
      <button
        onClick={fetchPokemon}
        className="px-6 py-2 border-none rounded-md bg-red-600 text-white text-lg cursor-pointer transition duration-300 ease-in-out hover:bg-red-700"
      >
        Search
      </button>
      {error && <p className="text-red-600 mt-4">{error}</p>}
      <div className="w-full max-w-4xl mt-8">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">Encounters</h2>
        {encounterData.length === 0 && <p className="text-gray-600">No encounter data available.</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {encounterData.map((encounter, index) => (
            <div key={index} className="bg-white p-4 border border-gray-200 rounded-lg shadow-md">
              <p className="font-medium mb-2">Location: {capitalize(encounter.location_area.name.replace(/-/g, ' '))}</p>
              <ul className="list-none">
                {encounter.version_details.map((detail, idx) => (
                  <li key={idx} className="mb-3">
                    <p className="font-semibold">Game: {capitalize(detail.version.name.replace(/-/g, ' '))}</p>
                    <ul className="pl-4">
                      {detail.encounter_details.map((encDetail, edx) => (
                        <li key={edx} className="mb-2">
                          <p>Chance: {encDetail.chance}%</p>
                          <p>Method: {capitalize(encDetail.method.name.replace(/-/g, ' '))}</p>
                          <p>Levels: {encDetail.min_level} to {encDetail.max_level}</p>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tracker;
