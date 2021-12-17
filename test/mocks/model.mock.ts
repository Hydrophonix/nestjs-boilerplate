// Core
import { DeleteResult } from "mongodb";

export abstract class MockModel<T> {
    protected abstract entityStub: T;

    // constructor(createEntityData: T) {
    //     this.constructorSpy(createEntityData);
    // }

    // constructorSpy(_createEntityData: T) {
    //     return _createEntityData;
    // }

    create() {
        return Promise.resolve(this.entityStub);
    }

    findOne() {
        return {
            exec: () => Promise.resolve(this.entityStub),
        };
    }

    findById() {
        return {
            exec: () => Promise.resolve(this.entityStub),
        };
    }

    findByIdAndUpdate() {
        return {
            exec: () => Promise.resolve(this.entityStub),
        };
    }

    deleteOne(): { exec: () => Promise<DeleteResult> } {
        return {
            exec: () => Promise.resolve({ deletedCount: 1, acknowledged: true }),
        };
    }

    countDocuments() {
        return {
            exec: () => Promise.resolve(1),
        };
    }

    find() {
        return this;
    }

    sort() {
        return this;
    }

    skip() {
        return this;
    }

    limit() {
        return this;
    }

    exec() {
        return Promise.resolve([ this.entityStub ]);
    }
}
