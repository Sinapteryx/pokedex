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

  return (
    <div className="App">
      <h1>Pokedex</h1>
      <ul>
        {pokemonList.map((pokemon, index) => (
          <li key={index} onClick={() => fetchPokemonDetails(pokemon.url)}>
            #{index + 1} {pokemon.name}
          </li>
        ))}
      </ul>

      {selectedPokemon && (
        <div>
          <h2>{selectedPokemon.name}</h2>
          <p>Height: {selectedPokemon.height}</p>
          <p>Weight: {selectedPokemon.weight}</p>
          <p>Types:</p>
          <ul>
            {selectedPokemon.types.map((typeInfo, index) => (
              <li key={index}>{typeInfo.type.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;