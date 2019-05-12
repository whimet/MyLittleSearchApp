import Database from "./database";
import * as fs from "fs";
import * as inquirer from "inquirer";

function readJson(file: string): any {
    const content = fs.readFileSync(file);
    return JSON.parse(content.toString());
}

const entities = [
    {name: 'Users', records: readJson('./data/users.json')},
    {name: 'Tickets', records: readJson('./data/tickets.json')},
    {name: 'Organizations', records: readJson('./data/organizations.json')}
];
const database = new Database(entities);

const initialQuestion = `
Welcome to Zendesk Search
Type 'quit' to exit at any time, Press 'Enter' to continue

    Select search options:
    * Press 1 to search Zendesk
    * Press 2 to search a list of searchable fields
    * Type 'quit' to exit
`;

function getEntityName(searchEntityIndex: string) {
    return entities[Number(searchEntityIndex) - 1].name;
}

function getTerms(searchEntityIndex: string): string[] {
    const searchableEntity = database.searchableEntities.find(c => c.name === getEntityName(searchEntityIndex));
    return searchableEntity && searchableEntity.terms || [];
}

const questions = [
    {
        type: 'input',
        name: 'searchOptions',
        message: initialQuestion,
        validate: (input: string) => ['1', '2', 'quit'].includes(input) || 'Invalid answer'
    },
    {
        type: 'input',
        name: 'searchEntityIndex',
        message: `Select ${entities.map((entity, index) => `${index + 1})${entity.name}`).join(' or ')}`,
        validate: (input: string) => entities.map((entity, index) => `${index + 1}`).concat(['quit']).includes(input) || 'Invalid answer',
        when: (answers: any) => answers['searchOptions'] === '1'
    },
    {
        type: 'input',
        name: 'searchTerm',
        message: 'Enter search term',
        validate: (input: string, answers: any) => getTerms(answers['searchEntityIndex']).concat(['quit']).includes(input) || 'Invalid answer',
        when: (answers: any) => answers['searchEntityIndex'] != null && answers['searchEntityIndex'] !== 'quit'
    },
    {
        type: 'input',
        name: 'searchValue',
        message: 'Enter search value',
        when: (answers: any) => answers['searchTerm'] != null && answers['searchTerm'] !== 'quit'
    },
];

function getSearchableFields() {
    return database.searchableEntities.map(c => `-----------------------------\nSearch ${c.name} with\n${c.terms.join('\n')}`).join('\n');
}

inquirer.prompt(questions).then((answers: any) => {
    if (answers['searchOptions'] === '2') {
        console.log(getSearchableFields());
    } else if (answers['searchValue'] != null) {
        const results = database.search(getEntityName(answers['searchEntityIndex']), answers['searchTerm'], answers['searchValue']);
        if (results.length === 0) {
            console.log(`Searching ${getEntityName(answers['searchEntityIndex']).toLowerCase()} for ${answers['searchTerm']} with a value of ${answers['searchValue']}\nNo results found`);
        } else {
            results.forEach(r => console.log(r));
        }
    }
});
