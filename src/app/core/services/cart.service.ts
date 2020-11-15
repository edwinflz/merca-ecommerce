import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE } from '@core/tokens/app.tokens';
import { LocalStorage } from '@core/models/local-storage';
import { CartShopping } from '@core/models/cart.interface';
import { ListProducts } from '@core/models/products.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { actions } from '@cart/constants/cart.constants';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartStorage: CartShopping;
  private cartShopping = new BehaviorSubject<CartShopping>({} as CartShopping);
  public idBusiness = 1;
  public nameBusiness = 'Deposito Duques';
  public imgBusiness = 'assets/img/user.jpg';
  public value: number;

  constructor(@Inject(LOCAL_STORAGE) private localStorage: LocalStorage) {}

  public cartShopping$: Observable<
    CartShopping
  > = this.cartShopping.asObservable();

  public total$: Observable<number> = this.cartShopping$.pipe(
    map((cartShopping) => {
      let acum = 0;
      if (!cartShopping.id) {
        return acum;
      }
      cartShopping.products.forEach((product) => {
        acum = acum + product.price * product.quantity;
      });
      return acum;
    })
  );

  public init(): void {
    if (this.localStorage.has(this.getCartId())) {
      this.cartStorage = JSON.parse(localStorage.getItem(this.getCartId()));
      this.cartShopping.next(this.cartStorage);
    }
  }

  public actionCart(product: ListProducts, action: string, value: number): void {
    this.value = value;
    this.localStorage.has(this.getCartId())
      ? this.userHasCart(product, action)
      : this.userHasNotCart(product);
  }

  public getProductsCart(): ListProducts[] {
    if (!this.localStorage.has(this.getCartId())) {
      return [];
    }
    const cartProducts: CartShopping = JSON.parse(
      localStorage.getItem(this.getCartId())
    );
    return cartProducts.products;
  }

  public getProductCart(product: ListProducts, cart: CartShopping): ListProducts {
    const hasProduct = cart.products?.find(
      (item) => product.id === item.id
    );
    return hasProduct;
  }

  public getCartId(): string {
    return `cart-${this.idBusiness}`;
  }

  public userHasCart(item: ListProducts, action: string): void {
    const hasProduct = this.cartStorage.products.find(
      (product) => product.id === item.id
    );
    if (hasProduct) {
      if (action === actions.add) {
        this.incrementQuantity(hasProduct);
      } else {
        this.decrementQuantity(hasProduct);
      }
      this.setCartItem(this.getCartId(), this.cartStorage);
    } else {
      if (action === actions.add) {
        this.cartStorage.products.push(this.buildProduct(item));
        this.setCartItem(this.getCartId(), this.cartStorage);
      }
    }
  }

  public incrementQuantity(hasProduct: ListProducts): void {
    this.cartStorage.products.map((product) => {
      if (product.id === hasProduct.id) {
        hasProduct.quantity += this.value;
      }
    });
  }

  public decrementQuantity(hasProduct: ListProducts): void {
    let remove = false;
    this.cartStorage.products.map((product) => {
      if (product.id === hasProduct.id) {
        hasProduct.quantity -= this.value;
        if (hasProduct.quantity <= 0) {
          remove = true;
        }
      }
    });
    if (remove) {
      this.removeItemFromArr(this.cartStorage.products, hasProduct);
    }
  }

  public removeItemFromArr(
    products: ListProducts[],
    product: ListProducts
  ): void {
    const i = products.indexOf(product);
    if (i !== -1) {
      products.splice(i, 1);
    }
  }

  public userHasNotCart(item: ListProducts): void {
    this.cartStorage = {
      id: this.idBusiness,
      name: this.nameBusiness,
      img: this.imgBusiness,
      products: [this.buildProduct(item)],
    };
    this.setCartItem(this.getCartId(), this.cartStorage);
  }

  public setCartItem(cartId: string, cart: CartShopping): void {
    localStorage.removeItem(this.getCartId());
    localStorage.setItem(cartId, JSON.stringify(cart));
    this.cartShopping.next(cart);
  }

  private buildProduct(product: ListProducts): ListProducts {
    return {
      ...product,
      quantity: this.value,
    };
  }

  public clearCart(): void {
    this.cartStorage = {} as CartShopping;
    this.localStorage.removeItem(this.getCartId());
    this.cartShopping.next(this.cartStorage);
  }
}
