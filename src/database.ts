interface Collection {
    name: string,
    records: any[]
}

interface SearchTerm {
    name: string,
    terms: string[]
}

export default class Database {
    private collections: Collection[];

    constructor(collections: Collection[]) {
        this.collections = collections;
    }

    public get searchTerms(): SearchTerm[] {
        return this.collections.map(c => ({name: c.name, terms: this.getPropertyNames(c.records)}));
    }

    private getPropertyNames(records: any[]): string[] {
        return Array.from(
            records.reduce((keys, record) =>
                    Object.keys(record)
                        .reduce((recordKeys, recordKey) =>
                            recordKeys.add(recordKey), keys),
                new Set()));
    }
}
