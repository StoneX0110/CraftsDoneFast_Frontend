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

    static returnOptions() {
        let options = [];
        this.categories.forEach(o => {
            options.push({value: o, label: o});
        });
        return options;
    }

    static returnRadioButtons() {
        return this.categories.map(c =>
            <div className="form-check">
                <label>
                    <input className="form-check-input" type="radio" name="categorySelection" value={c}/>
                    {c}
                </label>
            </div>);
    }
}
