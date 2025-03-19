import { Directive, ElementRef, HostListener, input } from '@angular/core';
import { getPokemonColor } from '../pokemon.model';

@Directive({
  selector: '[appPokemonBorder]',
})
export class PokemonBorderDirective {
  private initialColor: string;
  pokemonType = input.required<string>();

  constructor(private el: ElementRef) {
    this.initialColor =
      this.el.nativeElement.style.borderColor || 'transparent';
    this.el.nativeElement.style.borderWidth = '4px';
    this.el.nativeElement.style.borderStyle = 'solid';
  }

  @HostListener('mouseenter') onMouseEnter() {
    const color = getPokemonColor(this.pokemonType());
    this.setBorder(color);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.setBorder('');
  }

  private setBorder(color: string) {
    this.el.nativeElement.style.borderColor = color;
  }
}
