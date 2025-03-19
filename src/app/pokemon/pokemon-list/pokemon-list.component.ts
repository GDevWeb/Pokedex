import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { PokemonBorderDirective } from '../../directives/pokemon-border.directive';
import { Pokemon } from '../../pokemon.model';
import { PokemonService } from '../../services/pokemon.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pokemon-list',
  imports: [DatePipe, PokemonBorderDirective, DatePipe, RouterLink],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.css',
})
export class PokemonListComponent {
  readonly #pokemonService = inject(PokemonService); //syntaxe moderne
  readonly pokemonList = signal(this.#pokemonService.getPokemonList());
  readonly searchTerm = signal('');

  readonly pokemonListFiltered = computed(() => {
    const searchTerm = this.searchTerm();
    const pokemonList = this.pokemonList();

    return pokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
  });

  size(pokemon: Pokemon) {
    if (pokemon.life <= 15) {
      return 'Petit';
    } else if (pokemon.life >= 25) {
      return 'Grand';
    } else {
      return 'Moyen';
    }
  }

  incrementLife(pokemon: Pokemon): number {
    return (pokemon.life = pokemon.life + 1);
  }

  decrementLife(pokemon: Pokemon): number {
    if (pokemon.life <= 0) {
      return (pokemon.life = 0);
    }
    return (pokemon.life = pokemon.life - 1);
  }
}
