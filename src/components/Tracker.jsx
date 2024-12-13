import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { capitalize } from './Capitalize.jsx';

const Tracker = () => {
  const [pokemonName, setPokemonName] = useState('');
  const [encounterData, setEncounterData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedGeneration, setSelectedGeneration] = useState(null);

  const generations = [
    { id: 1, label: 'Generation I', games: ['red', 'blue', 'yellow'] },
    { id: 2, label: 'Generation II', games: ['gold', 'silver', 'crystal'] },
    { id: 3, label: 'Generation III', games: ['ruby', 'sapphire', 'emerald', 'fire-red', 'leaf-green'] },
    { id: 4, label: 'Generation IV', games: ['diamond', 'pearl', 'platinum', 'heart-gold', 'soul-silver'] },
    { id: 5, label: 'Generation V', games: ['black', 'white', 'black-2', 'white-2'] },
    { id: 6, label: 'Generation VI', games: ['x', 'y', 'omega-ruby', 'alpha-sapphire'] },
    { id: 7, label: 'Generation VII', games: ['sun', 'moon', 'ultra-sun', 'ultra-moon', 'lets-go-pikachu', 'lets-go-eevee'] },
    { id: 8, label: 'Generation VIII', games: ['sword', 'shield', 'brilliant-diamond', 'shining-pearl', 'legends-arceus'] },
  ];

  const clearData = () => {
    setEncounterData([]);
    setError(null);
  };

  const groupAndSimplifyEncounters = (encounterData) => {
    const groupedGames = {};

    encounterData.forEach((encounter) => {
      encounter.version_details.forEach((detail) => {
        const game = detail.version.name;
        if (!groupedGames[game]) {
          groupedGames[game] = [];
        }

        const simplifiedDetails = detail.encounter_details.map(({ chance, method, min_level, max_level }) => ({
          chance,
          method: method.name,
          levels: `${min_level} to ${max_level}`,
        }));

        groupedGames[game].push({
          location: encounter.location_area.name,
          details: simplifiedDetails,
        });
      });
    });

    // Combine games with the same info
    const combinedGames = {};

    Object.entries(groupedGames).forEach(([game, locations]) => {
      const standardizedName = game.replace(/-/g, ' ').toLowerCase();

      const match = Object.entries(combinedGames).find(([, existingLocations]) => 
        JSON.stringify(existingLocations) === JSON.stringify(locations)
      );

      if (match) {
        const combinedKey = `${match[0]} & ${capitalize(standardizedName)}`;
        combinedGames[combinedKey] = match[1];
        delete combinedGames[match[0]];
      } else {
        const formattedGame = capitalize(standardizedName)
          .replace('Fire red', 'FireRed')
          .replace('Leaf green', 'LeafGreen')
          .replace('Heart gold', 'HeartGold')
          .replace('Soul silver', 'SoulSilver')
          .replace('Omega ruby', 'Omega Ruby')
          .replace('Alpha sapphire', 'Alpha Sapphire')
          .replace('Ultra sun', 'Ultra Sun')
          .replace('Ultra moon', 'Ultra Moon');
        combinedGames[formattedGame] = locations;
      }
    });

    return combinedGames;
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

      const encounterResponse = await fetch(data.location_area_encounters);
      if (!encounterResponse.ok) {
        throw new Error('Encounters not available!');
      }
      const encounterData = await encounterResponse.json();

      const filteredData = selectedGeneration
        ? encounterData.filter((encounter) =>
            encounter.version_details.some((detail) =>
              generations[selectedGeneration - 1].games.includes(detail.version.name)
            )
          )
        : encounterData;

      const groupedData = groupAndSimplifyEncounters(filteredData);
      setEncounterData(groupedData);
    } catch (err) {
      setEncounterData([]);
      setError(err.message);
    }
  };

  const sortedGames = Object.entries(encounterData).sort(([gameA], [gameB]) => {
    const genA = generations.find((gen) => gen.games.some((g) => gameA.toLowerCase().includes(g)))?.id || 0;
    const genB = generations.find((gen) => gen.games.some((g) => gameB.toLowerCase().includes(g)))?.id || 0;
    return genA - genB;
  });

  return (
    <div className="w-full max-w-4xl p-6 my-8 bg-[#f0f0f0] rounded-lg border-2 border-[#222224] relative mt-28">
      <h1 className="text-3xl font-bold text-[#222224] mb-5">PokéTracker</h1>
      
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter Pokémon Name"
          value={pokemonName}
          onChange={(e) => setPokemonName(e.target.value)}
          className="p-2 border rounded-lg flex-1"
        />
        <button
          onClick={fetchPokemon}
          className="px-4 py-2 bg-[#ee1515] text-white rounded-lg disabled:opacity-0 w-[120px] opacity-40 hover:opacity-100 transition-all duration-300 active:scale-95 transform"
        >
          Search
        </button>
      </div>

      <select
        value={selectedGeneration || ''}
        onChange={(e) => setSelectedGeneration(Number(e.target.value))}
        className="w-full p-2 border rounded-lg mb-4"
      >
        <option value="">All Generations</option>
        {generations.map((gen) => (
          <option key={gen.id} value={gen.id}>
            {gen.label}
          </option>
        ))}
      </select>

      {error && <p className="text-[#222224] mt-4">{error}</p>}
      
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-[#222224]">Encounters</h2>
          {Object.keys(encounterData).length > 0 && (
            <button
              onClick={clearData}
              className="p-2 text-[#222224] hover:text-[#ee1515] transition-colors"
            >
              <FaTimes />
            </button>
          )}
        </div>
        
        {Object.keys(encounterData).length === 0 && (
          <p className="text-[#222224]">No encounter data available.</p>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedGames.map(([game, locations], idx) => (
            <div key={idx} className="bg-white p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-3 text-[#ee1515]">{game}</h3>
              {locations.map((loc, locIdx) => (
                <div key={locIdx} className="mb-4">
                  <p className="font-medium text-[#222224]">
                    {capitalize(loc.location.replace(/-/g, ' '))}
                  </p>
                  <ul className="mt-2 space-y-2">
                    {[...new Set(loc.details.map((d) => JSON.stringify(d)))].map((detailStr, detIdx) => {
                      const detail = JSON.parse(detailStr);
                      return (
                        <li key={detIdx} className="bg-[#f8f8f8] p-2 rounded">
                          <p className="text-sm">Chance: {detail.chance}%</p>
                          <p className="text-sm">Method: {capitalize(detail.method.replace(/-/g, ' '))}</p>
                          <p className="text-sm">Levels: {detail.levels}</p>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tracker;
