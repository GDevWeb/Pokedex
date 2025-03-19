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

  readonly isElectrikSelected = computed(() => {
    const result = this.selectedTypes().includes('Electrik');

    if (result) {
    }

    console.log('isElectrikSelected updated:', result); // Vérification
    return result;
  });

  readonly typesColor = computed(() => {
    const colors = this.selectedTypes().reduce(
      (acc: Record<string, { bg: string; text: string }>, type) => {
        if (type) {
          acc[type] = {
            bg: getPokemonColor(type),
            text: type === 'Electrik' ? '#000000' : '#FFFFFF', // Déplace la logique ici
          };
        }
        return acc;
      },
      {} as Record<string, { bg: string; text: string }>
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
