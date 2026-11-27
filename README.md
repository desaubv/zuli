# API de formularios

> Referencia de uso de la API pública del sistema de formularios. Describe sus componentes, propiedades, métodos, estados, reglas de validación y patrones de integración. Los ejemplos muestran cómo consumir la API; no describen su código interno.

## 1. Conceptos generales

El sistema permite construir formularios mediante cuatro piezas:

- **Instancia de formulario:** administra valores, errores, validación y envío.
- **Contenedor `Form`:** comparte la instancia con los campos descendientes.
- **Campos integrados:** conectan su valor y validación con la instancia.
- **Controles de acción:** invocan operaciones como validar, enviar o restablecer.

Un formulario típico sigue este patrón:

1. Crear una instancia con `useForm()`.
2. Proporcionar la instancia a `Form`.
3. Declarar campos con un `name` único.
4. Conectar una acción de interfaz con `form.submit()`.
5. Procesar los datos en `onSubmit`.

Los nombres de los campos son las claves del objeto `values`. Por ejemplo, `name="email"` corresponde a `values.email`.

## 2. `useForm(options)`

Crea una instancia de formulario.

### Parámetros

| Parámetro | Tipo | Predeterminado | Descripción |
|---|---|---|---|
| `initialValues` | `Object` | `{}` | Valores iniciales del formulario. |
| `onSubmit` | `Function` | `undefined` | Función ejecutada después de una validación exitosa. |

### Ejemplo

```jsx
const form = useForm({
    initialValues: {
        name: "",
        email: "",
        password: "",
    },
    onSubmit: async (values) => {
        await createAccount(values);
    },
});
```

`onSubmit` recibe un objeto con los valores actuales del formulario. Puede ser una función síncrona o asíncrona.

### Retorno

`useForm()` devuelve un objeto con la siguiente API:

| Miembro | Tipo | Descripción |
|---|---|---|
| `values` | `Object` | Valores actuales del formulario. |
| `errors` | `Object` | Errores de validación por nombre de campo. |
| `isSubmitting` | `boolean` | Indica si se está ejecutando el callback de envío. |
| `isSubmitted` | `boolean` | Indica si se ha intentado enviar el formulario. |
| `isValid` | `boolean` | Indica si actualmente no hay errores registrados. |
| `setValue(name, value)` | `Function` | Actualiza el valor de un campo. |
| `setValues(values)` | `Function` | Actualiza el objeto de valores. |
| `registerField(name, validator)` | `Function` | Registra un validador para un campo. |
| `validate()` | `Function` | Ejecuta todos los validadores registrados. |
| `submit()` | `Function` | Valida y, si es correcto, ejecuta `onSubmit`. |
| `reset(values?)` | `Function` | Restablece el estado del formulario. |

## 3. Estado del formulario

### `values`

Objeto que contiene los datos actuales. Las propiedades corresponden a los nombres de los campos.

```js
{
    name: "Ana",
    email: "ana@example.com",
    newsletter: true
}
```

Los valores pueden ser cadenas, números, booleanos, arreglos, objetos u otros valores que utilicen los campos.

### `errors`

Objeto que relaciona el nombre de cada campo con su mensaje de error. Los campos sin error no necesitan una propiedad.

```js
{
    email: "Ingresa un correo válido.",
    password: "La contraseña es obligatoria."
}
```

### `isSubmitting`

Permite bloquear acciones mientras se ejecuta el callback de envío.

```jsx
<Button
    title="Crear cuenta"
    disabled={form.isSubmitting}
    onPress={form.submit}
/>
```

### `isSubmitted`

Indica que ya se intentó enviar el formulario. Después del primer intento, los cambios realizados mediante `setValue()` vuelven a validar el campo correspondiente.

### `isValid`

Indica si `errors` está vacío en ese momento. No ejecuta validaciones por sí mismo. Para comprobar los valores actuales, llama primero a `validate()` o utiliza `submit()`.

## 4. Métodos de la instancia

### `setValue(name, value)`

Actualiza el valor de un campo.

| Parámetro | Tipo | Descripción |
|---|---|---|
| `name` | `string` | Nombre del campo. |
| `value` | `any` | Nuevo valor. |

