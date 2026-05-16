https://github.com/vlapov/weblarek
# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- .env — `VITE_API_ORIGIN` (базовый URL API и CDN)
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения и код презентера
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

## Данные

В приложении используются две сущности: **товар** и **данные покупателя**. Они описываются интерфейсами TypeScript — контрактами структуры объектов, которые приходят с сервера, хранятся в моделях и передаются в представление.

Для способа оплаты вводится тип **`TPayment`** — объединение литералов, соответствующих выбранному в интерфейсе варианту оплаты и пустой строке, если способ ещё не выбран:

```ts
type TPayment = 'online' | 'offline' | '';
```

### Интерфейс `IProduct`

Описывает **товар** в каталоге: идентификатор, текстовые поля, категорию, ссылку на изображение и цену (для части товаров цена может отсутствовать — тогда используется `null`).

```ts
interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}
```

**Назначение полей:**

- `id: string` — уникальный идентификатор товара; используется для поиска товара в каталоге и корзине, сопоставления карточек с данными.
- `description: string` — подробное описание товара для модального окна с деталями.
- `image: string` — имя файла или относительный путь к изображению.
- `title: string` — заголовок (название) товара для списка и карточки.
- `category: string` — категория товара.
- `price: number | null` — цена в условных единицах; `null`, если цена не задана или товар бесплатный по правилам данных.

### Интерфейс `IBuyer`

Описывает **данные покупателя**, необходимые для оформления заказа: способ оплаты, адрес доставки, контакты.

```ts
interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}
```

**Назначение полей:**

- `payment: TPayment` — выбранный способ оплаты (`'online'`, `'offline'`) или пустая строка, пока пользователь не сделал выбор.
- `email: string` — адрес электронной почты для связи по заказу.
- `phone: string` — телефон покупателя.
- `address: string` — адрес доставки или получения заказа.

### Типы данных для View (DTO)

Презентер готовит объекты для `render()` — отдельные от моделей и API:

- `ICard` — базовые поля карточки (`title`, `price` как строка); используется в `Card<T>`;
- `ICardDisplay` — карточка каталога (`ICard` + `category`, `image`); `productId` передаётся в **конструктор** View, не в `render()`;
- `ICardCatalog`, `ICardBasket`, `ICardPreview` — дополнительные поля для дочерних классов `Card`;
- `ICardPreviewDisplay` — превью товара (+ `description`, `buttonText`, `buttonDisabled`, `buttonAction`);
- `TCardPreviewAction` — `'buy' | 'remove' | 'none'`;
- `ICardBasketDisplay` — строка корзины (`title`, `price`, `index`); `productId` — в конструкторе `CardBasket`;
- `IFormDisplay`, `IOrderFormDisplay`, `IContactsFormDisplay` — формы оформления;
- `IOrderSuccessDisplay` — экран успеха (`total` как строка «Списано … синапсов»).

## Модели данных

**Модели данных** — классы слоя Model, которые инкапсулируют хранение и операции над данными приложения. Они не отвечают за отрисовку DOM: ими пользуется презентер, подписываясь при необходимости на события изменения данных.

Ниже три модели, разделённые по смыслу: каталог доступных товаров, корзина выбранных к покупке товаров и данные покупателя при оформлении заказа.

### Класс `CatalogModel`

**Назначение и зона ответственности:** хранение полного списка товаров, загруженного для главной страницы (каталог), и товара, выбранного пользователем для **подробного отображения** (в модальном окне). Отвечает только за данные каталога и «текущей» карточки для просмотра, не за корзину и не за контакты покупателя.

**Конструктор:**  
`constructor(events: IEvents)` — принимает брокер событий; начальное состояние: пустой массив товаров, товар для подробного просмотра не задан.

**Поля класса:**

- `items: IProduct[]` — массив всех товаров каталога, полученных с сервера или из другого источника данных; используется для отрисовки списка на главной.
- `preview: IProduct | null` — товар, выбранный для детального просмотра; `null`, если детальная карточка не открыта или сброшена.

**Методы класса:**

