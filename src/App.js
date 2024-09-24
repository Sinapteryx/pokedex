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

  const formatHeight = (height) => {
    const feet = Math.floor(height / 30.48);
    const inches = Math.round((height % 30.48) / 2.54);
    return `${feet}' ${inches}"`;
  };

  const formatWeight = (weight) => {
    const lbs = Math.round(weight * 2.20462);
    return `${lbs} lbs`;
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

  return (
    <div className="App">
      <h1 className="text-3xl font-bold">Pokedex</h1>
      <ul className="my-4 space-y-2">
        {pokemonList.map((pokemon, index) => {
          const id = index + 1; // Pokémon ID (1-151)
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

      {selectedPokemon && (
        <div className="border p-4 rounded shadow-lg mt-4">
          <h2 className="text-2xl">{selectedPokemon.name}</h2>
          <p>Height: {formatHeight(selectedPokemon.height)}</p>
          <p>Weight: {formatWeight(selectedPokemon.weight)}</p>
          <p>Gender: {selectedPokemon.gender || 'Unknown'}</p>
          <p>Category: {selectedPokemon.species?.name || 'Unknown'}</p>
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
          <ul>
            {getWeaknesses(selectedPokemon.types).split(', ').map((weakness, index) => (
            <li key={index}>{weakness}</li>
            ))}
            </ul>
        </div>
      )}
    </div>
  );
}

export default App;