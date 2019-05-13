import * as inquirer from "inquirer";
import ZendeskSearch from "./zendesk_search";
import {readJson, isAnswerValid, validateInput, quit} from "./util";

const zendeskSearch = new ZendeskSearch([
    {name: 'Users', records: readJson('./data/users.json')},
    {name: 'Tickets', records: readJson('./data/tickets.json')},
    {name: 'Organizations', records: readJson('./data/organizations.json')}
]);

const searchZendeskIndex = '1';
const viewSearchableFields = '2';

const initialQuestion = `
Welcome to Zendesk Search
Type 'quit' to exit at any time, Press 'Enter' to continue

    Select search options:
    * Press ${searchZendeskIndex} to search Zendesk
    * Press ${viewSearchableFields} to view a list of searchable fields
    * Type '${quit}' to exit
`;

const searchOptions = 'searchOptions';
const searchEntityIndex = 'searchEntityIndex';
const searchTerm = 'searchTerm';
const searchValue = 'searchValue';
const input = 'input';

const questions = [
    {
        type: input,
        name: searchOptions,
        message: initialQuestion,
        validate: (input: string) => validateInput(input, [searchZendeskIndex, viewSearchableFields])
    },
    {
        type: input,
        name: searchEntityIndex,
        message: zendeskSearch.getEntityIndexPrompt(),
        validate: (input: string) => validateInput(input, zendeskSearch.getEntityIndexes()),
        when: (answers: any) => answers[searchOptions] === searchZendeskIndex
    },
    {
        type: input,
        name: searchTerm,
        message: 'Enter search term',
        validate: (input: string, answers: any) => validateInput(input, zendeskSearch.getSearchTerms(answers[searchEntityIndex])),
        when: (answers: any) => isAnswerValid(answers, searchEntityIndex)
    },
    {
        type: input,
        name: searchValue,
        message: 'Enter search value',
        when: (answers: any) => isAnswerValid(answers, searchTerm)
    },
];

inquirer.prompt(questions).then((answers: any) => {
    if (answers[searchOptions] === viewSearchableFields) {
        console.log(zendeskSearch.getSearchableFields());
    } else if (isAnswerValid(answers, searchValue)) {
        console.log(zendeskSearch.search(answers[searchEntityIndex], answers[searchTerm], answers[searchValue]));
    }
});
