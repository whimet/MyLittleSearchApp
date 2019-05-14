# Environment
- Language: Typescript 3.4.5
- Runtime: Node.js v10.15.3
- Test framework: Jest v24.8.0

# Prerequisites:
- Node.js
- Yarn

# How to run test:
- `yarn install`
- `yarn test`

# How to run application:
- `yarn install`
- `yarn app`

# Files under `/src`
- `app.ts`: application entrance
- `questions_builder.ts`: prompt questions for user interaction
- `zendesk_search.ts`: search interface to user
- `database.ts`: entities management and search implementation
- `entity_metadata_builder.ts`: helper used by `database.ts`
- `model.ts`: data model definition
- `util.ts`: utility functions

# Important third party libraries
- `inquirer`: [https://github.com/SBoudrias/Inquirer.js/](https://github.com/SBoudrias/Inquirer.js/)
- `lokijs`: [http://lokijs.org/#/](http://lokijs.org/#/)
