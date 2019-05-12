import Database from "../src/database";

describe('Database', () => {
    const userEntity = 'Users';
    const firstUser = {
        _id: 1,
        name: 'Francisca Rasmussen',
        created_at: '2016-04-15T05:19:46 -10:00',
    };
    const secondUser = {_id: 2, tags: ['Foxworth']};
    let db: Database;

    beforeAll(() => {
        db = new Database([{
            name: userEntity,
            records: [firstUser, secondUser]
        }, {name: 'Ticket', records: [{_id: '436bf9b0-1147-4c0a-8439-6f79833bff5b', assignee_id: 24}]}]);
    });

    test('should expose search terms', () => {
        expect(db.searchableEntities).toEqual([{name: userEntity, terms: ['_id', 'name', 'created_at', 'tags']}, {
            name: 'Ticket',
            terms: ['_id', 'assignee_id']
        }]);
    });

    describe('should search by term value', () => {
        it('with number', () => {
            expect(db.search(userEntity, '_id', 1)).toEqual([firstUser]);
        });

        it('with string', () => {
            expect(db.search(userEntity, 'name', 'Francisca Rasmussen')).toEqual([firstUser]);
        });

        it('with array', () => {
            expect(db.search(userEntity, 'tags', 'Foxworth')).toEqual([secondUser]);
        });
    });
});
