let visitedAreas = [];
let powerOn = false;
let knifeState = -1;

class Start extends Scene {
    create() {

        this.engine.setTitle(this.engine.storyData.Title);
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.show(this.engine.storyData.Beginning);
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); // TODO: replace this text by the initial location of the story
    }
}

class Location extends Scene {

    create(key) {
        let locationData = this.engine.storyData.Locations[key]; // TODO: use `key` to get the data object for the current story location
        if(!visitedAreas.includes(key))
            {
                visitedAreas.push(key);
            }

        if(!powerOn){
            this.engine.show(locationData.Body[0]);
        }
        else {
            this.engine.show(locationData.Body[1]);
        }
        
        
        if(locationData.Choices) {
            for(let choice of locationData.Choices) { // TODO: loop over the location's Choices
                this.engine.addChoice(choice.Text, choice); // TODO: use the Text of the choice
                // TODO: add a useful second argument to addChoice so that the current code of handleChoice below works
            }
        } else {
            this.engine.addChoice("...")
        }
    }

    handleChoice(choice) {
        if(choice) {
            this.engine.show("&gt; "+choice.Text);
            if(choice.Text == "Turn on the Power") {
                this.engine.gotoScene(PowerMechanism, choice.Target);
            }
            if(choice.Text == "Pick up a Knife") {
                this.engine.gotoScene(KnifeKey, choice.Target);
            }
            if(choice.Text == "Use the Elevator") {
                this.engine.gotoScene(ElevatorEnd, choice.Target);
                if(powerOn) {
                    return;
                }
            }
            if(choice.Text == "Investigate the Drill Head") {
                this.engine.gotoScene(DrillEnd, choice.Target);
                if(knifeState == 1) {
                    return;
                }
            }
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class PowerMechanism extends Location {
    create(key) {
        let locationData = this.engine.storyData.Locations[key];
        if(powerOn == true) {
            this.engine.show(locationData.Body[2]);
        }
        else {
            this.engine.show(locationData.Power.On);
            powerOn = true;
        }
    }
}

class KnifeKey extends Location {
    create(key) {
        let locationData = this.engine.storyData.Locations[key];
        if(knifeState == -1) {
            this.engine.show(locationData.KnifeKey.PreLock);
        }
        else if(knifeState == 0) {
            this.engine.show(locationData.KnifeKey.PostLock);
            knifeState = 1;
        }
        else {
            this.engine.show(locationData.KnifeKey.PostKnife);
        }
    }
}

class ElevatorEnd extends Location {
    create(key) {
        let locationData = this.engine.storyData.Locations[key];
        if(powerOn) {
            this.engine.show(locationData.UseElevator.Power);
            this.engine.addChoice("...");
        }
        else {
            this.engine.show(locationData.UseElevator.NoPower);
        }
    }

    handleChoice() {
        this.engine.gotoScene(End);
    }

}

class DrillEnd extends Location {
    create(key) {
        let locationData = this.engine.storyData.Locations[key];
        if(!powerOn) {
            this.engine.show(locationData.SeaweedLock.PrePower);
        }
        else if(knifeState == -1) {
            this.engine.show(locationData.SeaweedLock.NoKnife);
            knifeState = 0;
        }
        else {
            this.engine.show(locationData.SeaweedLock.Knife);
            this.engine.addChoice("...");
        }
    }

    handleChoice() {
        this.engine.gotoScene(End);
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
        return;
    }
}

Engine.load(Start, 'myStory.json');