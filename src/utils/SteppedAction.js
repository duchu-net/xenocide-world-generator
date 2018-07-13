// import { accumulateArray } from './arrays';
function accumulateArray(array, state, accumulator) {
  for (let i = 0; i < array.length; ++i) {
    state = accumulator(state, array[i])
  }
  return state
}

class SteppedAction{
	constructor(progressUpdater, unbrokenInterval, sleepInterval){
		this.callStack = null;
		this.subactions = [];
		this.finalizers = [];
		this.unbrokenInterval = (typeof (unbrokenInterval) === "number" && unbrokenInterval >= 0) ? unbrokenInterval : 16;
		this.sleepInterval = (typeof (sleepInterval) === "number" && sleepInterval >= 0) ? sleepInterval : 0;
		this.loopAction = false;
		this.started = false;
		this.canceled = false;
		this.completed = false;
		this.intervalIteration = 0; //number of times an unbroken interval has been completed
		this.stepIteration = 0; //number of times any of the stepper functions have been called
		this.intervalStepIteration = null; //number of times any of the stepper functions have been called during the current interval
		this.intervalStartTime = null; //begin time of the current interval
		this.intervalEndTime = null; //end time of the current interval
		this.progressUpdater = (typeof (progressUpdater) === "function") ? progressUpdater : null;
	}



	execute(){
		if (!this.canceled && !this.completed && this.callStack === null && this.started === false){
			this.started = true;
			if (this.subactions.length > 0){
				this.beginSubactions(0, 1);
				if (this.progressUpdater !== null)
					this.progressUpdater(this);
				setTimeout(this.step.bind(this), this.sleepInterval);
			} else{
				this.completed = true;
			}
		}
		return this;
	}

	step(){
		this.intervalStartTime = Date.now();
		this.intervalEndTime = this.intervalStartTime + this.unbrokenInterval;
		this.intervalStepIteration = 0;
		while (Date.now() < this.intervalEndTime && !this.canceled && !this.completed){
			var action = this.callStack.actions[this.callStack.index];

			this.callStack.loop = false;
			action.action(this);
			this.intervalStepIteration += 1;
			this.stepIteration += 1;

			if (this.subactions.length > 0){
				this.beginSubactions(this.getProgress(), (this.callStack.loop) ? 0 : (1 - this.callStack.loopProgress) * action.proportion / this.callStack.proportionSum * this.callStack.parentProgressRange);
			} else{
				while (this.callStack !== null && this.callStack.loop === false && this.callStack.index === this.callStack.actions.length - 1){
					for (var i = 0; i < this.callStack.finalizers.length; ++i){
						this.callStack.finalizers[i](this);
					}
					this.callStack = this.callStack.parent;
				}
				if (this.callStack !== null){
					if (this.callStack.loop === false){
						this.callStack.loopProgress = 0;
						this.callStack.index += 1;
					}
				} else{
					this.completed = true;
				}
			}
		}
		this.intervalStartTime = null;
		this.intervalEndTime = null;
		this.intervalStepIteration = null;

		if (this.progressUpdater !== null)
			this.progressUpdater(this);

		this.intervalIteration += 1;
		if (this.canceled){
			while (this.callStack !== null){
				for (var i = 0; i < this.callStack.finalizers.length; ++i){
					this.callStack.finalizers[i](this);
				}
				this.callStack = this.callStack.parent;
			}
		} else if (!this.completed){
			setTimeout(this.step.bind(this), this.sleepInterval);
		}
	}

	beginSubactions(parentProgress, parentProgressRange){
		this.callStack = {
			actions: this.subactions,
			finalizers: this.finalizers,
			proportionSum: accumulateArray(this.subactions, 0, function (sum, subaction) {
					return sum + subaction.proportion;
			}),
			index: 0,
			loop: false,
			loopProgress: 0,
			parent: this.callStack,
			parentProgress: parentProgress,
			parentProgressRange: parentProgressRange,
		};
		this.subactions = [];
		this.finalizers = [];
	}

	cancel(){
		this.canceled = true;
	}

	provideResult(resultProvider){
		this.callStack.resultProvider = resultProvider;
	}

	loop(progress){
		this.callStack.loop = true;
		if (typeof (progress) === "number" && progress >= 0 && progress < 1){
			this.callStack.loopProgress = progress;
		}
	}

	executeSubaction(subaction, proportion, name){
		proportion = (typeof (proportion) === "number" && proportion >= 0) ? proportion : 1;
		this.subactions.push({action: subaction, proportion: proportion, name: name});
		return this;
	}

	getResult(recipient){
		this.subactions.push({
				action: function (action){
					var resultProvider = action.callStack.resultProvider;
					var resultProviderType = typeof (resultProvider);
					if (resultProviderType === "function")
						recipient(resultProvider());
					else if (resultProviderType !== "undefined")
						recipient(resultProvider);
					else
						recipient();
				},
				proportion: 0,
		});
		return this;
	}

	finalize(finalizer) {
		this.finalizers.push(finalizer);
		return this;
	}

	getTimeRemainingInInterval() {
		if (this.intervalEndTime !== null) {
			return Math.max(0, this.intervalEndTime - Date.now());
		} else {
			return 0;
		}
	}

	getProgress(){
		if (this.callStack !== null){
			if (this.callStack.proportionSum === 0)
				return this.callStack.parentProgress;

			var currentProportionSum = 0;
			for (var i = 0; i < this.callStack.index; ++i){
				currentProportionSum += this.callStack.actions[i].proportion;
			}
			currentProportionSum += this.callStack.loopProgress * this.callStack.actions[this.callStack.index].proportion;
			return this.callStack.parentProgress + currentProportionSum / this.callStack.proportionSum * this.callStack.parentProgressRange;
		} else{
			return this.completed ? 1 : 0;
		}
	}

	getCurrentActionName(){
		var callStack = this.callStack;
		while (callStack !== null){
			var action = callStack.actions[callStack.index];
			if (typeof (action.name) === "string")
				return action.name;
			callStack = callStack.parent;
		}

		return "";
	}
}

export default SteppedAction;
