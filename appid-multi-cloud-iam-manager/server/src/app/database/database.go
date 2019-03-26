package database

import "strings"

type Database struct {
	store map[string]interface{}
}

func NewDatabaseClient() (*Database, error) {
	database := &Database{
		store: make(map[string]interface{}),
	}
	return database, nil
}

func (d *Database) Keys(prefix string) []string {
	keys := make([]string, 0, len(d.store))
	for k := range d.store {
		if strings.HasPrefix(k, prefix) {
			keys = append(keys, k)
		}
	}
	return keys
}

func (d *Database) Get(key string) interface{} {
	return d.store[key]
}

func (d *Database) Set(key string, object interface{}) {
	if d.store == nil {
		d.store = make(map[string]interface{})
	}
	d.store[key] = object
}

func (d *Database) Delete(key string) {
	_, ok := d.store[key]
	if ok {
		delete(d.store, key)
	}
}
