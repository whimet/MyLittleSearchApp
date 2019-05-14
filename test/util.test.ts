import {clone, cloneWithProperties, getType, isAnswerValid, readJson, validateInput} from "../src/util";

describe('Util', () => {
    describe('readJson', () => {
        it('should read successfully', () => {
            expect(readJson('./data/users.json').length).toEqual(75);
        });

        it('should throw error if fails', () => {
            const file = './invalid_file';
            expect(() => readJson(file)).toThrow(`Failed to read ${file} as JSON`);
        });
    });

    [
        {
            answers: {question1: 'answer1'},
            question: 'question1',
            valid: true
        },
        {
            answers: {question1: 'quit'},
            question: 'question1',
            valid: false
        },
        {
            answers: {question1: 'answer1'},
            question: 'question2',
            valid: false
        },
    ].forEach(({answers, question, valid}) =>
        it(`${question} should be ${valid} with ${answers}`, () => {
            expect(isAnswerValid(answers, question)).toBe(valid);
        }));

    [
        {
            validAnswers: ['1'],
            input: '1',
            result: true
        },
        {
            validAnswers: ['1'],
            input: 'quit',
            result: true
        },
        {
            validAnswers: ['1'],
            input: '2',
            result: 'Invalid answer'
        },
        {
            validAnswers: ['1'],
            input: '',
            result: 'Invalid answer'
        },
    ].forEach(({validAnswers, input, result}) =>
        it(`${input} should be ${result} with ${validAnswers}`, () => {
            expect(validateInput(input, validAnswers)).toEqual(result);
        }));

    [
        {
            obj: {foo: 'bar'},
            result: {foo: 'bar'}
        },
        {
            obj: null,
            result: null
        },
        {
            obj: undefined,
            result: undefined
        },
    ].forEach(({obj, result}) =>
        it(`clone of ${obj} should be ${result}`, () => {
            expect(clone(obj)).toEqual(result);
        }));

    [
        {
            obj: {foo: 'bar', bar: 'foo'},
            properties: ['foo'],
            result: {foo: 'bar'}
        },
        {
            obj: {foo: 'bar'},
            properties: [],
            result: {}
        },
        {
            obj: null,
            properties: [],
            result: null
        },
        {
            obj: undefined,
            properties: [],
            result: undefined
        },
    ].forEach(({obj, properties, result}) =>
        it(`clone of ${obj} with properties ${properties} should be ${result}`, () => {
            expect(cloneWithProperties(obj, properties)).toEqual(result);
        }));

    [
        {
            obj: 1,
            result: 'number'
        },
        {
            obj: '1',
            result: 'string'
        },
        {
            obj: [],
            result: 'Array'
        },
        {
            obj: {},
            result: 'object'
        },
    ].forEach(({obj, result}) =>
        it(`type of ${obj} should be ${result}`, () => {
            expect(getType(obj)).toEqual(result);
        }));
});
