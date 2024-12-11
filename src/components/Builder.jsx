import React, {useState, useEffect} from 'react';
import {capitalize} from './Capitalize';

const Builder = () => {

  const [team, setTeam] = useState([])
  const [teamSearch, setSearch] = useState('')
  const [teamWarn, setWarn] = useState('')
  const [teamPokemon, setPokemon] = useState(null);

  const addTeam = (pokemon) => {
    if (team.length >= 6) {
      setWarn('Oops! Your team is already full! Please remove a Pokémon before you add a new one!')
    } else {
      const capPokemon = {
        ...pokemon,
        name: capitalize(pokemon.name),
        isShiny: false,
      };
      setTeam([...team, capPokemon])
      setWarn('');
    }
  };

  const removeTeam = (index) => {
    setTeam(team.filter((_, i) => i !== index));
  };

  const shinyToggle = (index) => {
    setTeam(team.map((pokemon, i) => {
      if (i === index) {
        return {...pokemon, isShiny: !pokemon.isShiny};
      }
      return pokemon;
    }));
  };

  useEffect(() => {
    if (teamSearch === '') return;
    const capSearch = teamSearch.toLowerCase()
    fetch(`https://pokeapi.co/api/v2/pokemon/${capSearch}`)
      .then((response) => response.json())
      .then((data) => {
        setPokemon({
          name: data.name,
          image: data.sprites.front_default,
          shinyImage: data.sprites.front_shiny,
        });
      })
      .catch(() => {
        setPokemon(null)
      });
  }, [teamSearch]);

  return (
    <div className="mt-[80px] flex flex-col justify-center items-center">
        <h1 className="text-center text-3xl font-semibold">PokéBuilder</h1>

      <div className="flex flex-col justify-center items-center">
        <input
          type="text"
          placeholder="Search Pokémon"
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border border-gray-300 rounded mb-4"
        />

        {teamPokemon && (
          <div className="text-center">
            <img src={teamPokemon.image} alt={teamPokemon.name}/>
            <h3>{teamPokemon.name}</h3>
            <button onClick={() => addTeam(teamPokemon)}
              className="mt-2 p-2 bg-red-500 text-white rounded">Add to Team</button>
          </div>

        )}
        {!teamPokemon && teamSearch && <p>No Pokémon found!</p>}
      </div>

      {teamWarn && <p>{teamWarn}</p>}

      <div className="text-center">
        <h2>Your Team</h2>

        <div className="text-center"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            justifyItems: 'center',
          }}
        >

          {team.length === 0 ? (
            <div className="flex justify-center items-center col-span-3">
            <p>Your team is empty. Search up a Pokémon to add to your team!</p>
            </div>
          ) : (
            team.map((pokemon, index) => (
              <div
                key={index}
                style={{
                  border: '1px solid #ccc',
                  background: 'rgba(255, 255, 255, 0.8)',
                  padding: '10px',
                  textAlign: 'center',
                  position: 'relative',
                  placeItems: 'center',
                }}
              >

                <img
                  src={pokemon.isShiny ? pokemon.shinyImage : pokemon.image}
                  alt={pokemon.name}
                  style={{width:'100px'}}
                />

                <button onClick={() => shinyToggle(index)}
                  style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    background: 'rgba(0, 0, 0, 0.8)',
                    border: '1px solid #ccc',
                    borderRadius: '50%',
                    padding: '5px',
                  }}>✨</button>

                <h4>{pokemon.name}</h4>
                <button onClick={() => removeTeam(index)}>X</button>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Builder;