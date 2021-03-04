import React, { useState, useEffect } from 'react'
import axios from 'axios'

import Pokemon from './components/Pokemon'
import SelectBox from './components/SelectBox'
import Autocomplete from './components/AutoComplete'
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import CircularProgress from '@material-ui/core/CircularProgress';
import Checkbox from '@material-ui/core/Checkbox';
import './App.css';

function App() {
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)
  const [abilities, setAbilities] = useState([])
  const [abilitiesArray, setAbilitiesArray] = useState([])
  const [pokemonData, setPokemonData] = useState([])
  const [referencePokemonData, setReferencePokemonData] = useState([])
  const [nextUrl, setNextUrl] = useState('')
  const [prevUrl, setPrevUrl] = useState('')
  const [spinner, setSpinner] = useState(false)

  useEffect(() => {
    getData()
  }, [limit]);

  useEffect(() => {
    abilitiesArrayParse()
  }, [abilitiesArray]);

  useEffect(() => {
    filterPokemonAbilities()
  }, [abilities]);

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

  const getAllPokemons = (url) => {
    setSpinner(true)
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
        setReferencePokemonData(resp)
        setAbilitiesArray(resp)
        setSpinner(false)
      })
      .catch(err => console.log(err))
  }

  const abilitiesArrayParse = () => {
    let aux = []
    pokemonData.map(pokemon => {
      return pokemon.abilities.map((ability, key) => aux.push(ability.ability.name))
    })

    let aux2 = []
    for (let i = 0; i < aux.length; i++) {
      aux2[i] = { [aux[i]]: false }
    }
    const filteredArr = aux2.reduce((acc, current) => {
      const x = acc.find(item => Object.keys(item)[0] === Object.keys(current)[0]);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
    setAbilities(filteredArr)

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

  const handleCheckboxClick = (value) => {
    let newAbilities = abilities.map(ability => {
      let aux = Object.entries(ability)
      if (Object.keys(ability)[0] === value) {
        let newValue = (!(aux[0][1]))
        return { [Object.keys(ability)[0]]: newValue }
      } else
        return ability
    })
    setAbilities(newAbilities)
  }

  const filterPokemonAbilities = () => {
    let filteredArr = []
    let a = []
    let checkAbilities = abilities.filter(ability => {
      if (Object.entries(ability)[0][1]) {}
        return ability
    }).map(filter => Object.entries(filter)[0][0])
    console.log(checkAbilities);
    for (let i = 0; i < referencePokemonData.length; i++) {
      for (let j = 0; j < referencePokemonData[i].abilities.length; j++) {
        for (let k = 0; k < checkAbilities.length; k++) {
          if (referencePokemonData[i].abilities[j].ability.name === checkAbilities[k])
            a.push(referencePokemonData[i])
        }
      }
    }

    filteredArr = a.reduce((acc, current) => {
      const x = acc.find(item => item.id === current.id);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    if (filteredArr.length > 0)
      setPokemonData(filteredArr)
    else if (filteredArr.length === 0) {
      setPokemonData(referencePokemonData)
    }
  }

  return (
    <div>
      { spinner &&
        <div className="spinner">
          <CircularProgress color="secondary" />
        </div>
      }
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <p onClick={handleClick}>Clique aqui para reiniciar a pesquisa </p>
      </div>

      <div className="container">
        <div className="header">
          <div className="autoComplete">
            <Autocomplete getSinglePokemon={getSinglePokemon} autoCompleteArray={pokemonData?.map(pokemon => pokemon.name)} />
          </div>
          <div className="checkbox">
            {abilities.map((ability, key) => {
              return (
                <p> <Checkbox onClick={() => handleCheckboxClick(Object.keys(ability)[0])} key={key} label="primary" />{Object.keys(ability)[0]}</p>
              )
            })}
          </div>
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
    </div>
  );
}

export default App;
