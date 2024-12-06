import React, { useState, useEffect } from "react";
import "../styles/color-codes.css";

const Badge = ({ children, isType }) => (
  <span
    className={`px-3 py-1 rounded-full capitalize ${
      isType ? `type-${children} text-white` : "text-black"
    }`}
  >
    {children}
  </span>
);

const Dex = () => {
  const [mon, setMon] = useState(null);
  const [id, setId] = useState(1);
  const [search, setSearch] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    const term = search.toLowerCase().trim();
    if (!term) return;

    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${term}`);
      if (!res.ok) throw new Error("Pokemon not found");

      const data = await res.json();
      setId(data.id);
      setSearch("");
    } catch {
      alert("Pokémon not found!");
    }
  };

  useEffect(() => {
    const fetchMon = async () => {
      const [monRes, speciesRes] = await Promise.all([
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`),
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`),
      ]);

      const [data, species] = await Promise.all([
        monRes.json(),
        speciesRes.json(),
      ]);

      setMon({
        id: data.id,
        name: data.name,
        image: data.sprites.other["official-artwork"].front_default,
        types: data.types.map((t) => t.type.name),
        height: data.height / 10,
        weight: data.weight / 10,
        abilities: data.abilities.map((a) => a.ability.name),
        description: species.flavor_text_entries
          .find((t) => t.language.name === "en")
          .flavor_text.replace(/\f/g, " "),
      });
    };

    fetchMon();
  }, [id]);

  if (!mon) return null;

  return (
    <div className="w-full max-w-4xl p-6 my-8 bg-[#f0f0f0] rounded-lg border-2 border-[#222224] relative mt-28">
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Enter Pokémon name or number (1-1025)..."
          className="p-2 border rounded-lg flex-1"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-[#ee1515] text-white rounded-lg disabled:opacity-0 w-[120px] opacity-40 hover:opacity-100 transition-all duration-300 active:scale-95 transform"
        >
          Search
        </button>
      </form>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 flex justify-center">
          <img
            src={mon.image}
            alt={mon.name}
            className="w-[400px] h-[400px] object-contain"
          />
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold capitalize">{mon.name}</h2>
            <span className="text-2xl">
              #{mon.id.toString().padStart(3, "0")}
            </span>
          </div>

          <p className="mb-4">{mon.description}</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Types</h3>
              <div className="flex gap-2">
                {mon.types.map((type) => (
                  <Badge key={type} isType>
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Abilities</h3>
              <div className="flex flex-wrap gap-2">
                {mon.abilities.map((ability) => (
                  <Badge key={ability}>{ability}</Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Height</h3>
              <p>{mon.height} m</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Weight</h3>
              <p>{mon.weight} kg</p>
            </div>
          </div>

          <div className="flex justify-between mt-auto pt-4">
            <button
              onClick={() => setId((id) => Math.max(1, id - 1))}
              disabled={id === 1}
              className="px-4 py-2 bg-[#ee1515] text-white rounded-lg disabled:opacity-0 w-[120px] opacity-40 hover:opacity-100 transition-all duration-300 active:scale-95 transform"
            >
              Previous
            </button>
            <button
              onClick={() => setId((id) => id + 1)}
              disabled={id === 1025}
              className="px-4 py-2 bg-[#ee1515] text-white rounded-lg disabled:opacity-0 w-[120px] opacity-40 hover:opacity-100 transition-all duration-300 active:scale-95 transform"
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
