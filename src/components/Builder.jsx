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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (teamSearch === '') return;
    
    const capSearch = teamSearch.toLowerCase()
    fetch(`https://pokeapi.co/api/v2/pokemon/${capSearch}`)
      .then((response) => response.json())
      .then((data) => {
        const pokemon = {
          name: capitalize(data.name),
          image: data.sprites.front_default,
          shinyImage: data.sprites.front_shiny,
          types: data.types.map((type) => type.type.name),
          isShiny: false,
        }
        
        if (team.length >= 6) {
          setWarn('Oops! Your team is already full! Please remove a Pokémon before you add a new one!')
        } else {
          setTeam([...team, pokemon])
          setWarn('')
        }
        setSearch('')
      })
      .catch(() => {
        setWarn('No Pokémon found!')
      });
  };

  useEffect(() => {
    fetch('http://localhost:3000/teams')
      .then((response) => response.json())
      .then((data) => {
        setSaved(data)
      })
      .catch((error) => {
        setWarn('Oops! There was an error loading your saved teams. Please try again!')
        console.error('Error:', error)
      })
  }, []);

  const removeTeam = (index) => {
    if (teamId) {
      const accessedTeam = teamSaved.find((savedTeam) => savedTeam.id === teamId);
  
      if (accessedTeam) {
        const updatedTeam = accessedTeam.team.filter((_, i) => i !== index);
  
        fetch(`http://localhost:3000/teams/${teamId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ team: updatedTeam }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Failed to update team on server');
            }
            setSaved(
              teamSaved.map((savedTeam) =>
                savedTeam.id === teamId
                  ? { ...savedTeam, team: updatedTeam }
                  : savedTeam
              )
            );
            setTeam(updatedTeam);
            setWarn('Pokémon successfully removed from the accessed team!');
          })
          .catch((error) => {
            setWarn('Error updating team on server. Please try again!');
            console.error('Error:', error);
          });
      } else {
        setWarn('No accessed team found!');
      }
    } else {
      setTeam(team.filter((_, i) => i !== index));
      setWarn('Pokémon removed from the active team!');
    }
  };
  
  const shinyToggle = (index) => {
    setTeam(team.map((pokemon, i) => {
      if (i === index) {
        return {...pokemon, isShiny: !pokemon.isShiny}
      }
      return pokemon;
    }))
  };

  const teamSave = () => {
    if (team.length === 0) {
      setWarn('Please add some Pokémon to your team before saving!')
      return;
    }

    fetch('http://localhost:3000/teams')
    .then((response) => response.json())
    .then((data) => {
      const nextId = data.length > 0 ? `team ${data.length + 1}` : "team 1"
      const teamNew = {
        id: nextId,
        team: team,
      };


      fetch('http://localhost:3000/teams', {
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
      setWarn(`${capitalize(teamId)} successfully loaded!`);
    } else {
      setWarn('Team not found!')
    }
  };

  const teamDelete = (id) => {
    fetch(`http://localhost:3000/teams/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete team on server');
        }
        setSaved(teamSaved.filter((savedTeam) => savedTeam.id !== id));
  
        if (id === teamId) {
          setTeam([]);
          setId('');
          setWarn('The selected team was deleted, and the current team was cleared.');
        } else {
          setWarn('Team deleted successfully!');
        }
      })
      .catch((error) => {
        setWarn('Error deleting team on server. Please try again!');
        console.error('Error:', error);
      });
  };

  return (
    <div className="w-full max-w-4xl p-6 my-8 bg-[#f0f0f0] rounded-lg border-2 border-[#222224] relative mt-28">
      <h1 className="text-3xl font-bold mb-6">PokéBuilder</h1>

      <div className="mb-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={teamSearch}
            placeholder="Enter Pokémon name..."
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border rounded-lg flex-1"
          />
          <button 
            type="submit"
            className="px-4 py-2 bg-[#ee1515] text-white rounded-lg opacity-40 hover:opacity-100 transition-all duration-300"
          >
            Add to Team
          </button>
        </form>
      </div>

      {teamWarn && (
        <p className="text-center text-red-500 mb-4">{teamWarn}</p>
      )}

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Your Team</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {team.length === 0 ? (
            <p className="col-span-full text-center py-8">
              Your team is empty. Search up a Pokémon to add to your team!
            </p>
          ) : (
            team.map((pokemon, index) => (
              <div
                key={index}
                className="relative p-4 bg-white rounded-lg border-2 border-[#222224]"
              >
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {pokemon.types.slice(0, 2).map((type, i) => (
                    <img
                      key={i}
                      src={getType(type)}
                      alt={type}
                      className="w-6 h-6"
                    />
                  ))}
                </div>

                <button 
                  onClick={() => shinyToggle(index)}
                  className="absolute top-2 right-2 bg-black/80 text-white p-1 rounded-full hover:bg-black/60 transition-colors"
                >
                  ✨
                </button>

                <img
                  src={pokemon.isShiny ? pokemon.shinyImage : pokemon.image}
                  alt={pokemon.name}
                  className="w-32 h-32 mx-auto"
                />

                <h4 className="text-lg capitalize mt-2 mb-3">{pokemon.name}</h4>
                
                <button 
                  onClick={() => removeTeam(index)}
                  className="absolute bottom-2 right-2 text-red-500 hover:text-red-700 font-bold"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <button
          onClick={teamSave}
          className="px-4 py-2 bg-[#ee1515] text-white rounded-lg opacity-40 hover:opacity-100 transition-all duration-300"
        >
          Save Team
        </button>

        <div className="flex flex-col items-center gap-2">
          <select
            value={teamId}
            onChange={(e) => setId(e.target.value)}
            className="p-2 border rounded-lg w-full"
          >
            <option value="">Select a team...</option>
            {teamSaved.map((savedTeam) => (
              <option key={savedTeam.id} value={savedTeam.id}>
                {savedTeam.id}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <button
              onClick={teamLoad}
              className="px-4 py-2 bg-[#ee1515] text-white rounded-lg opacity-40 hover:opacity-100 transition-all duration-300"
            >
              Load Team
            </button>

            {teamId && (
              <button
                onClick={() => teamDelete(teamId)}
                className="px-4 py-2 bg-[#ee1515] text-white rounded-lg opacity-40 hover:opacity-100 transition-all duration-300"
              >
                Delete Team
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Builder;