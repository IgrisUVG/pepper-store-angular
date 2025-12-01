# Контекст современной веб-разработки
Прямо сейчас все меняется:
- React перешел на версию 19
  - memo, useMemo, useCallback больше не используются явно (нет необходимости это делать) потому что они включены в React Compiler. Использовать их явно стоит только в редких случаях
- React Router перешел на версию 7
  - Основной метод разработки стал не Declarative, а Data (или даже Framework), это значит, что роуты объявляются вне дерева
- В разработке на React Native больше не рекомендуется работать без фреймворка, поэтому основной интрумент это Expo
- Angular переходит на:
  - сигналы как основной инструмент для работы с данными
  - версию 21, в которой обновляется синтаксис шаблонов

# Подытоживаем, что нужно для работы с формами (в любом фреймворке на примере Template-driven ангуляра)
1. Объект с данными (Объект, JS, который хранит исходную информацию)
```ts
@Component({})
class Form {
  // 1. Объявляем объект с данными
  credentials = {
    username = "",
    email = "",
  }
}
```

2. Способ отобразить данные в шаблоне
3. Синхронизировать обновление данных из шаблона с исходным объектом данных
```ts
@Component({
  // 1. Подключаем встроенную синхронизацию
  imports: [FormsModule],
  // 2. Данные закидываем в шаблон
  template: `<form #loginForm="ngForm">
    <input type="text" [value]="credentials.username" (change)="onUsernameChange($event)" name="username">
    <input type="email" [(ngModel)]="credentials.email" name="email">
  </form>`,
  // *[(ngModel)] обеспечивает двустороннюю связь:
  // - когда меняется объект credentials данные попадают в input
  // - когда меняется input данные попадают в объект credentials
  // фактически, директива [(ngMode)] заменяет связку правил [value]="" и (change)=""
})
class Form {
  credentials = {
    username = "",
    email = "",
  }

  onUsernameChange(event) {
    event.preventDefault();
    this.credentials.username = event.target.value;
  }
}
```

4. Проверить, есть ли ошибки в данных, если есть отоборазить
```ts
@Component({
  imports: [FormsModule],
  // 1. Добавить HTML-свойства описывающие требования к полям
  template: `<form #loginForm="ngForm">
    <input type="text" [value]="credentials.username" (change)="onUsernameChange($event)" name="username" required maxlength="50">
    <input type="email" [(ngModel)]="credentials.email" name="email" required>
  </form>`,
})
class Form {
  credentials = {
    username = "",
    email = "",
  }

  onUsernameChange(event) {
    event.preventDefault();
    this.credentials.username = event.target.value;
  }
}
```

5. Отправить форму

# Сигналы
Сигналы — это основной инструмент подхода к работе с данными, который называется "реактивным". Реактивный подход к работе с данными заключается в том, что по всем ссылкам всегда (даже если это ссылки, например, в DOM) хранятся актуальные значения
данных и все данные, зависящие от этих значений тоже актуальны.

Пример нереактивных данных:

```ts
function getMaxBPM(age: number) {
  return 220 - age;
}

class Person {
  _age: number = 21
  maxBPM: number = getMAXBPM(21)

  set age(val) {
    this._age = val;
    this.maxBPM = getMAXBPM(val);
  }

  get age() {
    return this.age;
  }
}

@Component({
  selector: "app-age-input",
  template: `<div>
    <form>
      <label>Введите свой возраст</label>
      <input type="number" name="age" [(ngModel)]="model.age" step="1" min="18" />
    <form>

    <div>Ваш максимальный пульс: {{model.maxBPM}}</div>
  </div>`,
})
class AgeInput {
  model: Person = new Person()
}
```

Тупики нереактивных данных:
- сложности с вычислением цепочек зависимых данных (пример — максимальный пульс в зависимости от возраста)
- сложности с автоматическим обновлением ссылок на изменяемые значения — исходное и зависимые

> Реактивные данные — это данные, которые хранят в себе ссылку на изменяемое значение. Ссылка остается неизменной, но при этом данные могут постоянно и легко изменяться. Когда изменяются данные, автоматически обновляются все зависимые значения.

> signal — это система для работы с реактивными данными

Примеры реактивных данных:
- useState в React
```tsx
function AgeComponent() {
  const [age, setAge] = useState(21);
  const maxBPM = getMAXBPM(age);

  function handleChange(evt) {
    setAge(parseInt(evt.target.value, 10));
  }

  return <div>
    <form>
      <label>Введите свой возраст</label>
      <input type="number" name="age" value={age} onChange={handleChange} step="1" min="18" />
    <form>

    <div>Ваш максимальный пульс: {maxBPM}</div>
  </div>
}
```

- signals в Preact (Библиотека с синтаксисом, похожим на React, но механизм обновления DOM-дерева у них ориентирован на прямое сравнение с DOM, а не с Virtual DOM)

```ts
// data.ts
const data = signal(0);
export default data;

// moduleA
import data from "data.ts";
data;
data.value++;
```

- signals в Ангуляре (как часть инфраструктуры фреймворка)

# signals в Ангуляре как объекты с данными для форм

1. Объект с данными (Объект, JS, который хранит исходную информацию)
```ts
// credentials.ts
// 1. Объявляем объект с данными
const credentials = signal({
  username = "",
  email = "",
});

export default credentials;

// form.ts
import credentials from "credentials.ts";

@Component({})
class Form {}
```

2. Способ отобразить данные в шаблоне
3. Синхронизировать обновление данных из шаблона с исходным объектом данных
```ts
import credentials from "credentials.ts";
// 0. Импортируем
import { form, Field } from "@angular/forms/signals";

@Component({
  // 1. Подключаем встроенную синхронизацию
  imports: [Field],
  // 2. Данные закидываем в шаблон
  template: `<form>
    <input type="text" [field]="loginForm.username" name="username">
    <input type="email" [field]="loginForm.email" name="email">
  </form>`,
})
class Form {
  loginForm = form(credentials);
}
```

4. Проверить данные на валидность
```ts
import credentials from "credentials.ts";
// 0. Импортируем
import { form, Field, required, email } from "@angular/forms/signals";

@Component({
  imports: [Field],
  template: `<form>
    <input type="text" [field]="loginForm.username" name="username">
    <input type="email" [field]="loginForm.email" name="email">
  </form>`,
})
class Form {
  // Добавляем валидацию (но не в шаблоне, а на этапе создания формы)
  loginForm = form(credentials, function (p) {
    required(p.username, { message: "Username is required" });
    required(p.email, { message: "Please enter user email so we could send you verification data" });
    email(p.email, { message: "Please provide valid email address" });
  });
}
```

