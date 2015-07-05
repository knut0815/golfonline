////////////////////////////////////////////////////////////// 
////////////// Redraw functions for each swing /////////////// 
////////////////////////////////////////////////////////////// 
function redrawSwing(numSwings) {
	
	data[(numSwings-1)] = {
		AttackAngle: normal_random(meanAoA, stdAoA),
        BallSpeed: normal_random(meanBallSpeed, stdBallSpeed),
        Carry: normal_random(meanCarry, stdCarry),
        ClubSpeed: normal_random(meanClubSpeed, stdClubSpeed),
        Side: (Math.random() < 0.5 ? -1 : 1) * normal_random(meanSide, stdSide),
        id: numSwings
	}

	//Take only those datapoints from data which happened after the start
	var subset = data.filter(function(d) { return d.id <= numSwings; });
	//Convert the data to numeric
	subset.forEach(function(d,i) {
		d.AttackAngle = +d.AttackAngle;
		d.BallSpeed = +d.BallSpeed;
		d.Carry = +d.Carry;
		d.ClubSpeed = +d.ClubSpeed;
		d.Side = +d.Side;
	})
	
	var index = numSwings-1;
	
	////////////////////////////////////////////////////////////// 
	/////////////////////// Ball Speed /////////////////////////// 
	////////////////////////////////////////////////////////////// 	

	var ballSpeedDelay = 1000,
		ballSpeedDuration = 2000;
		
	ballSpeedScale.domain([0, Math.max(meanBallSpeed, d3.max(subset, function(d) { return d.BallSpeed; }))*1.2]);
	ballSpeedAxis.scale(ballSpeedScale);
	//Update the x axis
	ballSpeed.select(".x.axis")
		.transition().duration(ballSpeedDuration).delay(ballSpeedDelay)
		.call(ballSpeedAxis);
		
	//Move the mean peer group bar
	if (chosenPeerGroup.length > 0) {
		ballSpeed.select(".meanBallSpeedLine")
			.transition().duration(ballSpeedDuration).delay(ballSpeedDelay)
			.attr("x1", ballSpeedScale(meanBallSpeed))
			.attr("x2", ballSpeedScale(meanBallSpeed));
	}//if
	
	//Increase size of circle at 0,0 (then the swing is "ejected" and then decrease size again
	ballSpeed.select(".startCircle")
		.transition("startCircleGrow").duration(1000).delay((ballSpeedDelay-1000))
		.attr("r", 20)
		.transition("startCircleBounce").duration(ballSpeedDuration*1.5).delay((ballSpeedDelay+500)).ease("elastic")
		.attr("r", 10);
		
  	//DATA JOIN
	//Join new data with old elements, if any
	var ballSpeedWrapper = ballSpeed.selectAll(".ballSpeedCircle")
		.data(subset, function(d) { return d.id; });
	  
	//UPDATE
	ballSpeedWrapper
		.transition().duration(ballSpeedDuration).delay(ballSpeedDelay)
			.style("opacity", 0.5)
			.attr("r", 5)
			.attr("cx", function(d) { return ballSpeedScale(d.BallSpeed); });;	
	
	//ENTER 
	ballSpeedWrapper
		.enter().append("circle")
			.attr("class", "ballSpeedCircle")
			.attr("cx", 0)
			.attr("cy", 0)
			.attr("r", 0)
			.style("fill", "#81BC00")
			.transition().duration(1000).delay((ballSpeedDelay-1000))
			.attr("r", 20)
			.transition().duration(ballSpeedDuration)
			.attr("r", 8)
			.attr("cx", function(d) { return ballSpeedScale(d.BallSpeed); });

	//EXIT
	ballSpeedWrapper.exit().remove();	
	
	//Move the pulsating dot that shows the current swing to the most recent swing
	ballSpeed.selectAll(".pulseCircle")
			.transition("move").duration(1000).delay(ballSpeedDelay-1000)
			.style("opacity", 0)
			.transition("move").duration(ballSpeedDuration)
			.attr("cx", ballSpeedScale(subset[index].BallSpeed))
			.transition("move").duration(2000)
			.style("opacity", 0.4); 

	////////////////////////////////////////////////////////////// 
	/////////////////////// Club Speed /////////////////////////// 
	////////////////////////////////////////////////////////////// 

	var clubSpeedDelay = 3000,
		clubSpeedDuration = 2000;

	clubSpeedScale.domain([0, Math.max(meanClubSpeed, d3.max(subset, function(d) { return d.ClubSpeed; }))*1.2]);
	clubSpeedAxis.scale(clubSpeedScale);
	//Update the x axis
	clubSpeed.select(".x.axis")
		.transition().duration(clubSpeedDuration).delay(clubSpeedDelay)
		.call(clubSpeedAxis);
		
	//Increase size of circle at 0,0 (then the swing is "ejected" and then decrease size again
	clubSpeed.select(".startCircle")
		.transition("startCircleGrow").duration(1000).delay((clubSpeedDelay-1000))
		.attr("r", 20)
		.transition("startCircleBounce").duration(clubSpeedDuration*1.5).delay((clubSpeedDelay+500)).ease("elastic")
		.attr("r", 10);

	//Move the mean peer group bar
	if (chosenPeerGroup.length > 0) {
		clubSpeed.select(".meanClubSpeedLine")
			.transition().duration(clubSpeedDuration).delay(clubSpeedDelay)
			.attr("x1", clubSpeedScale(meanClubSpeed))
			.attr("x2", clubSpeedScale(meanClubSpeed));
	}//if
		
  	//DATA JOIN
	//Join new data with old elements, if any
	var clubSpeedWrapper = clubSpeed.selectAll(".clubSpeedCircle")
		.data(subset, function(d) { return d.id; });
	  
	//UPDATE
	clubSpeedWrapper
		.transition().duration(clubSpeedDuration).delay(clubSpeedDelay)
			.style("opacity", 0.5)
			.attr("r", 5)
			.attr("cx", function(d) { return clubSpeedScale(d.ClubSpeed); });	
	
	//ENTER 
	clubSpeedWrapper
		.enter().append("circle")
			.attr("class", "clubSpeedCircle")
			.attr("cx", 0)
			.attr("cy", 0)
			.attr("r", 0)
			.style("fill", "#81BC00")
			.transition().duration(1000).delay((clubSpeedDelay-1000))
			.attr("r", 20)
			.transition().duration(clubSpeedDuration)
			.attr("r", 8)
			.attr("cx", function(d) { return clubSpeedScale(d.ClubSpeed); });

	//EXIT
	clubSpeedWrapper.exit().remove();	
	
	//Move the pulsating dot that shows the current swing to the most recent swing
	clubSpeed.selectAll(".pulseCircle")
			.transition("move").duration(1000).delay(clubSpeedDelay-1000)
			.style("opacity", 0)
			.transition("move").duration(clubSpeedDuration)
			.attr("cx", clubSpeedScale(subset[index].ClubSpeed))
			.transition("move").duration(2000)
			.style("opacity", 0.4); 
			
	////////////////////////////////////////////////////////////// 
	////////////////////// Cary & Side /////////////////////////// 
	////////////////////////////////////////////////////////////// 

	var carryDelay = 5000,
		carryDuration = 2000;

	//Save the zero-line distance of the last swing in a variable
	var triangle = Math.sqrt(subset[index].Carry*subset[index].Carry - subset[index].Side*subset[index].Side);

	carryScale.domain([0, Math.max(meanTriangle, d3.max(subset, function(d) { return Math.sqrt(d.Carry*d.Carry - d.Side*d.Side); }))*1.2]);
	carryAxis.scale(carryScale);
	//Update the x axis
	carry.select(".x.axis")
		.transition().duration(carryDuration).delay(carryDelay)
		.call(carryAxis);
		
	//Increase size of circle at 0,0 (then the swing is "ejected" and then decrease size again)
	carry.select(".startCircle")
		.transition("startCircleGrow").duration(1000).delay((carryDelay-1000))
		.attr("r", 20)
		.transition("startCircleBounce").duration(carryDuration*1.5).delay((carryDelay+500)).ease("elastic")
		.attr("r", 10);
	
	//Move the mean peer group symbols
	if (chosenPeerGroup.length > 0) {
		carry.selectAll(".meanCarrySymbol")
			.transition().duration(carryDuration).delay(carryDelay)
			.attr("transform", function(d) { return "translate(" + carryScale(meanTriangle)  + ", " + (d*carryScale(meanSide)) + ")"; });
	}//if
	
  	//DATA JOIN
	//Join new data with old elements, if any
	var carryWrapper = carry.selectAll(".carryCircle")
		.data(subset, function(d) { return d.id; });
	  
	//UPDATE
	carryWrapper
		.transition().duration(carryDuration).delay(carryDelay)
			.style("opacity", 0.5)
			.attr("r", 5)
			.attr("cx", function(d) { return carryScale(Math.sqrt(d.Carry*d.Carry - d.Side*d.Side)); })
			.attr("cy", function(d) { return carryScale(d.Side); });
	
	//ENTER 
	carryWrapper
		.enter().append("circle")
			.attr("class", "carryCircle")
			.attr("cx", 0)
			.attr("cy", 0)
			.attr("r", 0)
			.style("fill", "#81BC00")
			.transition().duration(1000).delay((carryDelay-1000))
			.attr("r", 20)
			.transition().duration(carryDuration)
			.attr("r", 8)
			.attr("cx", function(d) { return carryScale(Math.sqrt(d.Carry*d.Carry - d.Side*d.Side)); })
			.attr("cy", function(d) { return carryScale(d.Side); });

	//EXIT
	carryWrapper.exit().remove();	
	
	//Move the pulsating dot that shows the current swing to the most recent swing
	carry.selectAll(".pulseCircle")
			.transition("move").duration(1000).delay(carryDelay-1000)
			.style("opacity", 0)
			.transition("move").duration(carryDuration)
			.attr("cx", carryScale(triangle))
			.attr("cy", carryScale(subset[index].Side))
			.transition("move").duration(2000)
			.style("opacity", 0.4); 
			
	//Move the line to show the actual side
	carry.selectAll(".sideLine")
		.attr("x1", carryScale(triangle) + 0.1*carryScale.domain()[1])
		.attr("x2", carryScale(triangle) + 0.1*carryScale.domain()[1])
		.attr("y2", 0)
		.transition().duration(1000).delay(carryDelay+carryDuration)
		.attr("y2", carryScale(subset[index].Side));
	//Move the text to print the side
	carry.selectAll(".sideText")
		.style("opacity", 0)
		.attr("x", carryScale(triangle) + 0.1*carryScale.domain()[1] + 10)
		.attr("y", carryScale(subset[index].Side))
		.text("Side: " + Math.round(subset[index].Side,0) + " m")
		.transition().duration(1000).delay(carryDelay+carryDuration+1000)
		.style("opacity", 1);
		
	//Move the line to show the actual carry
	carry.selectAll(".carryLine")
		.attr("x2", 0)
		.attr("y2", 0)
		.transition().duration(1000).delay(carryDelay+carryDuration)
		.attr("x2", carryScale(triangle))
		.attr("y2", carryScale(subset[index].Side) + (subset[index].Side >= 0 ? 1 : -1)*0.1*carryScale.domain()[1]);
	//Move the text to print the side
	carry.selectAll(".carryText")
		.style("opacity", 0)
		.attr("x", carryScale(triangle))
		.attr("y", carryScale(subset[index].Side) + (subset[index].Side >= 0 ? 1 : -1)*(0.1*carryScale.domain()[1] + 15))
		.text("Carry: " + Math.round(subset[index].Carry,0) + " m")
		.transition().duration(1000).delay(carryDelay+carryDuration+1000)
		.style("opacity", 1);
		
	////////////////////////////////////////////////////////////// 
	///////////////////// Angle of Attack //////////////////////// 
	////////////////////////////////////////////////////////////// 

	var AoADelay = 9000,
		AoADuration = 1000;

	//Update the exis if needed
	var maxAngle = Math.max(Math.abs(d3.min(subset, function(d) { return d.AttackAngle; })), Math.abs(d3.max(subset, function(d) { return d.AttackAngle; })))*1.1;
	AoAScale.domain([Math.min(-5, -1*maxAngle), Math.max(5, maxAngle)]);
	
	//Move the mean peer group line
	if (chosenPeerGroup.length > 0) {
		AoA.selectAll(".meanAoALine")
			.transition().duration(AoADuration).delay(AoADelay)
			.attr("x2", Math.cos(AoAScale(meanAoA) * Math.PI/180) * lineLength)
			.attr("y2", Math.sin(AoAScale(meanAoA) * Math.PI/180) * lineLength);
	}//if
	
  	//DATA JOIN
	//Join new data with old elements, if any
	var AoAwrapper = AoA.selectAll(".AoALine")
		.data(subset, function(d) { return d.id; });
	  
	//UPDATE
	AoAwrapper
		.transition().duration(AoADuration).delay(AoADelay)
			.style("opacity", 0.5)
			.style("stroke-width", "2")
			.attr("x2", function(d) { return Math.cos(AoAScale(d.AttackAngle) * Math.PI/180) * lineLength; })
			.attr("y2", function(d) { return Math.sin(AoAScale(d.AttackAngle) * Math.PI/180) * lineLength; });
	
	//ENTER 
	AoAwrapper
		.enter().append("line")
			.attr("class", "AoALine")
			.attr("x1", 0)
			.attr("y1", 0)
			.attr("x2", function(d) { return Math.cos(AoAScale(d.AttackAngle) * Math.PI/180) * lineLength; })
			.attr("y2", function(d) { return Math.sin(AoAScale(d.AttackAngle) * Math.PI/180) * lineLength; })
			.style("stroke", "url(#gradientLinear)")
			.style("stroke-linecap", "round")
			.style("stroke-width", "4")
			.attr("stroke-dasharray", lineLength + " " + lineLength)
			.attr("stroke-dashoffset", lineLength)
			.transition().duration(AoADuration).delay(AoADelay)
				.attr("stroke-dashoffset", 0);
				
	//EXIT
	AoAwrapper.exit().remove();	
		
	//Move the golf ball to the front over the lines
	d3.select(".golfball").moveToFront();
	
	//Add arc and text for angle
	var startValue = subset[index].AttackAngle > 0 ? AoAScale(subset[index].AttackAngle) : 0,
		endValue = subset[index].AttackAngle > 0 ?  0 : AoAScale(subset[index].AttackAngle);
	//Append path for the angle
	AoA.select(".AoAPath")
			.attr("d", describeArc(0, 0, lineLength*0.9, 0, 0))
			.transition().duration(1000).delay(AoADelay+AoADuration)
			.attr("d", describeArc(0, 0, lineLength*0.9, startValue, endValue));	
	//Append text for the angle number
	AoA.select(".AoAText")
			.style("opacity", 0)
			.attr("x", function(d) { return Math.cos(AoAScale(subset[index].AttackAngle) * Math.PI/180) * lineLength + 10; })
			.attr("y", function(d) { return Math.sin(AoAScale(subset[index].AttackAngle) * Math.PI/180) * lineLength; })
			.style("fill", "#292929")
			.text("Angle of Attack: " + Math.round(subset[index].AttackAngle*100)/100 + "°")
			.transition().duration(1000).delay(AoADelay+AoADuration+1000)
			.style("opacity", 1);
	
	////////////////////////////////////////////////////////////// 
	///////////////////////// Finish ///////////////////////////// 
	////////////////////////////////////////////////////////////// 
	
	d3.select(".stepThreeTitle").transition().duration(500).delay(12000)
			.style("opacity", 0)
			.each("end", function(d) { d3.select(".stepThreeTitle").text("Ready for Swing " + (numSwings+1)) })
			.transition().duration(500)
			.style("opacity", 1);
}//redrawSwing