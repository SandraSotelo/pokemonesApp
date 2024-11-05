import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home/home.component';
import { AnimationComponent } from './animation/animation/animation.component';

// PrimeNG Imports
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'pokemon', component: AnimationComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AnimationComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    HttpClientModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    ProgressSpinnerModule
  ],
  providers: [
    MessageService,
    // PokemonService, // Incluye PokemonService si es necesario
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }