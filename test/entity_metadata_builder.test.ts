import EntityMetadataBuilder from "../src/entity_metadata_builder";

describe('EntityMetadataBuilder', () => {
    const userEntity = 'Users';
    const ticketsEntity = 'Tickets';
    const firstUser = {
        _id: 1,
        name: 'Francisca Rasmussen'
    };
    const secondUser = {_id: 2, tags: ['Foxworth']};
    const invalidUser = {_id: '3'};

    [
        {
            collections: [{
                name: userEntity,
                records: [firstUser, secondUser]
            }, {name: ticketsEntity, records: [{_id: '436bf9b0-1147-4c0a-8439-6f79833bff5b'}]}],
            metadata: [
                {
                    name: userEntity,
                    terms: [{name: '_id', type: 'number'},
                        {name: 'name', type: 'string'},
                        {name: 'tags', type: 'Array'}]
                },
                {name: ticketsEntity, terms: [{name: '_id', type: 'string'}]}
            ]
        },
        {collections: [], metadata: []}
    ].forEach(({collections, metadata}) =>
        test(`should build entity metadata for collections ${collections}`, () => {
            const entityMetadata = new EntityMetadataBuilder(collections).build();
            expect(entityMetadata).toEqual(metadata)
        }));


    test('should fail if term type changes', () => {
        expect(() => new EntityMetadataBuilder([{
            name: userEntity,
            records: [firstUser, invalidUser]
        }]).build()).toThrow(`Property '_id' has value type 'number', but now got a different type 'string'`);
    });
});