- `setItems(items: IProduct[]): void` — сохраняет в модели массив товаров, переданный в параметре `items` (заменяет предыдущий каталог); генерирует событие `items:changed` (без payload; данные — через `getItems()`).
- `getItems(): IProduct[]` — возвращает копию или ссылку на массив всех товаров каталога; тип возвращаемого значения: `IProduct[]`.
- `getProduct(id: string): IProduct | undefined` — возвращает товар с идентификатором `id`, если он есть в каталоге; иначе `undefined`. Параметр: `id: string`. Возвращаемый тип: `IProduct | undefined`.
- `setPreview(product: IProduct): void` — сохраняет товар для подробного отображения; генерирует событие `preview:changed` (данные — через `getPreview()`).
- `getPreview(): IProduct | null` — возвращает товар для подробного отображения или `null`; тип: `IProduct | null`.

### Класс `CartModel`

**Назначение и зона ответственности:** хранение только тех товаров, которые пользователь **добавил в корзину** для последующей покупки. Не дублирует логику каталога (полный список с сервера хранит `CatalogModel`).

**Конструктор:**  
`constructor(events: IEvents)` — принимает брокер событий; изначально корзина пуста.

**Поля класса:**

- `items: IProduct[]` — массив товаров в корзине.

**Методы класса:**

- `getItems(): IProduct[]` — возвращает товары в корзине; тип: `IProduct[]`.
- `add(product: IProduct): void` — добавляет в корзину товар из параметра `product: IProduct`; генерирует событие `cart:changed` (данные — через `getItems()` и др.).
- `remove(product: IProduct): void` — удаляет из корзины переданный товар; параметр: `product: IProduct`; генерирует `cart:changed`.
- `clear(): void` — удаляет все товары из корзины; генерирует `cart:changed`.
- `getTotal(): number` — возвращает сумму полей `price` всех товаров в корзине; тип возвращаемого значения: `number`.
- `getCount(): number` — возвращает количество позиций (или единиц товаров) в корзине; тип: `number`.
- `hasProduct(id: string): boolean` — проверяет наличие в корзине товара с идентификатором `id`; параметр: `id: string`; возвращает `true` или `false`.

### Класс `BuyerModel`

**Назначение и зона ответственности:** хранение **данных покупателя** (`IBuyer`), валидация перед отправкой заказа. Не хранит товары.

**Конструктор:**  
`constructor(events: IEvents)` — принимает брокер событий; данные покупателя инициализируются пустыми значениями (`payment: ''`, остальные строки — `''`), чтобы можно было поэтапно заполнять форму.

**Поля класса:**

- `buyer: IBuyer` — объект с полями `payment`, `email`, `phone`, `address`.

**Методы класса:**

- `setData(data: Partial<IBuyer>): void` — сохраняет в модели только те поля из объекта `data`, которые переданы (тип `Partial<IBuyer>`); остальные поля **не сбрасываются**; генерирует событие `buyer:changed` (данные — через `getData()`).
- `getData(): IBuyer` — возвращает полный список данных покупателя; тип: `IBuyer`.
- `clear(): void` — сбрасывает все поля к начальному пустому состоянию; генерирует `buyer:changed`.
- `validate(): IBuyerValidationErrors` — проверяет данные по функциональным требованиям: поле считается валидным, если оно **не пустое** (для `payment` — пустая строка `''` трактуется как «не выбрано» и невалидно). Метод возвращает объект ошибок валидации с ключами из полей `IBuyer`; для **невалидных** полей значение — **текст ошибки** (строка), для валидных полей свойство в объекте **отсутствует**. Тип объекта вынесен в именованный алиас `IBuyerValidationErrors`.

```ts
{
  payment: 'Не выбран вид оплаты',
  email: 'Укажите емэйл',
}
```

В этом примере телефон и адрес прошли проверку (ключей нет), а по оплате и email сообщены ошибки.

### Сводка событий Model → Presenter

| Событие | Источник | Когда генерируется | Как презентер получает данные |
|---------|----------|-------------------|------------------------------|
| `items:changed` | `CatalogModel` | `setItems` | `getItems()`, `getProduct(id)` |
| `preview:changed` | `CatalogModel` | `setPreview` | `getPreview()` |
| `cart:changed` | `CartModel` | `add`, `remove`, `clear` | `getItems()`, `getCount()`, `getTotal()`, `hasProduct(id)` |
| `buyer:changed` | `BuyerModel` | `setData`, `clear` | `getData()`, `validate()` |

