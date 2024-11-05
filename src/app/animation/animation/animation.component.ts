import { Component, Renderer2, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { PokemonService } from '../../service/pokemon.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-animation',
  templateUrl: './animation.component.html',
  styleUrls: ['./animation.component.scss'],
  providers: [MessageService]
})
export class AnimationComponent implements OnDestroy {
updateName($event: Event) {
throw new Error('Method not implemented.');
}
  pokemonNameOrId = new BehaviorSubject<string>('');
  loading$ = new BehaviorSubject<boolean>(false);
  pokemonData$ = new BehaviorSubject<any>(null);
  currentSprite$ = new BehaviorSubject<string>('');
  @ViewChild('pokemonImage', { static: false }) pokemonImage!: ElementRef;
  
  private rotationDegree = 0;
  private animationSubscription: Subscription | null = null;
  private frontSprite: string = '';
  private backSprite: string = '';

  constructor(
    private pokemonService: PokemonService,
    private renderer: Renderer2,
    private messageService: MessageService
  ) {}

  ngOnDestroy() {
    this.stopAnimation();
  }

  loadPokemon() {
    const nameOrId = this.pokemonNameOrId.getValue();
    if (nameOrId) {
      this.stopAnimation();
      this.loading$.next(true);
      this.pokemonService.getPokemon(nameOrId).subscribe({
        next: (pokemon) => {
          if (!pokemon.sprites.front_default || !pokemon.sprites.back_default) {
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Error', 
              detail: 'Este Pokémon no tiene sprites disponibles' 
            });
            this.loading$.next(false);
            return;
          }
          
          this.pokemonData$.next(pokemon);
          this.frontSprite = pokemon.sprites.front_default;
          this.backSprite = pokemon.sprites.back_default;
          this.currentSprite$.next(this.frontSprite);
          this.startAnimation();
          this.loading$.next(false);
        },
        error: (error) => {
          console.error('Error al cargar el Pokémon:', error);
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'Nombre o ID de Pokémon no válido' 
          });
          this.loading$.next(false);
        }
      });
    } else {
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Advertencia', 
        detail: 'Escriba un nombre o ID para cargar' 
      });
    }
  }

  startAnimation() {
    this.rotationDegree = 0;
    this.animationSubscription = interval(100).subscribe(() => {
      this.rotationDegree = (this.rotationDegree + 5) % 360;
      
      if (this.rotationDegree < 90 || this.rotationDegree >= 270) {
        this.currentSprite$.next(this.frontSprite);
      } else if (this.rotationDegree >= 90 && this.rotationDegree < 270) {
        this.currentSprite$.next(this.backSprite);
      }

     if (this.pokemonImage?.nativeElement) {
        this.renderer.setStyle(
          this.pokemonImage.nativeElement,
          'transform',
         `rotateY(${this.rotationDegree}deg)`
        );
      }
    });
  }

  stopAnimation() {
    if (this.animationSubscription) {
      this.animationSubscription.unsubscribe();
      this.animationSubscription = null;
    }
  }
}