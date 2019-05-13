export interface EntityCollection {
    name: string,
    records: any[]
}

export interface SearchableEntity {
    name: string,
    terms: string[]
}

export interface EntityMetadata {
    name: string,
    terms: TermMetadata[]
}

export interface TermMetadata {
    name: string,
    type: string
}
