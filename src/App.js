import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [pokemonList, setPokemonList] = useState([]);

  useEffect(() => {
    // Fetch the first 151 Pokémon
    axios
      .get('https://pokeapi.co/api/v2/pokemon?limit=151')
      .then((response) => {
        setPokemonList(response.data.results);
      })
      .catch((error) => {
        console.error('Error fetching Pokémon:', error);
      });
  }, []);

  return (
    <div className="App">
      <h1>Pokedex</h1>
      <ul>
        {pokemonList.map((pokemon, index) => (
          <li key={index}>
            #{index + 1} {pokemon.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
