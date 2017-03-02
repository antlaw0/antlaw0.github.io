var audio = new Audio();
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var infoArea=document.getElementById("info");

var goButton = document.getElementById("goButton");
goButton.addEventListener('click', travel);
var buyEnergyInput = document.getElementById("howMuchEnergyToBuy");
var buyEnergyButton=document.getElementById("buyEnergyButton");
buyEnergyButton.addEventListener('click', buyEnergy);
var selectedLocation=null;
var mx=0;
var my=0;


var all_locations=[];



canvas.addEventListener("mousemove", mousePos);
function mousePos()
{
	mx = event.offsetX;
    my = event.offsetY;   //offsetX, offsetY, may not work in older browsers


	//document.getElementById("coordinates").innerHTML="X:  "+ mx+", Y:  "+my;

    
}


canvas.addEventListener('click', showInfo);
var Location = function(n, description, link, x, y, color, energyCost) {
  this.name = n;
this.x=x;
this.y=y;
this.description=description;
this.link=link;
this.color=color;
this.energyCost=energyCost;
drawCircle(this.x, this.y, 5, color);
  
  all_locations.push(this); //add newly created location object to array
  
};

//initialize all locations
var Sol = new Location("Sol System", "Human home system. Home to human-kind. Breathable atmosphere.", "https://en.wikipedia.org/wiki/Sun", canvas.width/2, canvas.height/2, "blue", 2);
var Alpha = new Location("Alpha Centauri System", "Nearest star system to Earth. Consists of three stars, Alpha, Beta, and Proxima. Hosts Moderately sized trading outpost.", "https://en.wikipedia.org/wiki/Alpha_Centauri", canvas.width/2+30, canvas.height/2+30, "red", 4);
var Wolf=new Location("Wolf 359", "Red dwarf, part of the Leo constellation. A small outpost can be found here for trading.", "https://en.wikipedia.org/wiki/Wolf_359", canvas.width/2-55, canvas.height/2-55, "orange", 5); 
var currentLocation=Sol;

var ship = function() {
  this.name = "Ship";
this.x=Sol.x;
this.y=Sol.y;
context.font = "12px Arial";
context.fillStyle="white";
context.fillText("You are here", this.x+10, this.y);  
};
var ship = new ship();


//set initial HTML of the info area
infoArea.innerHTML="<h2>"+Sol.name+"</h2><br>"+Sol.description+"<br> <a href="+Sol.link+"> Go to Wikipedia page </a>";

function showInfo()
{
var clickBox=10;
var l=null;
	
for (var i=0; i<all_locations.length; i++)
{
	
if (mx > all_locations[i].x-clickBox && mx < all_locations[i].x+clickBox)
if (my > all_locations[i].y-clickBox && my < all_locations[i].y+clickBox)

{
audio.src="beep.wav";
audio.play();
l=all_locations[i];
selectedLocation=l;
infoArea.innerHTML="<h2>"+l.name+"</h2><br>"+l.description+"<br>Distance from current position: "+parseInt(getDistance(ship.x, ship.y, l.x, l.y))+" parsecs"+
"<br> Cost to refuel: "+parseInt(l.energyCost)+" credits per unit"+"<br> <a href="+l.link+"> Go to Wikipedia page </a>";


}


}
redrawCanvas();	
}

var credits=100;
var creditsDisplayArea=document.getElementById("creditsTotal");
var shipHealth=100;
var energy=1000;
var enginesScore=100;
var sensorsScore=100;
var weaponsScore=100;
var shieldsScore =100;
var weaponsModifiedElement=document.getElementById("weaponsModifiedRating");
var enginesModifiedElement=document.getElementById("enginesModifiedRating");
var shieldsModifiedElement=document.getElementById("shieldsModifiedRating");
var sensorsModifiedElement=document.getElementById("sensorsModifiedRating");
var energyTotalDisplayArea=document.getElementById("displayTotalEnergyValue");
var energyAvailableDisplayArea = document.getElementById("displayAvailableEnergyValue");
var displayShipHealthElement = document.getElementById("displayHealth");
var displayEnginesValue=document.getElementById("displayEnginesValue");
var enginesPercent = 50;
var weaponsPercent=50;
var shieldsPercent=50;
var sensorsPercent=50;

enginesModifiedElement.innerHTML=enginesScore*(enginesPercent/100);
weaponsModifiedElement.innerHTML=weaponsScore*(weaponsPercent/100);
shieldsModifiedElement.innerHTML=shieldsScore*(shieldsPercent/100);
sensorsModifiedElement.innerHTML=sensorsScore*(sensorsPercent/100);

updateValues();

function showEnginesValue(newValue)
{
	document.getElementById("enginesDisplayValue").innerHTML=newValue;
	enginesPercent=newValue;
	
	updateValues();
}


function showWeaponsValue(newValue)
{
	document.getElementById("weaponsDisplayValue").innerHTML=newValue;
	weaponsPercent=newValue;
	updateValues();

}

function showShieldsValue(newValue)
{
	document.getElementById("shieldsDisplayValue").innerHTML=newValue;
	shieldsPercent=newValue;
		updateValues();
}


