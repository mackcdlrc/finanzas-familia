# Finanzas Familiares

App web para registrar ingresos, gastos y deudas en cuotas, compartida entre dos personas, guardando todo en Google Sheets y accesible desde cualquier lugar vía GitHub Pages.

## Archivos

- `index.html` → la app completa (interfaz + lógica). Es lo único que se sube a GitHub.
- `Code.gs` → el script que se pega en Google Apps Script (actúa como el "servidor").
- `README.md` → esta guía.

---

## Parte 1 — Crear la base de datos en Google Sheets (10 min)

1. Entra a [sheets.google.com](https://sheets.google.com) y crea una hoja de cálculo nueva.
   Ponle de nombre, por ejemplo, **"Finanzas Familia - Datos"**.
2. No necesitas crear columnas manualmente, el script las crea solo. Deja la hoja vacía.
3. Ve a **Extensiones > Apps Script**. Se abrirá un editor de código en una pestaña nueva.
4. Borra todo el contenido que aparece por defecto (`function myFunction() {...}`).
5. Abre el archivo `Code.gs` que te entregué y copia **todo** su contenido. Pégalo en el editor de Apps Script.
6. En la línea `const APP_TOKEN = "cambia-esto-por-una-clave-larga";`, cambia ese texto por una clave larga y difícil de adivinar (ejemplo: `pe-finanzas-8k2m9x`). Esto **no es un PIN que tú o Giorgiana van a escribir** — es una clave interna que solo usa el código para que nadie más pueda leer o modificar tus datos si encuentra la URL del script. **Anótala**, la necesitarás en la Parte 2.
7. Guarda el proyecto (ícono de disquete o `Ctrl+S`). Ponle un nombre, ej. "API Finanzas".

### Publicar el script como aplicación web

8. Arriba a la derecha, haz clic en **Implementar > Nueva implementación**.
9. Haz clic en el ícono de engranaje (⚙️) junto a "Seleccionar tipo" y elige **Aplicación web**.
10. Configura así:
    - **Ejecutar como:** Yo (tu correo)
    - **Quién tiene acceso:** Cualquier usuario
11. Haz clic en **Implementar**.
12. Google te pedirá autorizar permisos (es tu propio script accediendo a tu propia hoja):
    - Haz clic en **Autorizar acceso**.
    - Elige tu cuenta de Google.
    - Puede aparecer una advertencia de "app no verificada" — es normal porque es un script personal. Haz clic en **Configuración avanzada > Ir a "API Finanzas" (no seguro)** y luego **Permitir**.
13. Copia la **URL de la aplicación web** que te muestra (termina en `/exec`). La necesitas en el siguiente paso.

> Cada vez que edites `Code.gs` en el futuro, debes volver a "Implementar > Gestionar implementaciones > editar (ícono de lápiz) > Nueva versión > Implementar" para que los cambios se apliquen.

---

## Parte 2 — Configurar la app (2 min)

1. Abre `index.html` con cualquier editor de texto (o directamente en GitHub, ver Parte 3).
2. Busca este bloque cerca del final del archivo:

```js
const CONFIG = {
  API_URL: "PEGA_AQUI_LA_URL_DE_TU_APPS_SCRIPT",
  APP_TOKEN: "cambia-esto-por-una-clave-larga"
};
```

3. Reemplaza `PEGA_AQUI_LA_URL_DE_TU_APPS_SCRIPT` con la URL que copiaste en el paso 13 anterior (entre comillas).
4. Reemplaza `"cambia-esto-por-una-clave-larga"` por la **misma clave exacta** que pusiste en `APP_TOKEN` dentro de `Code.gs`. Deben ser idénticas letra por letra.
5. Guarda el archivo.

> Ni tú ni Giorgiana van a ver ni escribir esta clave nunca — al abrir la app solo tocan su nombre (Mack o Giorgiana) y entran directo. La clave solo protege la comunicación entre la página y tu Google Sheet.

---

## Parte 3 — Subir a GitHub y publicar con GitHub Pages (10 min)

### Si nunca has usado GitHub:

1. Crea una cuenta gratuita en [github.com](https://github.com) si no tienes una.
2. Haz clic en el botón verde **New** (o el ícono **+** arriba a la derecha > **New repository**).
3. Ponle de nombre `finanzas-familiares` (puede ser otro nombre, sin espacios).
4. Déjalo como **Public** (para que GitHub Pages sea gratis) y marca **Add a README file**.
5. Haz clic en **Create repository**.

### Subir el archivo

6. Dentro del repositorio, haz clic en **Add file > Upload files**.
7. Arrastra tu `index.html` (ya editado con tu URL y PIN).
8. Baja y haz clic en **Commit changes**.

### Activar GitHub Pages

9. En el repositorio, ve a la pestaña **Settings**.
10. En el menú de la izquierda, haz clic en **Pages**.
11. En "Branch", elige **main** y la carpeta **/ (root)**. Haz clic en **Save**.
12. Espera 1-2 minutos. GitHub te mostrará un enlace tipo:
    `https://tu-usuario.github.io/finanzas-familiares/`
13. Abre ese enlace — ¡esa es tu app, ya accesible desde cualquier celular o computadora!

### Para que tu esposa la use

- Comparte el link `https://tu-usuario.github.io/finanzas-familiares/` por WhatsApp.
- Ella lo abre desde su celular, toca "Giorgiana" en la pantalla de inicio, y entra directo — sin PIN ni contraseña — a registrar sus gastos, ingresos y cuotas.
- Pueden guardar el link como acceso directo en la pantalla de inicio del celular (en Chrome: menú ⋮ > "Agregar a pantalla de inicio") para que se sienta como una app normal.

---

## Cómo funciona la sincronización

- Todo lo que registran ambos se guarda directamente en la hoja de Google Sheets **"Movimientos"**.
- La app consulta esa hoja automáticamente **cada 5 segundos**, y también cada vez que abres la pestaña, vuelves de otra app, o le das a "Actualizar" arriba a la derecha. Es el ritmo más rápido que Google Sheets permite de forma confiable sin generar errores por exceso de solicitudes.
- Al guardar o marcar una cuota como pagada, la app se sincroniza de inmediato (no espera los 5 segundos).
- Puedes abrir la hoja de Google Sheets directamente en cualquier momento para ver o exportar todos los datos en crudo, o respaldarlos.

## El saldo, los gastos y las cuotas son automáticos

- **Saldo disponible**: se recalcula solo cada vez que registras un ingreso, un gasto, o marcas una cuota como pagada. Resta automáticamente todos los gastos (incluyendo las cuotas ya pagadas) de todos los ingresos.
- **Cuotas**: en la pestaña "Cuotas" cada deuda tiene un botón **"Ver / marcar cuotas"** que despliega el calendario completo de cuotas (fecha de cada una) con un check que puedes marcar o desmarcar en cualquier momento para indicar si esa cuota específica ya está pagada o sigue pendiente. Esto actualiza el saldo y los gráficos al instante.

## Gráficos

La pestaña "Resumen" incluye:
- Un gráfico de dona con tus gastos por categoría (incluye las cuotas ya pagadas, agrupadas en su categoría).
- Un gráfico de barras comparando ingresos vs. gastos de los últimos 6 meses.

## Seguridad

- No hay PIN ni login: al abrir el link, Mack o Giorgiana solo tocan su nombre y entran directo.
- La protección real está en que (a) el link de GitHub Pages no es público a menos que lo compartas, y (b) el `APP_TOKEN` interno evita que otra persona use directamente la URL de Google Apps Script para leer o escribir en tu hoja aunque la encuentre.
- Si alguna vez quieres invalidar el acceso, cambia `APP_TOKEN` en `Code.gs` (y vuelve a implementar) y en `CONFIG.APP_TOKEN` de `index.html`.

## Personalizar categorías

Las categorías de gasto (luz, alquiler, mercadería, etc.) están en `index.html`, dentro del `<select id="fCategoria">`. Puedes editar, agregar o quitar líneas `<option>...</option>` para ajustarlas a tu negocio.
