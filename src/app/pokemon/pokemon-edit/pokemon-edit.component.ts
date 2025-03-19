import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { getPokemonColor, POKEMON_RULES } from '../../pokemon.model';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-edit',
  standalone: true,
  imports: [DatePipe, RouterLink, ReactiveFormsModule],
  templateUrl: './pokemon-edit.component.html',
  styleUrls: ['./pokemon-edit.component.css'],
})
export class PokemonEditComponent {
  readonly route = inject(ActivatedRoute);
  readonly pokemonService = inject(PokemonService);
  readonly pokemonId = signal(
    Number(this.route.snapshot.paramMap.get('id'))
  ).asReadonly();
  readonly pokemon = signal(
    this.pokemonService.getPokemonById(this.pokemonId())
  ).asReadonly();

  POKEMON_RULES = POKEMON_RULES;

  readonly form = new FormGroup({
    name: new FormControl(this.pokemon().name, [
      Validators.required,
      Validators.minLength(POKEMON_RULES.MIN_NAME),
      Validators.maxLength(POKEMON_RULES.MAX_NAME),
      Validators.pattern(POKEMON_RULES.NAME_PATTERN),
    ]),
    life: new FormControl(this.pokemon().life),
    damage: new FormControl(this.pokemon().damage),
    types: new FormArray( //pour les array collection, select, checkbox ...
      this.pokemon().types.map((type) => new FormControl(type)),
      [
        Validators.required,
        Validators.minLength(POKEMON_RULES.MIN_TYPES),
        Validators.maxLength(POKEMON_RULES.MAX_TYPES),
      ]
    ),
  });

  /* Pills colors */
  readonly selectedTypes = signal(this.pokemon().types);

  readonly isElectrikSelected = computed(() => {
    const result = this.selectedTypes().includes('Electrik');

    if (result) {
    }
    return result;
  });

  readonly typesColor = computed(() => {
    const colors = this.selectedTypes().reduce(
      (acc: Record<string, { bg: string; text: string }>, type) => {
        if (type) {
          acc[type] = {
            bg: getPokemonColor(type),
            text: type === 'Electrik' ? '#000000' : '#FFFFFF',
          };
        }
        return acc;
      },
      {} as Record<string, { bg: string; text: string }>
    );
    return colors;
  });

  get pokemonTypeList(): FormArray {
    return this.form.get('types') as FormArray;
  }

  get pokemonName(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get pokemonLife(): FormControl {
    return this.form.get('life') as FormControl;
  }

  get pokemonDamage(): FormControl {
    return this.form.get('damage') as FormControl;
  }

  isPokemonTypeSelected(type: string): boolean {
    return !!this.pokemonTypeList.controls.find(
      (control) => control.value === type
    );
  }

  onPokemonTypeChange(type: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.pokemonTypeList.push(new FormControl(type));
    } else {
      const index = this.pokemonTypeList.controls.findIndex(
        (control) => control.value === type
      );
      if (index !== -1) {
        this.pokemonTypeList.removeAt(index);
      }
    }

    const selectedTypes = this.pokemonTypeList.controls.map((c) => c.value);
    this.selectedTypes.set(
      selectedTypes as [string, (string | undefined)?, (string | undefined)?]
    );
  }

  onSubmit() {
    console.log(this.form.value);
  }

  decrementLife() {
    const newValue = this.pokemonLife.value - 1;
    this.pokemonLife.setValue(newValue);
  }

  incrementLife() {
    const newValue = this.pokemonLife.value + 1;
    this.pokemonLife.setValue(newValue);
  }

  decrementDamage() {
    const newValue = this.pokemonDamage.value - 1;
    this.pokemonDamage.setValue(newValue);
  }

  incrementDamage() {
    const newValue = this.pokemonDamage.value + 1;
    this.pokemonDamage.setValue(newValue);
  }
}
