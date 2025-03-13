import { Injectable } from '@angular/core';
import { POKEMON_LIST } from '../pokemon-list.fake';
import { Pokemon, PokemonList } from '../pokemon.model';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  getPokemonList(): PokemonList {
    return POKEMON_LIST;
  }

  getPokemonById(id: number): Pokemon {
    const pokemon = POKEMON_LIST.find((pokemon) => pokemon.id === id);

    if (!pokemon) {
      throw new Error(`No pokemon found with id ${id}`);
    }

    return pokemon;
  }

  getPokemonTypeList(): string[] {
    return [
      'Plante',
      'Feu',
      'Eau',
      'Insecte',
      'Normal',
      'Electrik',
      'Poison',
      'Fée',
      'Vol',
    ];
  }
}
