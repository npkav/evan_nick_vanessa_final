import React, {useState, useEffect} from 'react';
import {capitalize} from './Capitalize';

import bugIcon from '../assets/types/bug_icon.png'
import darkIcon from '../assets/types/dark_icon.png'
import dragonIcon from '../assets/types/dragon_icon.png'
import electricIcon from '../assets/types/electric_icon.png'
import fairyIcon from '../assets/types/fairy_icon.png'
import fightingIcon from '../assets/types/fighting_icon.png'
import fireIcon from '../assets/types/fire_icon.png'
import flyingIcon from '../assets/types/flying_icon.png'
import ghostIcon from '../assets/types/ghost_icon.png'
import grassIcon from '../assets/types/grass_icon.png'
import groundIcon from '../assets/types/ground_icon.png'
import iceIcon from '../assets/types/ice_icon.png'
import normalIcon from '../assets/types/normal_icon.png'
import poisonIcon from '../assets/types/poison_icon.png'
import psychicIcon from '../assets/types/psychic_icon.png'
import rockIcon from '../assets/types/rock_icon.png'
import steelIcon from '../assets/types/steel_icon.png'
import stellarIcon from '../assets/types/stellar_icon.png'
import waterIcon from '../assets/types/water_icon.png'

const Builder = () => {

  const [team, setTeam] = useState([])
  const [teamSearch, setSearch] = useState('')
  const [teamWarn, setWarn] = useState('')
  const [teamPokemon, setPokemon] = useState(null)
  const [teamSaved, setSaved] = useState([])
  const [teamId, setId] = useState('');

  const addTeam = (pokemon) => {
    if (team.length >= 6) {
      setWarn('Oops! Your team is already full! Please remove a Pokémon before you add a new one!')
    } else {
      const capPokemon = {
        ...pokemon,
        name: capitalize(pokemon.name),
        isShiny: false,
      }
      setTeam([...team, capPokemon])
      setWarn('')
    }
  };

  const removeTeam = (index) => {
    setTeam(team.filter((_, i) => i !== index))
  };

  const shinyToggle = (index) => {
    setTeam(team.map((pokemon, i) => {
      if (i === index) {
        return {...pokemon, isShiny: !pokemon.isShiny}
      }
      return pokemon;
    }))
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
          types: data.types.map((type) => type.type.name),
        })
      })
      .catch(() => {
        setPokemon(null)
      });
  }, [teamSearch]);

  useEffect(() => {
    fetch('http://localhost:5000/teams')
      .then((response) => response.json())
      .then((data) => {
        setSaved(data)
      })
      .catch((error) => {
        setWarn('Oops! There was an error loading your saved teams. Please try again!')
        console.error('Error:', error)
      })
  }, []);

  const typeIcon = {
    bug: bugIcon,
    dark: darkIcon,
    dragon: dragonIcon,
    electric: electricIcon,
    fairy: fairyIcon,
    fighting: fightingIcon,
    fire: fireIcon,
    flying: flyingIcon,
    ghost: ghostIcon,
    grass: grassIcon,
    ground: groundIcon,
    ice: iceIcon,
    normal: normalIcon,
    poison: poisonIcon,
    psychic: psychicIcon,
    rock: rockIcon,
    steel: steelIcon,
    stellar: stellarIcon,
    water: waterIcon,
  };

  const getType = (type) => {
    return typeIcon[type];
  };

  const teamSave = () => {
    if (team.length === 0) {
      setWarn('Please add some Pokémon to your team before saving!')
      return;
    }

    fetch('http://localhost:5000/teams')
    .then((response) => response.json())
    .then((data) => {
      const nextId = data.length > 0 ? `team ${data.length + 1}` : "team 1"
      const teamNew = {
        id: nextId,
        team: team,
      };


      fetch('http://localhost:5000/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teamNew),
      })
        .then((response) => response.json())
        .then(() => {
          setWarn(`Team saved successfully as ${nextId}!`);
          setSaved([...teamSaved, teamNew]);
        })
        .catch((error) => {
          setWarn('Oops! There was an error saving your team. Please try again!');
          console.error('Error:', error);
        });
    })
      .catch((error) => {
        setWarn('Oops! There was an error loading your teams. Please try again!');
        console.error('Error:', error);
      });
  };

  const teamLoad = () => {
    if (!teamId) {
      setWarn('Please select a team to load!')
      return;
    };

    const teamSelect = teamSaved.find((team) => team.id === teamId);

    if (teamSelect) {
      setTeam(teamSelect.team)
      setWarn(`Team ${teamId} successfully loaded!`)
    } else {
      setWarn('Team not found!')
    }
  };

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

                <div style={{ position: 'absolute', top: '5px', left: '5px' }}>
                  {pokemon.types.slice(0, 2).map((type, i) => (
                    <img
                      key={i}
                      src={getType((type))}
                      alt={type}
                      style={{ width: '25px', height: '25px', marginBottom: i === 0 ? '5px' : '0' }}
                    />
                  ))}
                </div>

                <img
                  src={pokemon.isShiny ? pokemon.shinyImage : pokemon.image}
                  alt={pokemon.name}
                  style={{width:'100px'}}
                />

                <button onClick={() => shinyToggle(index)}
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    background: 'rgba(0, 0, 0, 0.8)',
                    border: '1px solid #ccc',
                    borderRadius: '50%',
                    padding: '1px',
                  }}>✨</button>

                <h4>{pokemon.name}</h4>
                <button onClick={() => removeTeam(index)}>X</button>
              </div>
            ))
          )}
          </div>
          
          <div className="mt-4 flex w-full max-w-sm justify-between items-center">
          <div className="flex gap-4">
            <button
              onClick={teamSave}
              className="mt-2 p-2 bg-red-500 text-white rounded"
            >Save Team</button>
          
          <div>
            <h2>Select a Saved Team</h2>
            <select
              value={teamId}
              onChange={(e) => setId(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            >

              <option value="">Select a team...</option>
              {teamSaved.map((savedTeam) => (
                <option key={savedTeam.id} value={savedTeam.id}>
                  {savedTeam.id}
                </option>
              ))}
            </select>
          </div>

            <button
              onClick={teamLoad}
              className="mt-2 p-2 bg-red-500 text-white rounded"
            >Load Team</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Builder;