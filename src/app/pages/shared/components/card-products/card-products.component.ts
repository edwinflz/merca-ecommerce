import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { actions } from '@cart/constants/cart.constants';
import { ListProducts } from '@core/models/products.interface';
import { CartService } from '@core/services/cart.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-card-products',
  templateUrl: './card-products.component.html',
  styleUrls: ['./card-products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardProductsComponent {
  @Input() product: ListProducts;

  public addCart = actions.add;
  public removeCart = actions.remove;

  constructor(private cartService: CartService) {}

  public actionCart(product: ListProducts, action: string): void {
    this.cartService.actionCart(product, action);
  }

  get hasCart$(): Observable<ListProducts> {
    return this.cartService.cartShopping$.pipe(
      map((cart) => {
        const product = cart.products.find(
          (item) => this.product.id === item.id
        );
        return product;
      })
    );
  }
}
