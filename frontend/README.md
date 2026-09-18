



## Percentage Match Scoring Architecture

When a `Target Budget` is submitted through the search filter, the system calculates a dynamic percentage match score for each listing relative to the user's budget.

### Calculation Formula

$$\text{Match Percentage} = \max\left(0, 100 - \left(\frac{\vert{}\text{Price} - \text{Target Budget}\vert{}}{\text{Target Budget}} \times 100\right)\right)$$

* **100% Match:** Exact price equality ($\text{Price} = \text{Target Budget}$).
* **Proportional Decay:** A listing priced $10\%$ above or below target yields a $90\%$ match.
* **Floor:** Clamped to a minimum of $0\%$ for extreme deviations.

### Results Ranking & Display

1. **Descending Order:** Search results sort by highest match percentage first.
2. **Visual Badging:** Front-end cards display percentage match indicators:
   * 🟩 **$\ge 90\%$:** Green badge (High Match)
   * 🟧 **$75\% - 89\%$:** Amber badge (Good Match)
   * ⬜ **$< 75\%$:** Gray badge (Moderate Match)



---


# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
