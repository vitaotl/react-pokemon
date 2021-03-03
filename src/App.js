import React, { useState, useEffect } from 'react'
import axios from 'axios'

import Pokemon from './components/Pokemon'
import SelectBox from './components/SelectBox'
import Autocomplete from './components/AutoComplete'
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import './App.css';

function App() {
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)
  const [pokemonData, setPokemonData] = useState([])
  const [nextUrl, setNextUrl] = useState('')
  const [prevUrl, setPrevUrl] = useState('')


  const getData = () => {
    getAllPokemons(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${page * limit}`)
  }

  const getSinglePokemon = (name) => {
    axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then(resp => {
        setPokemonData([resp.data])
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    getData()
  }, [limit]);


  const getAllPokemons = (url) => {
    axios.get(url)
      .then(resp => {
        setNextUrl(resp.data.next)
        setPrevUrl(resp.data.previous)
        getPokemon(resp.data.results)
      })
      .catch()
  }

  const getPokemon = (pokemonArray) => {
    axios.all(pokemonArray.map(pokemon => axios.get(pokemon.url)))
      .then(resp => {
        return resp.map(resp => resp.data)
      })
      .then(resp => {
        setPokemonData(resp)
      })
      .catch(err => console.log(err))
  }

  const handleButtonClick = (action) => {
    if (action === 'increment') {
      getAllPokemons(nextUrl)
      setPage(page + 1)

    }
    else if (action === 'decrement' && page !== 0) {
      getAllPokemons(prevUrl)
      setPage(page - 1)
    }

  }

  const handleClick = () => {
    setPage(0)
    getData()
  }

  console.log("AQUI" + pokemonData);

  return (
    <>
    <div style={{display: 'flex', justifyContent: 'center'}}>
      <p onClick={handleClick}>Procurar por todos Pokemons </p>
    </div>
      <div className="container">
        {/* { loading && <CircularProgress />} */}
        <div className="header">
          <Autocomplete getSinglePokemon={getSinglePokemon} autoCompleteArray={pokemonData?.map(pokemon => pokemon.name)} />
        </div>
        <div className="pokemon__list">
          {pokemonData.map((pokemon, key) => {
            return <Pokemon key={key} pokemon={pokemon} />
          })}
        </div>
        <div className="footer">
          <NavigateBeforeIcon className="navigation-icon" onClick={() => handleButtonClick('decrement')} style={{ marginRight: '5px' }} />
          {page}
          <NavigateNextIcon className="navigation-icon" onClick={() => handleButtonClick('increment')} style={{ marginLeft: '5px' }} />
          <SelectBox setLimit={setLimit} setPage={setPage} getData={getData} />
        </div>
      </div>
    </>
  );
}

export default App;
