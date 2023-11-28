import {expect, Locator, Page} from "@playwright/test";
import {StateHelper} from "../helpers/stateHelper";

export class BasePage {
    private page: Page;

    private notebookWithDiscount(index: number): Locator {
        return this.page.locator('.note-item.hasDiscount').nth(index - 1);
    }

    private notebookWithoutDiscountList(index: number): Locator {
        return this.page.locator('.note-item:not(.hasDiscount)').nth(index - 1);
    }

     allNotebookItems():Locator {
        return this.page.locator(".note-item:not([data-product=''])");
    }

    private inputCountOrder(cartElement: Locator): Locator {
        return cartElement.locator('input')
    }

    private buttonOrder(cartElement: Locator): Locator {
        return cartElement.locator('button')
    }

    productName(cartElement: Locator): Locator {
        return cartElement.locator('div.product_name')
    }

    priceItem(cartElement: Locator): Locator {
        return cartElement.locator('span.product_price')
    }

    constructor(page: Page) {
        this.page = page;
    };

    public async orderItems(hasDiscount: boolean, count: string, index = 2) {
        const card = hasDiscount ? this.notebookWithDiscount(index) : this.notebookWithoutDiscountList(index);
        const fillField = this.inputCountOrder(card);

        let orderDetails: string[] = [];
        const productName: string = await this.productName(card).innerText();
        const priceItem: string = await this.priceItem(card).innerText();
        orderDetails.push(productName); //--- 0
        orderDetails.push(priceItem); //---1

        await fillField.clear();
        await fillField.pressSequentially(count, {delay: 100});
        await this.buttonOrder(card).click();

        return orderDetails
    }

    public  async  orderAllItems(state:StateHelper): Promise<Card[]> {
        await expect(this.allNotebookItems()).toHaveCount(8);
       const elementList: Locator[] =  await this.allNotebookItems().all();
       const cards: Card[] = [];
       const totalAmount:String[] = [];

       for (const card of elementList) {
           await this.buttonOrder(card).click();

           totalAmount.push((await this.priceItem(card).innerText()).split(" ")[0]);

           cards.push({
               name: await this.productName(card).innerText(),
               price: `- ${(await this.priceItem(card).innerText()).split(' ')[0]} р.`,
           })
       }
       state.setValue("totalAmount", totalAmount);
       return cards;
    }
}

export interface Card {
    name: string;
    price: string;
}



