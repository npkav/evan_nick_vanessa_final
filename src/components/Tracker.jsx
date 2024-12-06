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
    <div>
      <h1>PokéTracker</h1>
      <input
        type="text"
        placeholder="Enter Pokémon Name"
        value={pokemonName}
        onChange={(e) => setPokemonName(e.target.value)}
      />
      <button onClick={fetchPokemon}>Search</button>
      {error && <p>{error}</p>}
      <div>
        <h2>Encounters</h2>
        {encounterData.length === 0 && <p>No encounter data available.</p>}
        {encounterData.map((encounter, index) => (
          <div key={index}>
            <p>Location: {capitalize(encounter.location_area.name.replace(/-/g, ' '))}</p>
            <ul>
              {encounter.version_details.map((detail, idx) => (
                <li key={idx}>
                  Game: {capitalize(detail.version.name.replace(/-/g, ' '))}
                  <ul>
                    {detail.encounter_details.map((encDetail, edx) => (
                      <li key={edx}>
                        Chance: {encDetail.chance}%
                        <br />
                        Method: {capitalize(encDetail.method.name.replace(/-/g, ' '))}
                        <br />
                        Levels: {encDetail.min_level} to {encDetail.max_level}
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
  );
};

export default Tracker;