"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Optional {
    constructor(val) {
        this._value = val;
    }
    static of(nonNullableVal) {
        if (!nonNullableVal) {
            throw new Error('value cannot be null! Did you mean to use ofNullable instead?');
        }
        return new Optional(nonNullableVal);
    }
    static ofNullable(nullableVal) {
        return new Optional(nullableVal);
    }
    static empty() {
        return Empty.get();
    }
    get() {
        if (!this._value) {
            throw new Error('The value cannot be null!');
        }
        return this._value;
    }
    ifPresent(consumer) {
        if (this._value) {
            consumer(this._value);
        }
    }
    orElse(alternate) {
        if (this._value) {
            return this._value;
        }
        return alternate;
    }
    filter(predicate) {
        if (this._value) {
            if (predicate(this._value)) {
                return this;
            }
        }
        return Optional.empty();
    }
    map(transformer) {
        if (this._value) {
            return Optional.ofNullable(transformer(this._value));
        }
        return Optional.empty();
    }
}
exports.Optional = Optional;
class Empty {
    static get() {
        if (Empty.instance)
            return Empty.instance;
        Empty.instance = new Empty();
        return Empty.instance;
    }
    constructor() { }
    get() {
        throw new Error('There is nothing to get from nothingness!!!');
    }
    map(f) {
        throw new Error('Cannot transform nothingness!!');
    }
    filter(f) {
        throw new Error('Nothingness cannot be filtered!');
    }
    ifPresent(f) { }
    orElse(v) {
        return v;
    }
}
exports.Empty = Empty;
//# sourceMappingURL=optional.js.map