function showSensorsValue(newValue)
{
	document.getElementById("sensorsDisplayValue").innerHTML=newValue;
	sensorsPercent=newValue;
		updateValues();
}

  
function updateValues()
{
displayShipHealthElement.innerHTML= "Ship Health:  "+shipHealth;
creditsDisplayArea.innerHTML="Total Credits:  "+parseInt(credits);
//if scores change, update their new values in the document
document.getElementById("enginesRating").innerHTML=enginesScore;
document.getElementById("weaponsRating").innerHTML=weaponsScore;
document.getElementById("shieldsRating").innerHTML=shieldsScore;
document.getElementById("sensorsRating").innerHTML=sensorsScore;

//update the modified system values
enginesModifiedElement.innerHTML=enginesScore*(enginesPercent/100);
weaponsModifiedElement.innerHTML=weaponsScore*(weaponsPercent/100);
shieldsModifiedElement.innerHTML=shieldsScore*(shieldsPercent/100);
sensorsModifiedElement.innerHTML=sensorsScore*(sensorsPercent/100);


energyTotalDisplayArea.innerHTML= "Total Energy to be consumed:  "+getTotalEnergyUse();
energyAvailableDisplayArea.innerHTML="Available Energy: "+energy;
}

function getTotalEnergyUse()
{
var total=0;
total+=parseInt(enginesModifiedElement.innerHTML);
total+=parseInt(weaponsModifiedElement.innerHTML);
total+=parseInt(shieldsModifiedElement.innerHTML);
total+=parseInt(sensorsModifiedElement.innerHTML);



return total;
}





function drawCircle(x,y, radius,color)
{
context.beginPath();
context.arc(x, y,radius,0,2*Math.PI);
context.fillStyle=color;
context.fill();

	
}


function getDistance(x1,y1,x2,y2)
{
	var a = x1 - x2;
var b = y1 - y2;

var c = Math.sqrt( a*a + b*b );
c/=3
return c;
}

function travel()
{

var distance = getDistance(ship.x,ship.y,selectedLocation.x,selectedLocation.y);
var energyConsumption = Math.round(distance*3);
	if (distance>0)
	{
		var answer=confirm("Are you sure you want to set a course for "+selectedLocation.name+"? \n This trip will take "+energyConsumption+" units of your energy reserves plus an additional "+parseInt(getTotalEnergyUse())+" for a total of "+parseInt(getTotalEnergyUse()+energyConsumption)+" units of energy.");
		if (energy >= (getTotalEnergyUse()+energyConsumption))
		{
			if (answer==true)
			{
				audio.src="warp.wav";
		audio.play();
				ship.x=selectedLocation.x;
				ship.y=selectedLocation.y;
				currentLocation=selectedLocation;
				energy-=energyConsumption;
				updateValues();
				randomEvent();
	
			}
		
		}
		else {
			audio.src="negative.wav";
		audio.play();
		alert("You do not have enough energy to make this trip.");
		}
		
	}else {alert("You are already at that destination");}
	

redrawCanvas();
}



function redrawCanvas()
{
	context.clearRect(0,0, canvas.width, canvas.height);
	context.strokeStyle="yellow";
context.strokeRect(selectedLocation.x-10, selectedLocation.y-10, 20, 20);
context.font = "12px Arial";
context.fillStyle="white";
context.fillText("You are here",ship.x+10, ship.y);
var i=0;
for (i=0; i<all_locations.length; i+=1)
{
	drawCircle(all_locations[i].x, all_locations[i].y, 5, all_locations[i].color);

}

}

function buyEnergy()
{
	var units = buyEnergyInput.value;
	var total= units*currentLocation.energyCost;
	if (credits >= total)
	{
		audio.src="buy.wav";
		audio.play();
		alert("Purchased "+parseInt(units)+" units of energy. \n "+parseInt(total)+" credits were deducted from your account.");
		credits-=total;
		energy+=Number(units);
		updateValues();
		
	}
	else
	{
		audio.src="negative.wav";
		audio.play();
		alert("You do not have enough credits to purchase this amount of energy.");
	}
}



function randomInt(num)
{
	//return random integer between 1 and num
	return Math.floor(Math.random() * num)+1;
}

function randomEvent()
{
//generate random integer between 1 and 100
var rand = randomInt(100);
var enginesFactor = enginesScore*(enginesPercent/100)
var sensorsFactor = sensorsScore*(sensorsPercent/100)
var shieldsFactor = shieldsScore*(shieldsPercent/100)
var weaponsFactor = weaponsScore*(weaponsPercent/100)


	
	if (enginesFactor > rand)
	{
		if (sensorsFactor > rand)
		{
			alert("You spotted a potential threat on your sensors but managed to avoid it.");
		}
		else
		{
		alert("Your journey was uneventful.");
			
		}
	}
	else
	{
		enemyEncounter(); 
	}
}

function enemyEncounter()
{
var enginesFactor = enginesScore*(enginesPercent/100)
var sensorsFactor = sensorsScore*(sensorsPercent/100)
var shieldsFactor = shieldsScore*(shieldsPercent/100)
var weaponsFactor = weaponsScore*(weaponsPercent/100)

	var enemyDamage = randomInt(100);
	var enemyHealth=randomInt(100);
	var totalDamage= enemyDamage - shieldsFactor;
	var playerDamage= Math.floor(weaponsFactor+randomInt(weaponsFactor/4));
	
	//if damage is below 0, don't want to heal the player
	if (totalDamage<0)
	{
		totalDamage=0;
	}
	
	shipHealth-=totalDamage;
	
	var str = "You encounter a hostile ship! You are forced to defend yourself. Your ship takes "+totalDamage+" damage. You deal "+playerDamage+" damage to the enemy ship.";
	var extraString="";
	if (shipHealth < 0)
	{
		extraString = "Your ship is destroyed.";
	}
	else
	{
		extraString="You survived this encounter.";
	}
	audio.src="alarm.wav";
	audio.onPlaying = function(){alert(str+extraString);};
	audio.play();
	
//alert(str+extraString);
	
	updateValues();
}