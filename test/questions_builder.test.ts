import {
    answersHandler,
    questions,
    searchEntityIndex,
    searchOptions,
    searchTerm,
    searchValue,
    searchZendeskIndex,
    viewSearchableFields
} from '../src/questions_builder';
import {quit} from "../src/util";
import ZendeskSearch from "../src/zendesk_search";

describe('Questions', () => {
    const firstUser = {_id: 1};
    const zendeskSearch = new ZendeskSearch([{name: 'Users', records: [firstUser]}]);
    const invalid = 'Invalid answer';

    [
        {
            questionIndex: 0,
            input: '1',
            result: true
        },
        {
            questionIndex: 0,
            input: '2',
            result: true
        },
        {
            questionIndex: 0,
            input: quit,
            result: true
        },
        {
            questionIndex: 0,
            input: '3',
            result: invalid
        },
        {
            questionIndex: 1,
            input: '1',
            result: true
        },
        {
            questionIndex: 1,
            input: quit,
            result: true
        },
        {
            questionIndex: 1,
            input: '2',
            result: invalid
        },
        {
            questionIndex: 2,
            input: '_id',
            result: true
        },
        {
            questionIndex: 2,
            input: quit,
            result: true
        },
        {
            questionIndex: 2,
            input: 'name',
            result: invalid
        },
    ].forEach(({questionIndex, input, result}) =>
        it(`input ${input} should be ${result === true ? 'valid' : result} for question ${questionIndex}`, () => {
            expect((<any>questions(zendeskSearch)[questionIndex]).validate(input, {searchEntityIndex: '1'})).toEqual(result);
        }));

    [
        {
            questionIndex: 1,
            answers: {[searchOptions]: searchZendeskIndex},
            valid: true
        },
        {
            questionIndex: 1,
            answers: {[searchOptions]: viewSearchableFields},
            valid: false
        },
        {
            questionIndex: 1,
            answers: {[searchOptions]: quit},
            valid: false
        },
        {
            questionIndex: 2,
            answers: {[searchEntityIndex]: '1'},
            valid: true
        },
        {
            questionIndex: 2,
            answers: {[searchEntityIndex]: quit},
            valid: false
        },
        {
            questionIndex: 3,
            answers: {[searchTerm]: '_id'},
            valid: true
        },
        {
            questionIndex: 3,
            answers: {[searchTerm]: quit},
            valid: false
        },
    ].forEach(({questionIndex, answers, valid}) =>
        it(`question ${questionIndex} should be ${valid ? 'valid' : 'invalid'} when answers is ${JSON.stringify(answers)}`, () => {
            expect((<any>questions(zendeskSearch)[questionIndex]).when(answers)).toBe(valid);
        }));

    [
        {
            answers: {[searchOptions]: viewSearchableFields},
            output: `-----------------------------\nSearch Users with\n_id`
        },
        {
            answers: {[searchEntityIndex]: '1', [searchTerm]: '_id', [searchValue]: '1'},
            output: [firstUser]
        },
    ].forEach(({answers, output}) =>
        it(`should have output ${JSON.stringify(output)} with answers ${JSON.stringify(answers)}`, () => {
            const newVar = (<any>answersHandler(zendeskSearch)(answers));
            expect(newVar).toEqual(output);
        }));
});
