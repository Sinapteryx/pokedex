import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  useEffect(() => {
    axios
      .get('https://pokeapi.co/api/v2/pokemon?limit=151')
      .then((response) => {
        setPokemonList(response.data.results);
      })
      .catch((error) => {
        console.error('Error fetching Pokémon:', error);
      });
  }, []);

  const fetchPokemonDetails = (url) => {
    axios
      .get(url)
      .then((response) => {
        setSelectedPokemon(response.data);
      })
      .catch((error) => {
        console.error('Error fetching Pokémon details:', error);
      });
  };

  // A mapping of types to their weaknesses
  const weaknessesMap = {
    normal: ["Fighting"],
    fighting: ["Psychic", "Flying", "Fairy"],
    flying: ["Electric", "Rock", "Ice"],
    poison: ["Ground", "Psychic"],
    ground: ["Water", "Ice", "Grass"],
    rock: ["Fighting", "Ground", "Steel", "Water", "Grass"],
    bug: ["Fire", "Flying", "Rock", "Ghost", "Fairy"],
    ghost: ["Ghost", "Dark"],
    steel: ["Fire", "Fighting", "Ground"],
    fire: ["Water", "Rock", "Ground"],
    water: ["Electric", "Grass"],
    grass: ["Fire", "Flying", "Ice", "Bug", "Poison"],
    electric: ["Ground"],
    psychic: ["Bug", "Ghost", "Dark"],
    ice: ["Fire", "Fighting", "Rock", "Steel"],
    dragon: ["Ice", "Fairy", "Dragon"],
    fairy: ["Steel", "Poison"],
    dark: ["Fighting", "Bug", "Fairy"],
  };

  // Function to get weaknesses for selected Pokémon
  const getWeaknesses = (types) => {
    const weaknesses = new Set(); // Use a Set to avoid duplicates
    types.forEach((typeInfo) => {
      const typeWeaknesses = weaknessesMap[typeInfo.type.name];
      if (typeWeaknesses) {
        typeWeaknesses.forEach((weakness) => weaknesses.add(weakness));
      }
    });
    return Array.from(weaknesses); // Convert Set back to array
  };

  // Function to format height from decimetres to centimeters
  const formatHeight = (height) => {
    return height * 10; // Convert to centimeters
  };

  // Function to format weight from hectograms to kilograms
  const formatWeight = (weight) => {
    return weight / 10; // Convert to kilograms
  };

  // ProgressBar Component
  const ProgressBar = ({ label, value }) => {
    return (
      <div className="mb-2">
        <label className="block mb-1">{label}: {value}</label>
        <div className="bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-600 h-4 rounded-full"
            style={{ width: `${value / 255 * 100}%` }} // Assuming max stat value is 255
          ></div>
        </div>
      </div>
    );
  };

  // Function to capitalize the first letter of a string
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Function to format the stat label
  const formatStatLabel = (statName) => {
    return statName === 'hp' ? 'HP' : capitalizeFirstLetter(statName);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/3 md:w-1/4 bg-gray-100 p-4 overflow-y-auto">
        <h1 className="text-2xl font-bold">Pokédex</h1>
        <ul className="my-4 space-y-2">
          {pokemonList.map((pokemon, index) => {
            const id = index + 1;
            return (
              <li
                key={id}
                className="cursor-pointer p-2 border rounded hover:bg-gray-200"
                onClick={() => fetchPokemonDetails(pokemon.url)}
              >
                <span className="font-bold">#{id}</span> {capitalizeFirstLetter(pokemon.name)}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {selectedPokemon ? (
          <div className="border p-4 rounded shadow-lg mb-4 flex">
            <div className="flex-1">
              <h2 className="text-2xl">{capitalizeFirstLetter(selectedPokemon.name)}</h2>
              <p>Height: {formatHeight(selectedPokemon.height)} cm</p>
              <p>Weight: {formatWeight(selectedPokemon.weight)} kg</p>
            </div>
            <img 
              src={selectedPokemon.sprites.front_default} 
              alt={selectedPokemon.name} 
              className="w-24 h-24 object-contain ml-4"
            />
          </div>
        ) : (
          <p className="text-gray-500">Select a Pokémon to see details.</p>
        )}

        {/* Abilities */}
        {selectedPokemon && (
          <>
            <h3 className="text-xl mt-4">Abilities:</h3>
            <div className="flex flex-wrap">
              {selectedPokemon.abilities.map((ability, index) => (
                <button key={index} className="m-1 bg-blue-500 text-white rounded px-3 py-1">
                  {capitalizeFirstLetter(ability.ability.name)}
                </button>
              ))}
            </div>

            {/* Types */}
            <h3 className="text-xl mt-4">Types:</h3>
            <div className="flex flex-wrap">
              {selectedPokemon.types.map((typeInfo, index) => (
                <button key={index} className="m-1 bg-green-500 text-white rounded px-3 py-1">
                  {capitalizeFirstLetter(typeInfo.type.name)}
                </button>
              ))}
            </div>

            {/* Weaknesses */}
            <h3 className="text-xl mt-4">Weaknesses:</h3>
            <div className="flex flex-wrap">
              {getWeaknesses(selectedPokemon.types).map((weakness, index) => (
                <button key={index} className="m-1 bg-red-500 text-white rounded px-3 py-1">
                  {capitalizeFirstLetter(weakness)}
                </button>
              ))}
            </div>

            {/* Held Items */}
            {selectedPokemon.held_items && selectedPokemon.held_items.length > 0 && (
              <>
                <h3 className="text-xl mt-4">Held Items:</h3>
                <div className="flex flex-wrap">
                  {selectedPokemon.held_items.map((item, index) => (
                    <button key={index} className="m-1 bg-yellow-500 text-white rounded px-3 py-1">
                      {capitalizeFirstLetter(item.item.name)}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Stats */}
            <h3 className="text-xl mt-4">Stats:</h3>
            <div className="border p-4 rounded shadow-lg">
              {selectedPokemon.stats.map((stat) => (
                <ProgressBar
                  key={stat.stat.name}
                  label={formatStatLabel(stat.stat.name)} // Use the formatted stat label
                  value={stat.base_stat}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