События моделей **не передают payload** — только сигнализируют об изменении. Актуальные данные презентер читает методами модели.

Методы чтения (`getItems`, `getProduct`, `getCount`, `validate` и т.д.) событий **не** генерируют.

## Презентер

**Презентер** — слой логики приложения на единственной странице. Код презентера расположен в `src/main.ts` (отдельный класс не обязателен).

**Зона ответственности:**

- подписка на события моделей и представлений;
- вызов методов моделей для изменения данных;
- подготовка данных для `render()` компонентов View (форматирование цен, URL изображений, состояние кнопок);
- открытие модальных окон с нужным содержимым.

**Правила:**

- презентер **обрабатывает** события и **не генерирует** их (`events.emit` в `main.ts` не используется);
- после вызова метода сохранения в модели **не** вызывается немедленный `render()` View — обновление интерфейса идёт по событию модели (`items:changed`, `cart:changed` и т.д.); данные для View берутся из модели через `getItems()`, `getData()` и т.п., а не из payload события;
- `render()` вызывается при изменении данных модели (`renderBasket()` по `cart:changed`, формы по `buyer:changed` и т.д.); `modal.open()` — при показе модалки; `openBasket()` не перерисовывает корзину — только вставляет уже обновлённый узел `Basket`;
- переменная `modalView` (`'basket' | 'preview' | 'order' | 'contacts' | 'success' | null`) хранит, какой экран сейчас в модалке; `closeModal()` вызывает `modal.close()` и сбрасывает `modalView` (состояние не читается из DOM);
- кнопки «Далее» и «Оплатить» активны только при валидных данных (`valid` в форме); повторная валидация при `order:submit` / `contacts:submit` не выполняется; ошибка API при оплате показывается в форме контактов.

**Инициализация в `main.ts`:**

1. `EventEmitter`, модели (`CatalogModel`, `CartModel`, `BuyerModel`), `WebLarekApi`.
2. Экземпляры View (`Header`, `Gallery`, `Modal`, `CardPreview`, `Basket`, `Order`, `Contacts`, `OrderSuccess`).
3. Запрос `webLarekApi.getProductList()` → `catalogModel.setItems()` (каталог рисуется по `items:changed`).
4. Обработчики всех событий из таблиц ниже.

**Основные сценарии:**

| Действие пользователя | Событие View | Действие презентера | Обновление UI |
|----------------------|--------------|---------------------|---------------|
| Загрузка страницы | — | `getProductList` → `setItems` | `items:changed` → галерея |
| Клик по карточке каталога | `card:select` | `setPreview(product)` | `preview:changed` → модалка превью |
| «Купить» | `card:buy` | `cartModel.add`, `closeModal()` | `cart:changed` → счётчик, `renderBasket()` |
| «Удалить» (превью) | `card:remove` | `cartModel.remove`, `closeModal` | `cart:changed` → `renderHeader()`, `renderBasket()` |
| «Удалить» (корзина) | `card:remove` | `cartModel.remove` | `cart:changed` → `renderHeader()`, `renderBasket()` |
| Иконка корзины | `basket:open` | `openBasket()` | показ модалки с уже отрендеренной корзиной |
| «Оформить» | `basket:order` | `openOrder()` | модалка заказа |
| Форма заказа | `order:payment`, `order:address` | `buyerModel.setData` | `buyer:changed` → форма |
| «Далее» | `order:submit` | `openContacts()` | форма контактов |
| Контакты | `contacts:change` | `buyerModel.setData` | `buyer:changed` → форма |
| «Оплатить» | `contacts:submit` | `createOrder` → `clear` → успех | модалка успеха |
| «За новыми покупками!» | `order:success-close` | `closeModal()` | — |
| Закрыть модалку (крестик / оверлей) | `modal:close` | `closeModal()` | — |

