import React from 'react';

export default class Category {
    // Create new instances of the same class as static attributes
    static categories = [
        'Electrics',
        'Gardening',
        'Painting',
        'Plumbing',
        'Woodworking',
        'Other'
    ]

    static returnSelection() {
        return this.categories.map((e) => <option>{e}</option>)
    }
}
