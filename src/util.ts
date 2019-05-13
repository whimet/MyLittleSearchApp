import * as fs from "fs";

export const quit = 'quit';

export function readJson(file: string): any {
    try {
        const content = fs.readFileSync(file);
        return JSON.parse(content.toString());
    } catch (e) {
        throw `Failed to read ${file} as JSON:\n${e}`;
    }
}

export function isAnswerValid(answers: any, questionName: string) {
    const previousAnswer = answers[questionName];
    return previousAnswer != null && previousAnswer !== quit;
}

export function validateInput(input: string, validAnswers: string[]): boolean | string {
    return [quit].concat(validAnswers).includes(input) || 'Invalid answer';
}

export function clone(obj: any): any {
    return obj && Object.assign({}, obj);
}

export function cloneWithProperties(obj: any, properties: string[]): any {
    if (!obj) return obj;

    const copy = clone(obj);
    Object.keys(copy).forEach(k => {
        if (!properties.includes(k)) {
            delete copy[k];
        }
    });
    return copy;
}

export function getType(value: any): string {
    if (typeof value === 'object' && value.constructor === Array) {
        return 'Array';
    }
    return typeof value;
}

