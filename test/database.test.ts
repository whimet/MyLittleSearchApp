import Database from "../src/database";

describe('Database', () => {
    const userCollectionKey = 'User';
    const firstUser = {
        _id: 1,
        name: 'Francisca Rasmussen',
        created_at: '2016-04-15T05:19:46 -10:00',
    };
    const secondUser = {_id: 2, tags: ['Foxworth']};
    let db: Database;

    beforeAll(() => {
        db = new Database([{
            name: userCollectionKey,
            records: [firstUser, secondUser]
        }, {name: 'Ticket', records: [{_id: '436bf9b0-1147-4c0a-8439-6f79833bff5b', assignee_id: 24}]}]);
    });

    test('should expose search terms', () => {
        expect(db.searchableEntities).toEqual([{name: 'User', terms: ['_id', 'name', 'created_at', 'tags']}, {
            name: 'Ticket',
            terms: ['_id', 'assignee_id']
        }]);
    });

    test('should search by term and value', () => {
        expect(db.search(userCollectionKey, '_id', 1)).toEqual([firstUser]);
        expect(db.search(userCollectionKey, 'tags', 'Foxworth')).toEqual([secondUser]);
    });
});
