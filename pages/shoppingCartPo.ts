import {expect, Locator, Page} from "@playwright/test";
import {Card} from "./mainPagePo";

export class ShoppingCart {
    private page: Page;

    get shoppingCartIcon(): Locator {
        return this.page.locator(`#dropdownBasket`);
    }

    get shoppingCartCountItems(): Locator {
        return this.page.locator(`span.basket-count-items`);
    }

    private get buttonShoppingCartClear(): Locator {
        return this.page.locator(`a.btn.btn-danger`);
    }

    get shoppingCartItem(): Locator {
        return this.page.locator(`.list-group-item`);
    }
    get itemTitle(): Locator {
        return this.page.locator(`span.basket-item-title`);
    }

    itemTitle_1(card: Locator) {
        return card.locator('span.basket-item-title');
    }

    itemPrice_1(card:Locator): Locator {
        return card.locator(`span.basket-item-price`);
    }

    get itemPrice(): Locator {
        return this.page.locator(`span.basket-item-price`);
    }

    get buttonGoToCart(): Locator {
        return this.page.locator(`//a[contains(text(),'Перейти в корзину')]`);
    }

    get totalAmount(): Locator {
        return this.page.locator(`span.basket_price`);
    }

    constructor(page: Page) {
        this.page = page;
    };

    public async shoppingCartClear(): Promise<void> {
        const qtyItems: string = await this.shoppingCartCountItems.innerText();
        if (qtyItems != "0") {
            await this.shoppingCartIcon.click();
            await this.buttonShoppingCartClear.click();
            await expect(this.shoppingCartCountItems).toHaveText("0");
        }
    }

    public async getBucketElementAll(): Promise<Card[]> {
        await expect(this.shoppingCartItem).toHaveCount(8);

        const elementList: Locator[] =  await this.shoppingCartItem.all();
        const cards: Card[] = [];
        for (const card of elementList) {
            cards.push({
                name: await this.itemTitle_1(card).innerText(),
                price: await this.itemPrice_1(card).innerText(),
            })
        }
        return cards;
    }
}