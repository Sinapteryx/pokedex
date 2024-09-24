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

  const getWeaknesses = (types) => {
    const weaknesses = new Set();
    types.forEach((typeInfo) => {
      const typeWeaknesses = weaknessesMap[typeInfo.type.name];
      if (typeWeaknesses) {
        typeWeaknesses.forEach((weakness) => weaknesses.add(weakness));
      }
    });
    return Array.from(weaknesses).join(', ');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-6">Pokedex</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Pokémon List</h2>
          <ul className="space-y-2">
            {pokemonList.map((pokemon, index) => {
              const id = index + 1; // Pokémon ID (1-151)
              return (
                <li
                  key={id}
                  className="cursor-pointer p-2 border rounded hover:bg-gray-100 transition"
                  onClick={() => fetchPokemonDetails(pokemon.url)}
                >
                  <span className="font-bold">#{id}</span> {pokemon.name}
                </li>
              );
            })}
          </ul>
        </div>

        {selectedPokemon && (
          <div className="bg-white shadow-md rounded-lg p-4 col-span-1 md:col-span-2 lg:col-span-2">
            <h2 className="text-2xl font-bold mb-2">{selectedPokemon.name}</h2>
            <p className="mb-1">Height: {formatHeight(selectedPokemon.height)}</p>
            <p className="mb-1">Weight: {formatWeight(selectedPokemon.weight)}</p>
            <p className="mb-1">Gender: {selectedPokemon.gender || 'Unknown'}</p>
            <p className="mb-1">Category: {selectedPokemon.species?.name || 'Unknown'}</p>
            <p className="font-semibold mb-1">Abilities:</p>
            <ul className="list-disc pl-5 mb-1">
              {selectedPokemon.abilities.map((ability, index) => (
                <li key={index}>{ability.ability.name}</li>
              ))}
            </ul>
            <p className="font-semibold mb-1">Type:</p>
            <ul className="list-disc pl-5 mb-1">
              {selectedPokemon.types.map((typeInfo, index) => (
                <li key={index}>{typeInfo.type.name}</li>
              ))}
            </ul>
            <p className="font-semibold mb-1">Weaknesses:</p>
            <p>{getWeaknesses(selectedPokemon.types)}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