**Дополнительно в презентере:** проверка `!cartModel.hasProduct(id)` перед `add`; при ошибке `createOrder` — текст ошибки сервера (класс `Api` отклоняет промис строкой из поля `error` ответа) показывается в форме `Contacts`; экземпляры `Order` / `Contacts` / `OrderSuccess` / `CardPreview` / `Basket` создаются один раз; `renderBasket()` — по `cart:changed` (список `CardBasket`, итог, кнопка); `openBasket()` — только `modal.open()` без перерисовки; при смене товара в превью — `setProductId()` и `render()`.

## Слой коммуникации

Слой коммуникации отвечает за взаимодействие приложения с API сервера «Веб-ларёк».  
Класс этого слоя использует композицию: принимает экземпляр, реализующий интерфейс `IApi`, и делегирует ему выполнение HTTP-запросов через методы `get` и `post`.

### Класс `WebLarekApi`

**Назначение и зона ответственности:** инкапсулирует запросы к серверу, связанные с получением списка товаров и отправкой данных заказа. Класс не хранит состояние пользовательского интерфейса и не зависит от DOM.

**Конструктор:**  
`constructor(api: IApi)` — принимает объект, реализующий интерфейс `IApi` (например, экземпляр класса `Api` из стартового кода).

**Поля класса:**

- `api: IApi` — ссылка на объект API-клиента, через который выполняются все сетевые запросы.

**Методы класса:**

- `getProductList(): Promise<IProductListResponse>` — выполняет `GET` запрос на эндпоинт `/product/` и возвращает объект с массивом товаров.
- `createOrder(order: IOrderRequest): Promise<IOrderResponse>` — выполняет `POST` запрос на эндпоинт `/order/`, отправляет данные заказа из параметра `order` и возвращает объект, подтверждающий успешную покупку и итоговую сумму.

**Типы данных коммуникационного слоя:**

- `IProductListResponse` — объект ответа `GET /product/` с полями `total: number` и `items: IProduct[]`.
- `IOrderRequest` — объект запроса `POST /order/`: `payment`, `email`, `phone`, `address`, `total`, `items: string[]` (массив `id` товаров).
- `IOrderResponse` — объект успешного ответа `POST /order/` с полями `id: string` и `total: number`.
- `IApiErrorResponse` — объект ошибочного ответа сервера с полем `error: string` (например, «Не указан адрес», «Неверная сумма заказа»).

## Слой представления (View)

**Слой представления** — классы, отвечающие за отображение разметки и реакцию на действия пользователя. Все классы View наследуют базовый `Component<T>` и используют паттерн с **сеттерами**: данные передаются в метод `render(data?)`, после чего через `Object.assign` вызываются сеттеры и обновляется DOM.

Общие правила слоя:

- каждый класс View отвечает **только за свой блок** разметки (шапка, каталог, карточка, форма и т.д.);
- классы View **не обращаются к моделям и API** — при действии пользователя генерируется **событие**, которое обрабатывает презентер;
- для связи с презентером используется брокер событий `IEvents` (`EventEmitter`), передаваемый в конструктор компонента;
- данные для отображения (подписи цен, состояние кнопок, списки DOM-элементов) презентер готовит сам и передаёт в `render`.

Классы View располагаются в каталоге `src/components/views/`.

### Иерархия компонентов

```
Component
├── Header
├── Gallery
├── Modal
├── Basket
├── OrderSuccess
├── Card                    ← общий родитель карточек товара
│   ├── CardCatalog         ← template #card-catalog
│   ├── CardPreview         ← template #card-preview
│   └── CardBasket          ← template #card-basket
└── Form                    ← общий родитель форм
    ├── Order               ← template #order
    └── Contacts            ← template #contacts
```

**Важно:** класс `Modal` — **самостоятельная оболочка**. От него **не наследуются** другие классы. Содержимое модального окна (`CardPreview`, `Basket`, `Order`, `Contacts`, `OrderSuccess`) — отдельные компоненты; презентер вставляет их корневой элемент в `.modal__content`.

---

### Класс `Header`

**Назначение:** шапка сайта — логотип и кнопка корзины со счётчиком товаров.  
**Разметка:** блок `.header` в `index.html`.

**Конструктор:**  
`constructor(protected events: IEvents, container: HTMLElement)` — принимает брокер событий и корневой элемент `.header`.