```js
form.setValue("email", "ana@example.com");
form.setValue("acceptedTerms", true);
```

Si ya se intentó enviar el formulario, el campo actualizado vuelve a validarse y su error se actualiza.

### `setValues(values)`

Actualiza el objeto de valores del formulario.

```js
form.setValues({
    name: "Ana",
    email: "ana@example.com",
});
```

**Nota de compatibilidad:** en la implementación actual, esta operación actualiza el estado visible, pero no sincroniza la referencia interna utilizada por `validate()` y `submit()`. Por ello, no se recomienda utilizarla para preparar datos que deban validarse o enviarse. Para cambios puntuales, utiliza `setValue()`.

### `registerField(name, validator)`

Registra una función de validación asociada a un campo. Es principalmente una operación de integración para componentes de campo personalizados.

| Parámetro | Tipo | Descripción |
|---|---|---|
| `name` | `string` | Nombre del campo. |
| `validator` | `(value) => string \| null` | Devuelve un mensaje si el valor no es válido o `null` si es válido. |

```js
const unregister = form.registerField("code", (value) => {
    return value.length === 6
        ? null
        : "El código debe contener seis caracteres.";
});
```

La operación devuelve una función para retirar el registro cuando el campo deje de formar parte del formulario:

```js
unregister();
```

Los componentes integrados realizan este registro automáticamente.

### `validate()`

Ejecuta los validadores registrados y actualiza `errors`.

**Retorno:** `boolean`.

- `true`: todos los campos registrados son válidos.
- `false`: al menos un campo tiene un error.

```js
const valid = form.validate();

if (!valid) {
    console.log(form.errors);
}
```

La actualización del estado visual de errores se refleja en el siguiente renderizado.

### `submit()`

Valida el formulario y ejecuta `onSubmit` si no existen errores.

**Retorno:** una promesa que resuelve a `boolean`.

```js
const success = await form.submit();

if (success) {
    // El callback de envío terminó correctamente.
}
```

Comportamiento:

- Marca el formulario como enviado.
- Ejecuta `validate()`.
- Si hay errores, no ejecuta `onSubmit` y resuelve `false`.
- Si no hay errores, activa `isSubmitting` y ejecuta `onSubmit(values)`.
- Si el callback termina correctamente, resuelve `true`.
- Al terminar, restablece `isSubmitting`.

Si `onSubmit` lanza una excepción, esta se propaga al llamador. El indicador `isSubmitting` se restablece antes de que la excepción se propague.

Si no se proporciona `onSubmit`, un formulario válido también resuelve `true`.

### `reset(values?)`

Restablece el formulario y elimina los errores existentes.

| Parámetro | Tipo | Descripción |
|---|---|---|
| `values` | `Object` | Valores que se establecerán después del restablecimiento. Si se omite, se utilizan los valores iniciales. |

```js
form.reset();

form.reset({
    name: "",
    email: "",
    password: "",
});
```

Restablece los valores, errores y estados de envío. Los validadores registrados permanecen disponibles.

## 5. `Form`

Contenedor que proporciona la instancia del formulario a sus componentes descendientes.

### Propiedades

| Propiedad | Tipo | Requerida | Descripción |
|---|---|---:|---|
| `form` | Instancia de `useForm()` | Sí | Instancia que se compartirá con los descendientes. |
| `style` | `StyleProp` | No | Estilos del contenedor. |
| `children` | `ReactNode` | No | Contenido del formulario. |
| Otras propiedades de `View` | Según React Native | No | Se transfieren al contenedor visual. |

### Ejemplo

```jsx
<Form form={form} style={styles.form}>
    <Input name="email" label="Correo electrónico" />
    <Input name="password" label="Contraseña" />
</Form>
```

`Form` funciona como un contenedor visual y de contexto. No implementa por sí mismo un evento de envío. La acción debe conectarse a `form.submit()`.

## 6. API de contexto

### `useFormContext()`

Devuelve la instancia de formulario proporcionada por el `Form` ancestro más cercano.

```js
const form = useFormContext();
```

Debe utilizarse dentro de un componente descendiente de `Form`. Si no existe un contexto disponible, lanza un error.

Es útil para crear componentes auxiliares, como botones de envío, indicadores de estado o acciones de restablecimiento.

