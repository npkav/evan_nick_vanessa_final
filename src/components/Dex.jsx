import React, { useState, useEffect } from 'react';
import '../styles/color-codes.css';

const Badge = ({ children, isType }) => (
  <span className={`px-3 py-1 rounded-full capitalize ${
    isType ? `type-${children} text-white` : "bg-transparent text-black"
  }`}>
    {children}
  </span>
);

const Dex = () => {
  const [Pokemon, setPokemon] = useState(null);
  const [PokemonId, setPokemonId] = useState(1);

  useEffect(() => {
    const FetchPokemon = async () => {
      const [PokemonRes, SpeciesRes] = await Promise.all([
        fetch(`https://pokeapi.co/api/v2/pokemon/${PokemonId}`),
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${PokemonId}`)
      ]);

      const [PokemonData, SpeciesData] = await Promise.all([
        PokemonRes.json(),
        SpeciesRes.json()
      ]);

      setPokemon({
        id: PokemonData.id,
        name: PokemonData.name,
        image: PokemonData.sprites.other['official-artwork'].front_default,
        types: PokemonData.types.map(Type => Type.type.name),
        height: PokemonData.height / 10,
        weight: PokemonData.weight / 10,
        abilities: PokemonData.abilities.map(Ability => Ability.ability.name),
        description: SpeciesData.flavor_text_entries
          .find(Text => Text.language.name === 'en')
          .flavor_text.replace(/\f/g, ' ')
      });
    };

    FetchPokemon();
  }, [PokemonId]);

  if (!Pokemon) return null;

  return (
    <div className="w-full max-w-4xl p-6 my-8 bg-[#f0f0f0] rounded-lg border-2 border-[#222224] relative z-20 mt-28">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 flex justify-center">
          <img 
            src={Pokemon.image} 
            alt={Pokemon.name} 
            className="w-[400px] h-[400px] object-contain"
          />
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold capitalize">{Pokemon.name}</h2>
            <span className="text-2xl">
              #{Pokemon.id.toString().padStart(3, '0')}
            </span>
          </div>

          <p className="mb-4">{Pokemon.description}</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Types</h3>
              <div className="flex gap-2">
                {Pokemon.types.map(Type => (
                  <Badge key={Type} isType>{Type}</Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Abilities</h3>
              <div className="flex flex-wrap gap-2">
                {Pokemon.abilities.map(Ability => (
                  <Badge key={Ability}>{Ability}</Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Height</h3>
              <p>{Pokemon.height} m</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Weight</h3>
              <p>{Pokemon.weight} kg</p>
            </div>
          </div>

          <div className="flex justify-between mt-auto pt-4 bg-transparent">
            <button
              onClick={() => setPokemonId(id => Math.max(1, id - 1))}
              disabled={PokemonId === 1}
              className="px-4 py-2 bg-[#ee1515] text-white rounded-lg disabled:opacity-50 w-[120px]"
            >
              Previous
            </button>
            <button
              onClick={() => setPokemonId(id => id + 1)}
              className="px-4 py-2 bg-[#ee1515] text-white rounded-lg w-[120px]"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dex;