**Поля класса:**

- `protected basketButton: HTMLButtonElement` — кнопка `.header__basket`;
- `protected counterElement: HTMLElement` — элемент `.header__basket-counter`.

**Методы и сеттеры:**

- `set counter(value: number): void` — обновляет текст счётчика на кнопке корзины.

**События (генерирует View):**

- `basket:open` — клик по кнопке корзины.

---

### Класс `Gallery`

**Назначение:** контейнер каталога на главной странице — вывод списка карточек товаров.  
**Разметка:** `<main class="gallery">`.

**Конструктор:**  
`constructor(container: HTMLElement)` — принимает элемент `main.gallery`.

**Поля класса:**

- `protected catalogElement: HTMLElement` — тот же контейнер, в который вставляются карточки.

**Методы и сеттеры:**

- `set catalog(items: HTMLElement[]): void` — заменяет содержимое каталога массивом уже отрендеренных карточек (`CardCatalog.render()`), например через `replaceChildren(...items)`.

**Тип данных для `render`:** `{ catalog: HTMLElement[] }`.

**События:** не генерирует (клики обрабатываются на уровне `CardCatalog`).

---

### Класс `Modal`

**Назначение:** единая модальная оболочка — показ/скрытие оверлея, закрытие, вставка произвольного контента.  
**Разметка:** `#modal-container` (`.modal`, `.modal__close`, `.modal__content`).

**Интерфейс `IModal`:** `{ content: HTMLElement }` — данные для сеттера контента.

**Конструктор:**  
`constructor(protected events: IEvents, container: HTMLElement)` — корневой элемент `#modal-container` или `.modal`.

**Поля класса:**

- `protected contentElement: HTMLElement` — `.modal__content`, куда вставляется содержимое;
- `protected closeButton: HTMLButtonElement` — кнопка `.modal__close`.

**Методы и сеттеры:**

- `set content(value: HTMLElement): void` — вставляет узел в `.modal__content` (`replaceChildren`);
- `open(node: HTMLElement): void` — `render({ content: node })`, добавляет класс `modal_active`;
- `close(): void` — скрывает модалку, очищает `.modal__content`;
- `render(): HTMLElement` — возвращает корневой элемент модалки (без данных для отображения).

**События (генерирует View):**

- `modal:close` — клик по кнопке «закрыть» или по области вне контента (оверлей), согласно функциональным требованиям.

**Ограничение:** от класса `Modal` **не наследуются** компоненты с разметкой форм и карточек.

---

### Класс `Card` (базовый)

**Назначение:** общая логика карточки — заголовок и цена (поля, общие для всех шаблонов карточек).  
**Родитель для:** `CardCatalog`, `CardPreview`, `CardBasket`.

**Интерфейс `ICard`:** `{ title: string; price: string }` — поля базовых сеттеров. Идентификатор товара **не** хранится в DOM (`data-id` не используется); презентер передаёт `productId` в конструктор карточки.

**Дженерик:** `Card<T extends object = object> extends Component<ICard & T>` — дочерние классы передают только **дополнительные** поля; общие поля карточки наследуются через `ICard`.

**Конструктор:**  
`constructor(container: HTMLElement)` — корневой элемент клона соответствующего `<template>`.

**Поля класса:**

- `protected titleElement: HTMLElement` — `.card__title`;
- `protected priceElement: HTMLElement` — `.card__price`.

**Методы и сеттеры:**

- `set title(value: string): void` — заголовок товара;
- `set price(value: string): void` — цена (строка из презентера: «750 синапсов», «Бесценно»).

Категория и изображение — только в `CardCatalog` / `CardPreview` (в `#card-basket` этих блоков нет).

---

### Класс `CardCatalog`

**Назначение:** карточка товара в каталоге на главной странице.  
**Разметка:** `<template id="card-catalog">` → `button.gallery__item.card`.

**Конструктор:**  
`constructor(container: HTMLElement, events: IEvents, productId: string)` — `productId` для события `card:select`; клик по карточке → `{ id: productId }`.

**Поля класса (дополнительно):**