```jsx
function SubmitButton() {
    const form = useFormContext();

    return (
        <Button
            title={form.isSubmitting ? "Enviando..." : "Continuar"}
            disabled={form.isSubmitting}
            onPress={form.submit}
        />
    );
}
```

### `useFormField(options)`

Conecta un campo personalizado con el formulario.

#### Parámetros

| Propiedad | Tipo | Predeterminado | Descripción |
|---|---|---|---|
| `name` | `string` | — | Nombre del campo en `values` y `errors`. |
| `required` | `boolean` | `false` | Indica si el valor es obligatorio. |
| `requiredMessage` | `string` | `"Este campo es obligatorio."` | Mensaje cuando el valor requerido está vacío. |
| `regex` | `RegExp` | — | Expresión regular que debe cumplir el valor. |
| `regexMessage` | `string` | `"El formato no es válido."` | Mensaje cuando el valor no coincide con la expresión regular. |

#### Retorno

| Propiedad | Tipo | Descripción |
|---|---|---|
| `value` | `any` | Valor actual del campo. |
| `onChangeText` | `(value) => void` | Actualiza el valor del campo. |
| `error` | `string \| undefined` | Mensaje de error actual. |

#### Ejemplo de campo personalizado

```jsx
function NicknameField() {
    const {
        value,
        onChangeText,
        error,
    } = useFormField({
        name: "nickname",
        required: true,
        requiredMessage: "Elige un nombre de usuario.",
        regex: /^[a-z0-9_]+$/i,
        regexMessage: "Utiliza letras, números o guion bajo.",
    });

    return (
        <View>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                autoCapitalize="none"
            />
            {error ? <Text>{error}</Text> : null}
        </View>
    );
}
```

Cuando se utiliza fuera de un `Form`, el hook no dispone de una instancia a la cual conectar el campo. En ese caso no ofrece gestión de estado ni validación de formulario.

## 7. Componentes de campo

Los campos integrados pueden utilizarse de dos maneras:

- **Conectados al formulario:** se colocan dentro de `Form` y reciben un `name`.
- **Controlados externamente:** el componente padre administra `value` y su callback de cambio.

Cuando un campo admite ambas modalidades, los valores externos tienen prioridad sobre los valores del contexto.

### 7.1. `Input`

Campo de texto basado en la entrada de texto de React Native.

#### Propiedades

| Propiedad | Tipo | Descripción |
|---|---|---|
| `name` | `string` | Nombre del campo dentro del formulario. |
| `value` | `string` | Valor controlado externamente. |
| `onChangeText` | `Function` | Callback externo para cambios de texto. |
| `label` | `string` | Etiqueta del campo. |
| `required` | `boolean` | Marca el campo como obligatorio. |
| `requiredMessage` | `string` | Mensaje de obligatoriedad. |
| `regex` | `RegExp` | Regla de formato. |
| `regexMessage` | `string` | Mensaje de formato inválido. |
| `transformFunction` | `(text) => string` | Transforma el texto antes de actualizarlo. |
| `disabled` | `boolean` | Deshabilita la interacción. |
| `editable` | `boolean` | Controla si el texto puede editarse. |
| `secureTextEntry` | `boolean` | Oculta el contenido introducido. |
| `keyboardType` | `KeyboardTypeOptions` | Tipo de teclado. |
| `iconLeft` | `ReactNode` | Elemento visual al inicio del campo. |
| `iconRight` | `ReactNode` | Elemento visual al final del campo. |
| `onIconRightPress` | `Function` | Acción del elemento visual derecho. |

También admite las propiedades visuales y de entrada que exponga el componente base.

#### Validación

Dentro de `Form`, `required` y `regex` participan en la validación del formulario.

Fuera de `Form`, el componente puede comprobar localmente el formato mediante `regex`, pero no dispone de la validación de obligatoriedad administrada por el formulario.

#### Ejemplo

```jsx
<Input
    name="email"
    label="Correo electrónico"
    placeholder="nombre@dominio.com"
    keyboardType="email-address"
    autoCapitalize="none"
    required
    requiredMessage="El correo es obligatorio."
    regex={/^[^\s@]+@[^\s@]+\.[^\s@]+$/}
    regexMessage="El correo no tiene un formato válido."
/>
```

