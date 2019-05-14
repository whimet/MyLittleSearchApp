import {isAnswerValid, quit, validateInput} from "./util";
import ZendeskSearch from "./zendesk_search";

export const searchZendeskIndex = '1';
export const viewSearchableFields = '2';

const initialQuestion = `
Welcome to Zendesk Search
Type 'quit' to exit at any time, Press 'Enter' to continue

    Select search options:
    * Press ${searchZendeskIndex} to search Zendesk
    * Press ${viewSearchableFields} to view a list of searchable fields
    * Type '${quit}' to exit
`;

export const searchOptions = 'searchOptions';
export const searchEntityIndex = 'searchEntityIndex';
export const searchTerm = 'searchTerm';
export const searchValue = 'searchValue';
const input = 'input';

export const questions = (zendeskSearch: ZendeskSearch) => [
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

export const answersHandler = (zendeskSearch: ZendeskSearch) => (answers: any) => {
    if (answers[searchOptions] === viewSearchableFields) {
        return zendeskSearch.getSearchableFields();
    } else if (isAnswerValid(answers, searchValue)) {
        return zendeskSearch.search(answers[searchEntityIndex], answers[searchTerm], answers[searchValue]);
    }
};
