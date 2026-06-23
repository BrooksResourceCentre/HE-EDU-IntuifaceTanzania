/**
* @license
* Copyright © 2015 Intuilab
*
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), 
* to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
* and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
* 
* The Software is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, 
* fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability, 
* whether in an action of contract, tort or otherwise, arising from, out of or in connection with the Software or the use or other dealings in the Software.
* 
* Except as contained in this notice, the name of Intuilab shall not be used in advertising or otherwise to promote the sale, 
* use or other dealings in this Software without prior written authorization from Intuilab.
*/

/**
* Inheritance on EventEmitter base class
* @type {EventEmitter}
*/
SimpleCounter.prototype = new EventEmitter();        // Here's where the inheritance occurs
SimpleCounter.prototype.constructor = SimpleCounter;

/**
* @constructor
*/
function SimpleCounter() {
    var initialValue = 0;
    var count = 0;
    var coerceValue = false;
    var minValue = 0;
    var maxValue = 100;

    Object.defineProperty(this, 'InitialValue',{
        get: function(){ return initialValue; },
        set: function(value){
            if(initialValue != value){
                initialValue = value;
                if(this.CoerceValue)
                    initialValue = this._CoerceValue(initialValue);
                this.emit('InitialValueChanged');
            }
        }
    });

    Object.defineProperty(this, 'Count',{
        get: function(){ return count; },
        set: function(value){
            if(count != value){
                count = value;
                if (this.CoerceValue)
                    count = this._CoerceValue(count);
                this.emit('CountChanged', [count]);
            }
        }
    });

    Object.defineProperty(this, 'CoerceValue',{
        get: function(){ return coerceValue; },
        set: function(value){
            if(coerceValue != value){
                coerceValue = value;
                this.emit('CoerceValueChanged');
                if(coerceValue){
                    //refresh values
                    this.InitialValue = this._CoerceValue(this.InitialValue);
                    this.Count = this._CoerceValue(this.Count);
                }
            }
        }
    });

    Object.defineProperty(this, 'MinValue',{
        get: function(){ return minValue; },
        set: function(value){
            if(minValue != value){
                minValue = value;
                this.emit('MinValueChanged');
                if(this.CoerceValue){
                    //refresh values
                    this.InitialValue = this._CoerceValue(this.InitialValue);
                    this.Count = this._CoerceValue(this.Count);
                }
            }
        }
    });

    Object.defineProperty(this, 'MaxValue',{
        get: function(){ return maxValue; },
        set: function(value){
            if(maxValue != value){
                maxValue = value;
                this.emit('MaxValueChanged');
                if(this.CoerceValue){
                    //refresh values
                    this.InitialValue = this._CoerceValue(this.InitialValue);
                    this.Count = this._CoerceValue(this.Count);
                }
            }
        }
    });


}

//Setters
SimpleCounter.prototype.setInitialValue = function (InitialValue) {
    // Override setter of InitialValue when coming from IntuiFace.
    // An action from IntuiFace to set the InitialValue will also reset the Count property
    this.InitialValue = InitialValue;
    this.Count = this.InitialValue;
};

// Internal method to coerce values between min & max
SimpleCounter.prototype._CoerceValue = function (value) {
	var v = (value > this.MaxValue) ? this.MaxValue : (value < this.MinValue) ? this.MinValue : value;	
	return v;
}


/**
* Add one to the counter
*/
SimpleCounter.prototype.AddOne = function () {
    this.Count++;
};
/**
* Add the argument value to the counter
* @param increment the increment value
*/
SimpleCounter.prototype.Add = function (increment) {
    this.Count += increment;
};
/**
* Remove one to the counter
*/
SimpleCounter.prototype.SubstractOne = function () {
    this.Count--;
};
/**
* Remove the argument value to the counter
* @param increment the increment value
*/
SimpleCounter.prototype.Substract = function (increment) {
    this.Count -= increment;
};
/**
* Remove one to the counter
*/
SimpleCounter.prototype.Reset = function () {
    this.Count = this.InitialValue;
};

/**
* Directly sets a value
* @param set the current value
*/
SimpleCounter.prototype.SetNewCountValue = function (value) {
    this.Count = value;
};


