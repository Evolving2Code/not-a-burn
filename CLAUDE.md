# Not A Burn - Development Guidelines

## Project Stack
- Architecture: Isolated Vanilla JS, CSS, HTML (No Bundlers/Next.js)
- Environment: Universal Browser and Node.js execution compatibility

## Build Commands & Scripts
- Run local unit tests: `node test.js`

## Coding Standards
- Keep business and data logic isolated in `logic.js`.
- Keep DOM manipulation and event handlers isolated in `app.js`.
- Use safety guards `if (typeof module !== 'undefined')` for exports to maintain browser-native support.

## Git Commit Guidelines
- Use the Conventional Commits format (e.g., `feat:`, `fix:`, `test:`).
- First line must be under 50 characters.
- Do not include AI attribution text in commit messages.
- 