Transformación de entrada:

```jsx
<Input
    name="phone"
    label="Teléfono"
    keyboardType="phone-pad"
    transformFunction={(text) => text.replace(/\D/g, "")}
/>
```

### 7.2. `Select`

Selector de una opción dentro de una lista.

#### Estructura de las opciones

```js
[
    { label: "Desarrollo", value: "development" },
    { label: "Diseño", value: "design" },
]
```

| Propiedad | Tipo | Descripción |
|---|---|---|
| `label` | `string` | Texto que se presenta al usuario. |
| `value` | `any` | Valor que se almacena en el formulario. |

#### Propiedades

| Propiedad | Tipo | Descripción |
|---|---|---|
| `name` | `string` | Nombre del campo. |
| `value` | `any` | Valor controlado externamente. |
| `onValueChange` | `Function` | Callback al seleccionar una opción. |
| `options` | `Array` | Opciones disponibles. |
| `placeholder` | `string` | Texto cuando no hay selección. |
| `required` | `boolean` | Indica si la selección es obligatoria. |
| `requiredMessage` | `string` | Mensaje de obligatoriedad. |
| `searchable` | `boolean` | Habilita la búsqueda de opciones. |
| `searchPlaceholder` | `string` | Texto del campo de búsqueda. |
| `noResultsText` | `string` | Mensaje cuando no hay coincidencias. |
| `disabled` | `boolean` | Deshabilita el selector. |
| `editable` | `boolean` | Controla si se permite interactuar. |

La búsqueda permite encontrar opciones por su etiqueta y no distingue entre mayúsculas y minúsculas ni entre caracteres con y sin acento.

La validación integrada contempla la obligatoriedad. Aunque la API admite `regexMessage`, no expone una propiedad `regex` para configurar una regla de expresión regular.

#### Ejemplo

```jsx
<Select
    name="area"
    label="Área de interés"
    placeholder="Selecciona un área"
    options={[
        { label: "Desarrollo", value: "development" },
        { label: "Diseño", value: "design" },
        { label: "Administración", value: "administration" },
    ]}
    searchable
    required
/>
```

### 7.3. `FileUpload`

Selector de archivos con soporte para límites de cantidad y tamaño.

#### Propiedades

| Propiedad | Tipo | Descripción |
|---|---|---|
| `name` | `string` | Nombre del campo. |
| `value` | `Array` | Archivos controlados externamente, cuando se utiliza esta modalidad. |
| `onChange` | `Function` | Callback de cambios de selección. |
| `required` | `boolean` | Exige seleccionar al menos un archivo. |
| `requiredMessage` | `string` | Mensaje cuando no hay archivos. |
| `minFiles` | `number` | Cantidad mínima de archivos. |
| `maxFiles` | `number` | Cantidad máxima de archivos. |
| `maxSize` | `number` | Tamaño máximo permitido por archivo, en bytes. |
| `accept` | `string` o configuración admitida | Tipos de archivo permitidos. |

El componente permite seleccionar y administrar la lista de archivos, pero no realiza la carga a un servidor ni el almacenamiento remoto.

Las restricciones de tipo y tamaño se comprueban durante la selección. Las reglas de obligatoriedad y cantidad forman parte de la validación del campo al validar o enviar el formulario.

#### Ejemplo

```jsx
<FileUpload
    name="documents"
    label="Documentos"
    required
    minFiles={1}
    maxFiles={3}
    maxSize={5 * 1024 * 1024}
    accept=".pdf,.png,.jpg"
/>
```

En este ejemplo se permite seleccionar entre uno y tres archivos, con un máximo de 5 MiB por archivo.

### 7.4. `VerificationCodeInput`

Entrada especializada para códigos de verificación divididos en varias posiciones.

#### Capacidades

- Administra una posición por carácter.
- Permite avanzar al siguiente espacio al introducir un carácter.
- Permite pegar un código completo.
- Gestiona el borrado y el movimiento entre posiciones.
- Puede restringir la entrada a caracteres numéricos o alfanuméricos.
- Puede notificar cuando el código está completo.
- Puede conectarse al contexto del formulario mediante `name`.

#### Propiedades principales

