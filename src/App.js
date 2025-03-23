import React, { useState, useEffect } from "react";
import "./style.css";

function App() {
  const [pokemon, setPokemon] = useState(null);
  const [evolutionChain, setEvolutionChain] = useState([]);
  const [search, setSearch] = useState("charizard");

  function loadAPI(pokemonName) {
    let url = `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`;
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Pokémon não encontrado");
        }
        return response.json();
      })
      .then((res) => {
        setPokemon(res);
        loadEvolutionChain(res.species.url);
      })
      .catch((err) => {
        console.error(err);
        setPokemon(null);
        setEvolutionChain([]);
      });
  }

  function loadEvolutionChain(speciesUrl) {
    fetch(speciesUrl)
      .then((response) => response.json())
      .then((speciesData) => {
        return fetch(speciesData.evolution_chain.url);
      })
      .then((response) => response.json())
      .then((evolutionData) => {
        const chain = [];
        let evo = evolutionData.chain;

        while (evo) {
          chain.push(evo.species.name);
          evo = evo.evolves_to.length > 0 ? evo.evolves_to[0] : null;
        }

        setEvolutionChain(chain);
      })
      .catch((err) => console.error("Erro ao carregar a evolução:", err));
  }

  useEffect(() => {
    loadAPI(search);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadAPI(search);
  };

  return (
    <div className="container">
      <header>
        <strong>Lista de Pokémons</strong>
      </header>
      {/* Caminho corrigido para exibir a imagem corretamente */}
      {/*<img src="/pokemon_images.webp" alt="Pokedex" />*/}
      <div>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Pesquisar Pokémon"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">Buscar</button>
        </form>
      </div>
      {pokemon ? (
        <div>
          <img src={pokemon.sprites.front_default} alt={pokemon.name} />
          <div><strong>Nome:</strong> {pokemon.name}</div>
          <div><strong>N°:</strong> {pokemon.id}</div>
          <div><strong>Peso:</strong> {pokemon.weight / 10} kg</div>
          <div><strong>Altura:</strong> {pokemon.height / 10} m</div>
          <div>
            <strong>Habilidades:</strong>{" "}
            {pokemon.abilities.map((ability, index) => (
              <span key={index}>{ability.ability.name}{index < pokemon.abilities.length - 1 ? ", " : ""}</span>
            ))}
          </div>
          <div>
            <strong>Cadeia Evolutiva:</strong> {evolutionChain.length > 0 ? evolutionChain.join(" ➝ ") : "N/A"}
          </div>
        </div>
      ) : (
        <p>Pokémon não encontrado</p>
      )}
    </div>
  );
}

export default App;