- `protected categoryElement: HTMLElement` — `.card__category`;
- `protected imageElement: HTMLImageElement` — `.card__image`.

**Методы и сеттеры (дополнительно):**

- `set category(value: string): void` — текст и модификатор класса по `categoryMap`;
- `set image(value: { src: string; alt: string }): void` — `src` и `alt` из презентера (не из разметки), через `setImage()` из `Component`;
- `setProductId(id: string): void` — обновляет `productId` для событий (используется в `CardPreview` при смене товара).

**События (генерирует View):**

- `card:select` — клик по карточке; payload: `{ id: string }`.

---

### Класс `CardPreview`

**Назначение:** детальная карточка товара в модальном окне.  
**Разметка:** `<template id="card-preview">` → `.card.card_full`.

**Конструктор:**  
`constructor(container: HTMLElement, events: IEvents, productId: string)` — наследует `CardCatalog`; экземпляр в презентере один; перед `render()` вызывается `setProductId()` из `CardCatalog`. Кнопка эмитит `card:buy` или `card:remove` с актуальным `productId`.

**Поля класса (дополнительно):**

- `protected textElement: HTMLElement` — `.card__text` (описание);
- `protected buttonElement: HTMLButtonElement` — `.card__button`.

**Методы и сеттеры (дополнительно):**

- `set description(value: string): void` — текст описания;
- `set buttonText(value: string): void` — подпись кнопки («Купить», «Удалить из корзины», «Недоступно»);
- `set buttonDisabled(value: boolean): void` — блокировка кнопки (для товара без цены);
- `set buttonAction(value: TCardPreviewAction): void` — `'buy' | 'remove' | 'none'`, определяет событие кнопки.

**События (генерирует View):**

- `card:buy` — клик по кнопке «Купить»; payload: `id: string`;
- `card:remove` — клик по кнопке «Удалить из корзины»; payload: `id: string`.

---

### Класс `CardBasket`

**Назначение:** строка товара в списке корзины.  
**Разметка:** `<template id="card-basket">` → `li.basket__item`.

**Конструктор:**  
`constructor(container: HTMLElement, events: IEvents, productId: string)` — кнопка удаления эмитит `card:remove` с `{ id: productId }`.

**Поля класса (дополнительно):**

- `protected indexElement: HTMLElement` — `.basket__item-index`;
- `protected deleteButton: HTMLButtonElement` — `.basket__item-delete`.

**Методы и сеттеры (дополнительно):**

- `set index(value: number): void` — порядковый номер в списке.

**События (генерирует View):**

- `card:remove` — клик по кнопке удаления; payload: `id: string`.

---

### Класс `Form` (базовый)

**Назначение:** общая логика форм оформления заказа — ошибки валидации и состояние кнопки отправки.  
**Родитель для:** `Order`, `Contacts`.  
**Разметка:** корень `<form class="form">` в шаблонах `#order` и `#contacts`.

**Конструктор:**  
`constructor(protected events: IEvents, container: HTMLFormElement)`.

**Поля класса (общие):**

- `protected errorsElement: HTMLElement` — `.form__errors`;
- `protected submitButton: HTMLButtonElement` — кнопка `submit` в `.modal__actions`.

**Методы и сеттеры (общие):**

- `set errors(value: string): void` — текст ошибки (пустая строка — скрыть);
- `set valid(value: boolean): void` — включает/отключает кнопку отправки (`disabled`).

**События:** конкретные имена задают наследники (`order:submit`, `contacts:submit`).

---

### Класс `Order`

**Назначение:** первый шаг оформления — способ оплаты и адрес доставки.  
**Разметка:** `<template id="order">`, форма `name="order"`.

**Поля класса (дополнительно):**

- `protected paymentCardButton: HTMLButtonElement` — кнопка «Онлайн» (`name="card"`);
- `protected paymentCashButton: HTMLButtonElement` — кнопка «При получении» (`name="cash"`);
- `protected addressInput: HTMLInputElement` — поле `name="address"`.

**Методы и сеттеры (дополнительно):**

- `set payment(value: TPayment): void` — класс `button_alt-active` на выбранной кнопке (`'online'` → `name="card"`, `'offline'` → `name="cash"`);
- `set address(value: string): void` — значение поля адреса.

