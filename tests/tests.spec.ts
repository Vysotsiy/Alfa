import {expect, test} from "@playwright/test";
import {BasePage, Card} from "../pages/mainPagePo";
import {ShoppingCart} from "../pages/shoppingCartPo";
import {Assertions} from "../helpers/assertions";
import {LoginPagePo} from "../pages/loginPagePo";
import {StateHelper} from "../helpers/stateHelper";
import {ArrayWorker} from "../helpers/arrayWorker";


test.describe('Alfa', () => {
    let basePage: BasePage;
    let shoppingCart: ShoppingCart;
    let assertions: Assertions;
    let loginPage: LoginPagePo;
    let state: StateHelper;
    let arrayWorker: ArrayWorker;

    test.beforeEach(async ({ page}) => {
        basePage = new BasePage(page);
        shoppingCart = new ShoppingCart(page);
        assertions = new Assertions();
        loginPage = new LoginPagePo(page);
        state = new StateHelper();
        arrayWorker = new ArrayWorker();


        await loginPage.login();
        await shoppingCart.shoppingCartClear();
        // await request.post("https://enotes.pointschool.ru/basket/clear");
    });
    test.skip('Тест-кейс 1. Переход в пустую корзину..', async ({ page}) => {
        await shoppingCart.shoppingCartIcon.click();
        await shoppingCart.buttonGoToCart.click();

        //---Поверка перехода в корзину(страница не работает 500)
        expect(page.url()).toContain("/basket");
    });

    test('Тест-кейс 3. Переход в корзину с 1 акционным товаром.', async ({ page}) => {
        const qtyPartsForOrder:string = "1";
        let orderDetails = await basePage.orderItems(true, qtyPartsForOrder);

        await expect(shoppingCart.shoppingCartCountItems).toHaveText(qtyPartsForOrder);

        await shoppingCart.shoppingCartIcon.click();
        const itemPriceInSC: string = await shoppingCart.itemPrice.innerText();
        const totalAmount: string = await shoppingCart.totalAmount.innerText();

        await expect(shoppingCart.itemTitle).toHaveText(orderDetails[0]);
        expect("- "+orderDetails[1]).toContain(itemPriceInSC);
        expect(orderDetails[1].split(' ')[0]).toContain(totalAmount);

        await shoppingCart.buttonGoToCart.click();

        //---Поверка перехода в корзину(страница не работает 500)
        expect(page.url()).toContain("/basket");
    });

    test('Тест-кейс 2. Переход в корзину с 1 неакционным товаром', async ({ page}) => {
        const qtyPartsForOrder:string = "1";
        let orderDetails = await basePage.orderItems(false, qtyPartsForOrder);

        await expect(shoppingCart.shoppingCartCountItems).toHaveText(qtyPartsForOrder);

        await shoppingCart.shoppingCartIcon.click();

        await expect(shoppingCart.itemTitle).toHaveText(orderDetails[0]);
        await expect(shoppingCart.itemPrice).toContainText("- "+orderDetails[1]);
        await expect(shoppingCart.totalAmount).toContainText(orderDetails[1].split(' ')[0]);

        await shoppingCart.buttonGoToCart.click();

        //---Поверка перехода в корзину(страница не работает 500)
        expect(page.url()).toContain("/basket");
    });

    test('Тест-кейс 5. Переход в корзину с 9 акционными товарами одного наименования.', async ({ page}) => {
        const qtyPartsForOrder:string = "8";
        let orderDetails = await basePage.orderItems(true, qtyPartsForOrder, 1);

        await expect(shoppingCart.shoppingCartCountItems).toHaveText(qtyPartsForOrder);

        await shoppingCart.shoppingCartIcon.click();
        const totalAmount: string = await shoppingCart.totalAmount.innerText();

        await expect(shoppingCart.itemTitle).toHaveText(orderDetails[0]);

        const priceOfOneItem: number = Number(orderDetails[1].split(' ')[0]);
        const totalPriceOfOneItem: number = priceOfOneItem * Number(qtyPartsForOrder);

        await expect(shoppingCart.itemPrice).toContainText(String(totalPriceOfOneItem));
        expect(String(totalPriceOfOneItem)).toContain(totalAmount);

        await shoppingCart.buttonGoToCart.click();

        //---Поверка перехода в корзину(страница не работает 500)
        expect(page.url()).toContain("/basket");
    });

    test('Тест-кейс 4. Переход в корзину с 9 разными товарами.', async ({ page}) => {
        const mainOrderData = await basePage.orderAllItems(state);
        const total:number = await arrayWorker.getSummElementForArray(state.getValue("totalAmount"))
        await shoppingCart.shoppingCartIcon.click();
        const shoppingCartOrderItems: Card[] = await shoppingCart.getBucketElementAll();

        await assertions.expectToHaveMembers(mainOrderData, shoppingCartOrderItems);
        // await expect(shoppingCart.totalAmount).toHaveText(String(total));

        await shoppingCart.buttonGoToCart.click();

        //---Поверка перехода в корзину(страница не работает 500)
        expect(page.url()).toContain("/basket");
    });
});
