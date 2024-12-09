import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { capitalize } from './Capitalize.jsx';

const Tracker = () => {
  const [pokemonName, setPokemonName] = useState('');
  const [encounterData, setEncounterData] = useState([]);
  const [error, setError] = useState(null);

  const clearData = () => {
    setEncounterData([]);
    setError(null);
  };

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
    <div className="p-5 bg-[#f0f0f0] min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold text-[#ee1515] mb-5">PokéTracker</h1>
      <input
        type="text"
        placeholder="Enter Pokémon Name"
        value={pokemonName}
        onChange={(e) => setPokemonName(e.target.value)}
        className="w-full max-w-md p-2 border-2 border-[#222224] rounded-md mb-4 text-lg focus:border-[#ee1515] focus:outline-none"
      />
      <button
        onClick={fetchPokemon}
        className="px-6 py-2 border-none rounded-md bg-[#ee1515] text-white text-lg cursor-pointer transition duration-300 ease-in-out hover:bg-[#ee1515]/80"
      >
        Search
      </button>
      {error && <p className="text-[#222224] mt-4">{error}</p>}
      <div className="w-full max-w-4xl mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-[#ee1515]">Encounters</h2>
          {encounterData.length > 0 && (
            <button
              onClick={clearData}
              className="p-2 text-[#222224] hover:text-[#ee1515] transition-colors"
            >
              <FaTimes />
            </button>
          )}
        </div>
        {encounterData.length === 0 && <p className="text-[#222224]">No encounter data available.</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {encounterData.map((encounter, index) => (
            <div key={index} className="bg-[#f0f0f0] p-4 border border-[#222224] rounded-lg shadow-md">
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