| Propiedad | Tipo | Descripción |
|---|---|---|
| `name` | `string` | Nombre del campo en el formulario. |
| `length` | `number` | Cantidad de caracteres del código. |
| `value` | `string` | Valor controlado externamente. |
| `onChangeText` | `Function` | Callback de cambios. |
| `onComplete` | `Function` | Callback cuando se completa el código. |
| `numeric` | `boolean` | Restringe la entrada a números. |
| `alphanumeric` | `boolean` | Permite caracteres alfanuméricos. |
| `required` | `boolean` | Indica si el código es obligatorio. |
| `requiredMessage` | `string` | Mensaje cuando el código está vacío. |
| `regex` | `RegExp` | Regla de formato adicional. |
| `regexMessage` | `string` | Mensaje cuando no se cumple el formato. |

#### Ejemplo

```jsx
<VerificationCodeInput
    name="verificationCode"
    length={6}
    numeric
    required
    onComplete={(code) => {
        console.log("Código capturado:", code);
    }}
/>
```

### 7.5. `Checkbox`

Control de selección booleana.

El componente es independiente del contexto del formulario: su estado debe administrarse desde el componente padre y conectarse manualmente con la instancia mediante `setValue()`.

#### Propiedades

| Propiedad | Tipo | Descripción |
|---|---|---|
| `value` | `boolean` | Estado de selección controlado. |
| `onValueChange` | `Function` | Callback cuando cambia la selección. |
| `label` | `string` o `ReactNode` | Contenido asociado al control. |
| Otras propiedades visuales | Según el componente | Personalización de presentación e interacción. |

#### Ejemplo integrado manualmente

```jsx
function TermsField() {
    const form = useFormContext();

    return (
        <Checkbox
            label="Acepto los términos y condiciones"
            value={form.values.acceptedTerms}
            onValueChange={(value) => {
                form.setValue("acceptedTerms", value);
            }}
        />
    );
}
```

El control no registra automáticamente una regla de validación. Si el consentimiento es obligatorio, registra un validador o comprueba la condición en la lógica de envío.

### 7.6. `RadioCard`

Control visual para seleccionar una opción entre varias tarjetas.

Es independiente del contexto del formulario. El componente padre administra la selección y, si corresponde, actualiza la instancia del formulario.

#### Propiedades de integración

| Propiedad | Tipo | Descripción |
|---|---|---|
| `selected` | `boolean` | Indica si la tarjeta está seleccionada. |
| `onPress` | `Function` | Acción al seleccionar la tarjeta. |
| Propiedades de contenido y presentación | Según el componente | Configuran texto, iconos y apariencia. |

#### Ejemplo

```jsx
function AccountTypeField() {
    const form = useFormContext();

    return (
        <View>
            <RadioCard
                title="Cuenta personal"
                selected={form.values.accountType === "personal"}
                onPress={() => form.setValue("accountType", "personal")}
            />

            <RadioCard
                title="Cuenta de empresa"
                selected={form.values.accountType === "company"}
                onPress={() => form.setValue("accountType", "company")}
            />
        </View>
    );
}
```

Para validar que exista una opción seleccionada, utiliza un validador registrado para `accountType` o realiza la comprobación en el callback de envío.

## 8. Patrones de uso

### 8.1. Formulario completo

```jsx
function RegistrationScreen() {
    const form = useForm({
        initialValues: {
            name: "",
            email: "",
            password: "",
        },
        onSubmit: async (values) => {
            await register(values);
        },
    });

    return (
        <Form form={form}>
            <Input
                name="name"
                label="Nombre"
                required
            />

            <Input
                name="email"
                label="Correo"
                required
                keyboardType="email-address"
                regex={/^[^\s@]+@[^\s@]+\.[^\s@]+$/}
                regexMessage="Correo no válido."
            />

            <Input
                name="password"
                label="Contraseña"
                required
                secureTextEntry
            />

            <Button
                title={form.isSubmitting ? "Registrando..." : "Crear cuenta"}
                disabled={form.isSubmitting}
                onPress={form.submit}
            />
        </Form>
    );
}
```

### 8.2. Validar sin enviar

```js
if (form.validate()) {
    // Los valores cumplen las reglas registradas.
} else {
    // Consultar form.errors.
}
```

