import React from 'react';

import './Pokemon.css'

function Pokemon({ pokemon }) {
  let backgroundImageColor = `pokemon ${pokemon.types[0].type.name}`
  return (
    <div className={backgroundImageColor}>
      <div className="pokemon__img" >
        <img src={pokemon.sprites.front_default} alt="" />
      </div>
      <div className="pokemon__info">
        <div className="pokemon__name">
          {pokemon.name}
        </div>
        <div className="pokemon__types">
          {pokemon.types.map((type, key) => {
            return (
              <div key={key} className="pokemon__type">
                {type.type.name}
              </div>
            )
          })}

          {/* {pokemon.abilities.map((ability, key) => {
            return (
              <p key={key}>
                {ability.ability.name}
              </p>
            )
          })} */}
        </div>
      </div>
    </div >
  );
}

export default Pokemon;