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
    return Array.from(weaknesses).join(', '); // Convert Set back to array and join
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
                <span className="font-bold">#{id}</span> {pokemon.name}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {selectedPokemon ? (
          <div className="border p-4 rounded shadow-lg">
            <h2 className="text-2xl">{selectedPokemon.name}</h2>
            <p>Height: {formatHeight(selectedPokemon.height)} cm</p>
            <p>Weight: {formatWeight(selectedPokemon.weight)} kg</p>
            <p>Abilities:</p>
            <ul className="list-disc pl-5">
              {selectedPokemon.abilities.map((ability, index) => (
                <li key={index}>{ability.ability.name}</li>
              ))}
            </ul>
            <p>Type:</p>
            <ul className="list-disc pl-5">
              {selectedPokemon.types.map((typeInfo, index) => (
                <li key={index}>{typeInfo.type.name}</li>
              ))}
            </ul>
            <p>Weaknesses:</p>
            <p>{getWeaknesses(selectedPokemon.types)}</p>

            <h3 className="text-xl mt-4">Stats:</h3>
            {selectedPokemon.stats.map((stat) => (
              <ProgressBar
                key={stat.stat.name}
                label={stat.stat.name.charAt(0).toUpperCase() + stat.stat.name.slice(1)}
                value={stat.base_stat}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Select a Pokémon to see details.</p>
        )}
      </div>
    </div>
  );
}

export default App;