### 8.3. Restablecer después de una operación

```js
async function handleSave(values) {
    await saveRecord(values);
    form.reset();
}
```

### 8.4. Controlar un campo desde fuera

```jsx
const [query, setQuery] = useState("");

<Input
    value={query}
    onChangeText={setQuery}
    label="Buscar"
/>
```

Cuando se utiliza `value`, el componente padre debe actualizar ese valor en `onChangeText`. Si no lo hace, la entrada puede permanecer visualmente sin cambios.

### 8.5. Formularios divididos en pasos

Para formularios multipaso se puede crear una instancia por etapa y mantener los datos acumulados en un estado superior.

Patrón recomendado:

1. Cada paso administra únicamente sus campos.
2. Al avanzar, se ejecuta `validate()` o `submit()`.
3. Si la validación es correcta, se incorporan los valores del paso al estado acumulado.
4. Al finalizar, se envía el objeto completo.

```jsx
const [registration, setRegistration] = useState({
    personal: {},
    professional: {},
});

const personalForm = useForm({
    initialValues: {
        name: "",
        email: "",
    },
});

async function continueToProfessional() {
    if (!personalForm.validate()) return;

    setRegistration((current) => ({
        ...current,
        personal: { ...personalForm.values },
    }));

    setStep("professional");
}
```

No es necesario mantener todos los campos montados al mismo tiempo. Cada etapa puede tener su propia instancia y ciclo de vida.

## 9. Reglas y consideraciones

- Cada campo conectado debe utilizar un `name` único dentro del formulario.
- Los campos integrados se registran mientras están montados. Un campo desmontado deja de participar en la validación.
- Los campos personalizados deben utilizar `useFormField()` o registrar manualmente su validador.
- `Checkbox` y `RadioCard` requieren integración manual.
- `isValid` representa el estado actual de errores; no sustituye a `validate()`.
- `submit()` no realiza peticiones HTTP por cuenta propia. Esa responsabilidad corresponde a `onSubmit`.
- Los errores de red o del servidor deben gestionarse en `onSubmit` y mostrarse mediante la interfaz de la aplicación.
- La validación del cliente mejora la experiencia, pero el servidor debe volver a validar los datos.
- Si se utiliza un campo controlado externamente, el padre debe mantener sincronizados su valor y callback.
- Para restablecer un formulario sin perder sus reglas, utiliza `reset()`.

## 10. Limitaciones conocidas de la API actual

Esta sección documenta el comportamiento observable que conviene tener en cuenta al integrar el sistema:

1. **Sin sincronización completa en `setValues()`:** el método puede dejar desalineados los valores visibles y los utilizados por validación y envío. Se recomienda `setValue()` hasta corregir este comportamiento.
2. **`isValid` no valida automáticamente:** solamente refleja si el objeto `errors` está vacío.
3. **`Select` no ofrece validación por expresión regular:** la API del componente contempla obligatoriedad, pero no expone `regex`.
4. **`Checkbox` y `RadioCard` no se registran automáticamente:** deben conectarse manualmente y su validación debe definirse aparte.
5. **`FileUpload` no carga archivos a un servicio remoto:** únicamente gestiona la selección y las restricciones locales.
6. **El contenedor `Form` no envía por sí mismo:** la acción de envío debe invocarse explícitamente.

## 11. Referencia rápida

| Necesidad | API |
|---|---|
| Crear un formulario | `useForm(options)` |
| Compartir la instancia | `<Form form={form}>` |
| Leer la instancia desde un descendiente | `useFormContext()` |
| Conectar un campo personalizado | `useFormField(options)` |
| Consultar valores | `form.values` |
| Consultar errores | `form.errors` |
| Actualizar un campo | `form.setValue(name, value)` |
| Validar | `form.validate()` |
| Enviar | `await form.submit()` |
| Restablecer | `form.reset()` |
| Consultar envío en curso | `form.isSubmitting` |
| Consultar si hubo un intento de envío | `form.isSubmitted` |
| Consultar errores actuales | `form.isValid` |

---

**Nota de alcance:** esta referencia describe el contrato de uso y el comportamiento disponible de la API. No pretende documentar detalles internos, dependencias privadas ni decisiones de implementación.
