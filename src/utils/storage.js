import {Log} from './log'


const nullStorage = {
    items: new Map(),
    setItem : function(key,val) {
        return this.items.set(key,val)
    },
    getItem : function(key) {
        return this.items.get(key)
    },
    removeItem : function(key) {
        return this.items.delete(key)
    },
    length: function() {
        return this.items.size;
    }
}


export class Storage{ 

    constructor(prefix = 'svc.storage.',storage) {
        this._prefix = prefix;
        this._storage = storage || window.localStorage || nullStorage;
    }

    set(key, value) {
        Log.debug("svc.storage.set", key);

        key = this._prefix + key;

        this._storage.setItem(key, value);

        return Promise.resolve();
    }

    get(key) {
        Log.debug("svc.storage.get", key);

        key = this._prefix + key;

        let val = this._storage.getItem(key);

        return Promise.resolve(val);
    }

    remove(key) {
        Log.debug("svc.storage.remove", key);

        key = this._prefix + key;

        let val = this._storage.getItem(key);
        this._storage.removeItem(key);

        return Promise.resolve(val);
    }

    getAllKeys() {
        Log.debug("svc.storage.getAllKeys");

        let keys = [];

        for (let index = 0; index < this._storage.length; index++) {
            let key = this._storage.key(index);

            if (key.indexOf(this._prefix) === 0) {
                keys.push(key.substr(this._prefix.length));
            }
        }

        return Promise.resolve(keys);
    }
}