import { Injectable } from '@angular/core';
import { Recipe } from './recipes.model';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  private recipes: Recipe[] = [
    {
      id: '01',
      title: 'Normal Rice',
      detail: 'loren ipsum et man er frugt as ester',
      imageUrl:
        'https://proxy.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.maangchi.com' +
        '%2Fwp-content%2Fuploads%2F2010%2F10%2Frice_steamed.jpg&f=1',
      ingredients: ['Rice', 'Salad', 'Oil', 'Garlic']
    },
    {
      id: '02',
      title: 'Pudding Rice',
      detail:
        'Classic, creamy rice pudding! Boiled rice with milk, cream, egg, brown sugar, cinnamon, vanilla, and raisins.',
      imageUrl:
        'https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.simplyrecipes.com' +
        '%2Fwp-content%2Fuploads%2F2008%2F04%2Frice-pudding-horiz-a-1600.jpg&f=1',
      ingredients: ['Milk', 'Sugar', 'Rice', 'Pinch of Salt', 'Cinnamon']
    }
  ];

  constructor() {}

  getAllRecipes() {
    return [...this.recipes];
  }

  getRecipe(recipeId: string) {
    return this.recipes.find(recipe => recipe.id === recipeId);
  }

  deleteRecipe(recipeId: string) {
    this.recipes = this.recipes.filter(recipe => recipe.id !== recipeId);
  }
}
