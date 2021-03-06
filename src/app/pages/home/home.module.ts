import { InjectionToken, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SharedModule } from '@shared/shared.module';

import { HomeRoutingModule } from '@home/home-routing.module';
import { HomeContainerComponent } from '@app/pages/home/components/home-container/home-container.container';
import { SlideCarouselComponent } from '@home/components/slide-carousel/slide-carousel.component';
import { homeFeatureName, HomeState } from '@home/store/state/home.state';
import { homeRootReducer } from '@home/store/reducers';
import { HomeEffects } from '@home/store/effects/home.effects';
import { HomeFacade } from '@home/home.facade';
import { HomeItemComponent } from './components/home-item/home-item.component';

export const FEATURE_REDUCER_TOKEN = new InjectionToken<
  ActionReducerMap<HomeState>
>('Feature Reducers');

@NgModule({
  declarations: [
    HomeContainerComponent,
    SlideCarouselComponent,
    HomeItemComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    StoreModule.forFeature(homeFeatureName, FEATURE_REDUCER_TOKEN),
    EffectsModule.forFeature([HomeEffects]),
    SharedModule,
  ],
  providers: [
    HomeFacade,
    {
      provide: FEATURE_REDUCER_TOKEN,
      useValue: homeRootReducer,
    },
  ],
})
export class HomeModule {}