**События (генерирует View):**

- `order:payment` — клик «Онлайн» / «При получении»; payload: `{ payment: 'online' | 'offline' }` (кнопки в HTML: `card` / `cash`);
- `order:address` — ввод в поле адреса; payload: `{ address: string }`;
- `order:submit` — кнопка «Далее»; без payload; презентер открывает форму контактов (ошибки и `valid` — по `buyer:changed`).

---

### Класс `Contacts`

**Назначение:** второй шаг оформления — email и телефон покупателя.  
**Разметка:** `<template id="contacts">`, форма `name="contacts"`.

**Поля класса (дополнительно):**

- `protected emailInput: HTMLInputElement` — поле `name="email"`;
- `protected phoneInput: HTMLInputElement` — поле `name="phone"`.

**Методы и сеттеры (дополнительно):**

- `set email(value: string): void`, `set phone(value: string): void` — синхронизация полей при `render`.

**События (генерирует View):**

- `contacts:change` — ввод email или телефона; payload: `{ email?: string; phone?: string }`;
- `contacts:submit` — кнопка «Оплатить»; без payload.

---

### Класс `Basket`

**Назначение:** модальное содержимое корзины — список товаров, итог, кнопка оформления.  
**Разметка:** `<template id="basket">`.

**Конструктор:**  
`constructor(protected events: IEvents, container: HTMLElement)` — один экземпляр в презентере; `renderBasket()` по `cart:changed`, `openBasket()` только показывает модалку.

**Поля класса:**

- `protected listElement: HTMLElement` — `.basket__list`;
- `protected totalElement: HTMLElement` — `.basket__price`;
- `protected orderButton: HTMLButtonElement` — `.basket__button`.

**Методы и сеттеры:**

- `set items(nodes: HTMLElement[]): void` — `replaceChildren` списка карточек `CardBasket`;
- `set total(value: string): void` — итоговая сумма («153 250 синапсов»);
- `set orderEnabled(value: boolean): void` — активность кнопки «Оформить».

Пустая корзина: текст «Корзина пуста» через CSS (`.basket__list:not(:has(> *))::before` в `basket.scss`), отдельного сеттера нет.

**События (генерирует View):**

- `basket:order` — клик по «Оформить».

---

### Класс `OrderSuccess`

**Назначение:** экран успешного оформления заказа.  
**Разметка:** `<template id="success">` → `.order-success`.

**Конструктор:**  
`constructor(protected events: IEvents, container: HTMLElement)`.

**Поля класса:**

- `protected descriptionElement: HTMLElement` — `.order-success__description`;
- `protected closeButton: HTMLButtonElement` — `.order-success__close`.

**Методы и сеттеры:**

- `set total(value: string): void` — текст «Списано … синапсов».

**События (генерирует View):**

- `order:success-close` — клик по «За новыми покупками!».

---

### Сводка событий View → Presenter

События моделей — в разделе [Сводка событий Model → Presenter](#сводка-событий-model--presenter).

| Событие | Источник | Назначение для презентера |
|---------|----------|---------------------------|
| `basket:open` | `Header` | открыть модалку корзины |
| `card:select` | `CardCatalog` | открыть превью товара |
| `card:buy` | `CardPreview` | добавить в корзину, закрыть модалку |
| `card:remove` | `CardPreview`, `CardBasket` | удалить из корзины; из превью — закрыть модалку |
| `basket:order` | `Basket` | открыть форму оформления (шаг 1) |
| `order:payment` | `Order` | сохранить способ оплаты |
| `order:address` | `Order` | сохранить адрес |
| `order:submit` | `Order` | перейти к шагу 2 |
| `contacts:change` | `Contacts` | сохранить контакты |
| `contacts:submit` | `Contacts` | отправить заказ на сервер |
| `modal:close` | `Modal` | закрыть модальное окно |
| `order:success-close` | `OrderSuccess` | закрыть успех, сброс UI |

После изменения данных в моделях презентер обновляет View (например, `renderHeader()`, `renderCatalog()`, `renderBasket()`) и **не изменяет** классы моделей под нужды представления.