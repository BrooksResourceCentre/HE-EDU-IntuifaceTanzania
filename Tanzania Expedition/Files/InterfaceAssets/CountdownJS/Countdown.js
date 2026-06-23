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
Countdown.prototype = new EventEmitter();        // Here's where the inheritance occurs
Countdown.prototype.constructor = Countdown;

/**
* @constructor
*/
function Countdown() {
	this.setSeconds(10);
	this.setMinutes(0);
	this.setHours(0);
	this.setDays(0);
    this.formatTime();
};

/**
* Launch the countdown
*/
Countdown.prototype.start = function () {
	if (this._timer == null)
	{
		if (this._initialSeconds == null)
		{
			this._initialSeconds = this.seconds;
			this._initialMinutes = this.minutes;
			this._initialHours = this.hours;
			this._initialDays = this.days;
		}

        this.formatTime();
	    
		var self = this;
		this._timer = setInterval(function(){self.update()}, 1000);
		this.emit('started');
	}
};
/**
* Pause the countdown
*/
Countdown.prototype.pause = function () {
	if (this._timer != null)
	{
		clearInterval(this._timer);
		this._timer = null;
		
		this.emit('paused');
	}
};
/**
* Reset the countdown
*/
Countdown.prototype.reset = function () {

    if (this._initialSeconds != null){
        this.setSeconds(this._initialSeconds);
        this.setMinutes(this._initialMinutes);
        this.setHours(this._initialHours);
        this.setDays(this._initialDays);

        this.formatTime();
    }
};
/**
* Update the countdown
*/
Countdown.prototype.update = function () {
    if (this.seconds <= 1 && this.minutes == 0 && this.hours == 0 && this.days == 0) {
        this.setSeconds(0);
        this.formatTime();
        this.pause();
    }
    else {
        // decrease seconds
        if (this.seconds > 0) {
            this.setSeconds(this.seconds - 1);
        } else {
            this.setSeconds(59);

            //decrease minutes
            if (this.minutes > 0) {
                this.setMinutes(this.minutes - 1);
            } else {
                this.setMinutes(59);

                // decrease hours
                if (this.hours > 0) {
                    this.setHours(this.hours - 1);
                } else {
                    this.setHours(23);
                    
                    // decrease days
                    this.setDays(this.days - 1);
                }
            }
        }
        
        // always format time
        this.formatTime();
    }
};
/**
* Format current time
*/
Countdown.prototype.formatTime = function () {
	this.time =   (this.days > 0 ? this.days+"d " : "") + this.formattedHours + ":" + this.formattedMinutes + ":" + this.formattedSeconds;
	this.emit('timeChanged', [this.hours, this.minutes, this.seconds]);
};

/**
* Set seconds property
*/
Countdown.prototype.setSeconds = function (seconds) {
    if (this.seconds != seconds) {
        this.seconds = seconds;
        this.emit('secondsChanged');
        
        this.formattedSeconds = (this.seconds < 10 ? "0" + this.seconds : this.seconds);
        this.emit('formattedSecondsChanged');
    }
    this.computeTotalProperties();
};

/**
* Set minutes property
*/
Countdown.prototype.setMinutes = function (minutes) {
    if (this.minutes != minutes) {
        this.minutes = minutes;
        this.emit('minutesChanged');
        
        this.formattedMinutes = (this.minutes < 10 ? "0" + this.minutes : this.minutes);
        this.emit('formattedMinutesChanged');
    }
    this.computeTotalProperties();
};

/**
* Set hours property
*/
Countdown.prototype.setHours = function (hours) {
    if (this.hours != hours) {
        this.hours = hours;
        this.emit('hoursChanged');
        
        this.formattedHours = (this.hours < 10 ? "0" + this.hours : this.hours);
        this.emit('formattedHoursChanged');
    }
    this.computeTotalProperties();
};

/**
* Set days property
*/
Countdown.prototype.setDays = function (days) {
    if (this.days != days) {
        this.days = days;
        this.emit('daysChanged');
    }
    this.computeTotalProperties();
};

/**
 * Compute total days, total hours, total minutes, total seconds remaining
 */
Countdown.prototype.computeTotalProperties = function()
{
    if(this.days != null && this.hours != null && this.minutes != null && this.seconds != null)
    {
        this.totalDays = this.days + (this.hours / 24) + (this.minutes / (24 * 60)) + (this.seconds / (24 * 60 * 60));
        // round with 4 decimals max (to prevent E-5 for example in .NET player)
        this.totalDays = Math.round(this.totalDays * 10000) / 10000;
        this.emit('totalDaysChanged');
        this.totalHours = this.days * 24 + this.hours + (this.minutes / 60) + (this.seconds / (60 * 60));
        this.totalHours = Math.round(this.totalHours * 10000) / 10000;
        this.emit('totalHoursChanged');
        this.totalMinutes = (this.days * 24 * 60) + this.hours * 60 + this.minutes + (this.seconds / 60);
        this.totalMinutes = Math.round(this.totalMinutes * 10000) / 10000;
        this.emit('totalMinutesChanged');
        this.totalSeconds = (this.days * 24 * 60 * 60) + (this.hours * 60 * 60) + (this.minutes * 60) + (this.seconds);
        this.totalSeconds = Math.round(this.totalSeconds * 10000) / 10000;
        this.emit('totalSecondsChanged');
    }
};