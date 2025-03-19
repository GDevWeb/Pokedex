import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { getPokemonColor } from '../../pokemon.model';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-edit',
  standalone: true,
  imports: [DatePipe, RouterLink, ReactiveFormsModule],
  templateUrl: './pokemon-edit.component.html',
  styles: ``,
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

  readonly form = new FormGroup({
    name: new FormControl(this.pokemon().name),
    life: new FormControl(this.pokemon().life),
    damage: new FormControl(this.pokemon().damage),
    types: new FormArray( //pour les array collection, select, checkbox ...
      this.pokemon().types.map((type) => new FormControl(type))
    ),
  });

  /* Pills colors */
  readonly selectedTypes = signal(this.pokemon().types);

  readonly typesColor = computed(() => {
    const colors = this.selectedTypes().reduce(
      (acc: Record<string, string>, type) => {
        if (type) {
          acc[type] = getPokemonColor(type);
        }
        return acc;
      },
      {} as Record<string, string>
    );
    console.log('Types colors Updated! :', colors);
    return colors;
  });

  get pokemonTypeList(): FormArray {
    return this.form.get('types') as FormArray;
  }

  isPokemonTypeSelected(type: string): boolean {
    return !!this.pokemonTypeList.controls.find(
      (control) => control.value === type
    );
  }

  onPokemonTypeChange(type: string, event: Event) {
    const input = event.target as HTMLInputElement;
    const isChecked = input?.checked;

    if (isChecked) {
      const control = new FormControl(type);
      this.pokemonTypeList.push(control);
    } else {
      const index = this.pokemonTypeList.controls
        .map((control) => control.value)
        .indexOf(type);

      this.pokemonTypeList.removeAt(index);
    }
  }

  onSubmit() {
    console.log(this.form.value);
  }

  decrementLife() {
    const lifeControl = this.form.get('life');
    if (lifeControl) {
      const currentValue = lifeControl.value as number;
      lifeControl.setValue(currentValue - 1);
    }
  }

  incrementLife() {
    const lifeControl = this.form.get('life');
    if (lifeControl) {
      const currentValue = lifeControl.value as number;
      lifeControl.setValue(currentValue + 1);
    }
  }

  decrementDamage() {
    const damageControl = this.form.get('damage');
    if (damageControl) {
      const currentValue = damageControl.value as number;
      damageControl.setValue(currentValue - 1);
    }
  }

  incrementDamage() {
    const damageControl = this.form.get('damage');
    if (damageControl) {
      const currentValue = damageControl.value as number;
      damageControl.setValue(currentValue + 1);
    }
  }
}
