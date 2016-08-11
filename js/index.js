var tempoRange = 20;
var jogSpeed = 5;
var timeFactor = 0.05;

var song1 = new Audio('audio/Untitled2.mp3');
var song2 = new Audio('audio/TheseWalls.mp3');
var song3 = new Audio('audio/Alright.mp3');
var song4 = new Audio('audio/KingKunta.mp3');

var leftSong = null;
var rightSong = null;
var channel2load = '';

modVolumeLeft = 0;
modVolumeRight = 0;

rateLeft = 1;
rateRight = 1;

var audioCtx = null;

//
//left - Right Play
//
$('#left .play').click(function() {
	if (leftSong != null) {
		diff = (((($('#left .volume').offset().top-482)*-1)*0.5)/54);
		currentVolLeft = (0.5+diff) - (modVolumeLeft*(0.5+diff)/100);
		leftSong.volume = currentVolLeft.toFixed(2);  
		leftSong.playbackRate = rateLeft;
		if ($('#left .jog').hasClass('paused')) {
			$('#left .jog').removeClass('paused');
			$('#left .jog').addClass('running');
			marqueeLeft();
			leftSong.play();
		} else {
			$('#left .jog').removeClass('running');
			$('#left .jog').addClass('paused');
			marqueeLeftStop();
			leftSong.pause();
		}
	}
	else {
		requestSong();
	}
});

$('#right .play').click(function() {
	if (rightSong != null) {
		diff = (((($('#right .volume').offset().top-482)*-1)*0.5)/54);
		currentVolRight = (0.5+diff) - (modVolumeRight*(0.5+diff)/100);   
		rightSong.volume = currentVolRight.toFixed(2);
		rightSong.playbackRate = rateRight;
		if ($('#right .jog').hasClass('paused')) {
			$('#right .jog').removeClass('paused');
			$('#right .jog').addClass('running');
			marqueeRight();
			rightSong.play();
		} else {
			$('#right .jog').removeClass('running');
			$('#right .jog').addClass('paused');
			marqueeRightStop();
			rightSong.pause();
		}
	}	
	else {
		requestSong();
	}
});

//
// left - Right load
//

$('#left .load').click(function() {
  if ($('#left .jog').hasClass('paused')) {
  	toggleLoader('left');
  }
  else {
    askToPause();
  }
});

$('#right .load').click(function() {
  if ($('#right .jog').hasClass('paused')) {
		toggleLoader('right');
  }
  else {
    askToPause();
  }
});

//
// left - Right Tempo
// click & drag

$("#left .tempo").dblclick(function() {
  $('#left .tempo').animate({'top': 91}, 500, 'easeOutQuad');
  $('#left .info-tempo > strong').html('±0.00<span> %</span>');
  rateLeft = 1;    
});

$("#right .tempo").dblclick(function() {
  $('#right .tempo').animate({'top': 91}, 500, 'easeOutQuad');
  $('#right .info-tempo > strong').html('±0.00<span> %</span>');
  rateRight = 1;
});

$("#left .tempo").draggable({
  drag: dragLeftTempo,
  axis: "y",
  containment: [35, 187, 35, 294]
});

$("#right .tempo").draggable({
  drag: dragRightTempo,
  axis: "y",
  containment: [818, 187, 818, 294]
});

//
// Left - Right Volume
//

$("#left .volume").draggable({
  drag: dragLeftVolume,
  axis: "y",
  containment: [389, 428, 389, 536]
});

$("#right .volume").draggable({
  drag: dragRightVolume,
  axis: "y",
  containment: [465, 428, 465, 536]
});

//
// Left - Right Fade in - out
//

$("#crossfade").draggable({
  drag: crossFade,
  axis: "x",
  containment: 'parent'
});

//
// info Line function
//

function marqueeLeft() {
  $('#left .song').css('left', '100%');
  $('#left .song').animate({ 'left': (0 - $('#left .song').width()) }, 5000, 'linear', marqueeLeft);
}

function marqueeRight() {
    $('#right .song').css('left', '100%');
    $('#right .song').animate({ 'left': (0 - $('#right .song').width()) }, 5000, 'linear', marqueeRight);
}

function marqueeRightStop() {
  $('#right .song').stop();
	$('#right .song').animate({'left': '0'});
}

function marqueeLeftStop() {
  $('#left .song').stop();
  $('#left .song').animate({'left': '0'});
}

//
// Drag Left - Right Tempo & Volume funtion
//

function dragLeftTempo() {
  dragTempo('#left');
}

function dragRightTempo() {
  dragTempo('#right');
}

function dragLeftVolume() {
  if (leftSong != null) {  
    dragVolume('#left');
  }
}

function dragRightVolume() {
  if (rightSong != null) {      
    dragVolume('#right');
  }
}

function dragTempo(side) {
    val = (($(side+' .tempo').offset().top - 240.5) * tempoRange / 53.5).toFixed(2);
  	$(side+' .jog').css('animation-duration', jogSpeed-((jogSpeed*(val)/100))+'s');
    if (val > 0) {
      val = '+' + val;
    }
    $(side+' .info-tempo > strong').html(val+'<span> %</span>');
  switch(side) {
    case '#left':
      rateLeft = (1+(val/100)).toFixed(2);
      break;
    case '#right':
      rateRight = (1+(val/100)).toFixed(2);
      break;
  }  
}

function dragVolume(side) {
  diff = ((($(side+' .volume').offset().top-482)*-1)*0.5)/54;
  	switch(side) {
      case '#left':
	    	leftSong.volume = ((0.5+diff) - (modVolumeLeft*(0.5+diff)/100)).toFixed(2);
        break;
      case '#right':
        rightSong.volume = ((0.5+diff) - (modVolumeRight*(0.5+diff)/100)).toFixed(2);
        break;       
    }
}

//
// Fade in - out Function ( across Left - Right )
//

function crossFade() {
  currentVolLeft = (0.5+((($('#left .volume').offset().top-482)*-1)*0.5)/54).toFixed(2);
  currentVolRight = (0.5+((($('#right .volume').offset().top-482)*-1)*0.5)/54).toFixed(2);  
  if ($('#crossfade').position().left-57 < 0) {
    modVolumeLeft = 0;
    modVolumeRight = (($('#crossfade').position().left-57)*100/-57).toFixed(2);
  }
  else if ($('#crossfade').position().left-57 > 0) {
    modVolumeRight = 0;
    modVolumeLeft = (($('#crossfade').position().left-57)*100/57).toFixed(2);
  }
  else {
    modVolumeLeft = 0;
    modVolumeRight = 0;
  }
  if (leftSong != null) {
    leftSong.volume = currentVolLeft - (modVolumeLeft*currentVolLeft/100).toFixed(2);
  }
  if (rightSong != null) {
  	rightSong.volume = currentVolRight - (modVolumeRight*currentVolRight/100).toFixed(2);
  }
}

//
// less ? more ? |< & >| ?
//

$('#left .less').click(function() {
  if (leftSong != null) {    
  	leftSong.currentTime-=timeFactor;
  }
  else {
    requestSong();
  }
});

$('#left .more').click(function() {
  if (leftSong != null) {    
  	leftSong.currentTime+=timeFactor;
  }
  else {
    requestSong();
  }
});

$('#right .less').click(function() {
  if (rightSong != null) {    
  	rightSong.currentTime-=timeFactor;
  }
  else {
    requestSong();
  }
});

$('#right .more').click(function() {
  if (rightSong != null) {    
  	rightSong.currentTime+=timeFactor;
  }
  else {
    requestSong();
  }
});

//
// select Song
//

function setSong(id) {
  $('#'+channel2load+' .info-time').html('00:00');
  $('#'+channel2load+' input').attr('max', 0);
  $('#'+channel2load+' input').val(0);
  switch(id) {
    case 1:      
      loader = song1;
      $('#'+channel2load+' .song').html('Untitled2');
      toggleLoader(channel2load);
      break;
    case 2:
      loader = song2;
      $('#'+channel2load+' .song').html('TheseWalls');
      toggleLoader(channel2load);
      break;
    case 3:
      loader = song3;
      $('#'+channel2load+' .song').html('AlRight');
      toggleLoader(channel2load);
      break;
    case 4:
      loader = song4;
      $('#'+channel2load+' .song').html('King Kunta');
      toggleLoader(channel2load);
      break;
  }  
  if (channel2load == 'left') {
		leftSong = loader;
    leftSong.ontimeupdate = null;
    leftSong.ontimeupdate = function() {updateLeftTime()};
  }
  else {
    rightSong = loader;
    rightSong.ontimeupdate = null;
    rightSong.ontimeupdate = function() {updateRightTime()};
  }
}

//
// Tempo
//

function updateLeftTime() {
  	leftSong.playbackRate = rateLeft;
    $('#left .info-time').html(getTime(leftSong.currentTime));
  	$('#left input').attr('max', leftSong.duration.toFixed(0));
  	$('#left input').val(leftSong.currentTime.toFixed(0));
}

function updateRightTime() {
  	rightSong.playbackRate = rateRight;
    $('#right .info-time').html(getTime(rightSong.currentTime));
  	$('#right input').attr('max', rightSong.duration.toFixed(0));
  	$('#right input').val(rightSong.currentTime.toFixed(0));
}

//
// if user not select song, Caution!
//

function requestSong() {
  title = '¡No has cargado una canción!';
  options = {
    body: 'Carga una canción en este canal pulsando el botón "LOAD"',
    icon: 'http://www.michelacosta.com/yo.png',
  }
  Notification.requestPermission(function(status) {
    new Notification(title, options);
  });
}

//
// ?? ?? 
//

function askToPause() {
  title = '¡Tienes que parar la reproducción!';
  options = {
    body: 'Para la reproducción antes de cargar otro tema',
    icon: 'http://www.michelacosta.com/yo.png',
  }
  Notification.requestPermission(function(status) {
    new Notification(title, options);
  });
}

//
// ?? ??
//

function dislike() {
  title = '¡Desprecio infinito!';
  options = {
    body: 'No nos gustan los DJs que usan el SYNC',
    icon: 'http://www.michelacosta.com/yo.png',
  }
  Notification.requestPermission(function(status) {
    new Notification(title, options);
  });
}

function toggleLoader(deck) {
  channel2load = deck;
  if ($('#songloader').position().top == 150) {
  	$('#songloader').animate({'top': 20}, 600, 'easeOutQuad');   
    $('#'+deck+' .info').css('background-color','#000033');
  }
  else {
    $('#songloader').animate({'top': 150}, 600, 'easeOutQuad');
    $('#'+deck+' .info').css('background-color','#000');
  }  
}

function getTime(seconds) {
  var hr  = Math.floor(seconds / 3600);
  var min = Math.floor((seconds - (hr * 3600))/60);
  var sec = Math.floor(seconds - (hr * 3600) - (min * 60));
  if (min < 10){ min = "0" + min; }
  if (sec < 10){ sec  = "0" + sec; }
  return min + ':' + sec;
}

$('#left input').change(function() {
  if (leftSong != null) {
  	leftSong.currentTime = $(this).val();
  }
});

$('#right input').change(function() {
  if (rightSong != null) {
  	rightSong.currentTime = $(this).val();
  }    
});

$('.sync').click(function() {
  dislike();
});

$('#tutorial-button>div').click(function() {
  $('#tutorial-container').show();
});

$('#tutorial-container>p').click(function() {
  $('#tutorial-container').hide();
});

//playbackRate change
$('.palyback input').change(function() {
  if (leftSong != null) {
  	leftSong.currentTime = $(this).val();
  }
  var now = leftSong.currentTime = $(this).val();
  if(leftSong.lastTimeStamp > now)
  	return;
  	
  leftSong.lastBuffer += (now-leftSong.lastTimeStamp) * leftSong.lastPBR;
  leftSong.lastPBR = $(this).val();
  leftSong.lastTimeStamp = now;
  
  if(leftSong.lastBufferTime > leftSong.buffer.duration) {
  	leftSong.sourceNode = null;
  	leftSong.gainNode = null;
  	leftSong.lastPBR = leftSong.buffer.duration;
  	if ( $(this).val() >= 0 )
  		return;
  	else
  		leftSong.lastBufferTime = leftSong.buffer.duration;
  }
  if(leftSong.lastBufferTime < 0) {
  	leftSong.sourceNode = null;
  	leftSong.gainNode = null;
  	leftSong.lastPBR = 0;
  	if ( $(this).val() <= 0 )
  		return;
  	else
  		leftSong.lastBufferTime = 0;
  }
  if ( $(this).val() == 0 ) {
  	if(leftSong.sourceNode) {
  		leftSong.gainNode.gain.setTargetAtTime(0, now, 0.01);
  		leftSong.sourceNode.stop(now + 0.1);
  		leftSong.sourceNode = null;
  		leftSong.gainNode = null;
  	}
  	return;
  }
  
 if ( leftSong.sourceNode ) {
	    if (((leftSong.currentPlaybackRate > 0) && ($(this).val() < 0)) ||
	    	((leftSong.currentPlaybackRate < 0) && ($(this).val() > 0))	) {
	    	if (leftSong.sourceNode) {
				leftSong.gainNode.gain.setTargetAtTime( 0, now, 0.01 );
				leftSong.sourceNode.stop(now + 0.01*4);
				leftSong.sourceNode = null;
				leftSong.gainNode = null;
	    	}
	    }
	}

    // so... we may have just killed the sourceNode to flip, or 
    // we may have been stopped before.  Create the sourceNode,
    // pointing to the correct direction buffer.
	if (!leftSong.sourceNode) {
	    var sourceNode = audioCtx.createBufferSource();
	    sourceNode.loop = false;
	    leftSong.gainNode = audioCtx.createGain();
	    leftSong.gainNode.gain.value = leftSong.gain;
	    leftSong.gainNode.connect( leftSong.filter );
	    sourceNode.connect( leftSong.gainNode );
	    sourceNode.buffer = ($(this).val()>0) ? leftSong.buffer : leftSong.revBuffer;
	    var startTime = ($(this).val()>0) ? leftSong.lastBufferTime : sourceNode.buffer.duration-leftSong.lastBufferTime;
	    
    	sourceNode.playbackRate.setValueAtTime( Math.abs($(this).val()), now );
    	var duration = (sourceNode.buffer.duration - startTime);
        leftSong.gainNode.gain.value = 0.0;
        leftSong.gainNode.gain.setTargetAtTime( leftSong.gain, now, 0.01 );
		sourceNode.onended = shutDownNodeWhenDonePlaying.bind(sourceNode);
        sourceNode.start( now, startTime, duration );
	    leftSong.sourceNode = sourceNode;
	} else  // if I replace "now" with "0" below, Firefox works.
	    leftSong.sourceNode.playbackRate.setValueAtTime( Math.abs($(this).val()), now );
    leftSong.currentPlaybackRate = $(this).val();
});

//
// leap Motion Roll - Picth - Yaw 
//

var paused = false;
//
// SpaceBar click is pause
//
window.onkeypress = function(e) {
	if (e.charCode == 32) {
		if (paused == false) {
			paused = true;
		} else {
			paused = false;
		}
	}
};

var controller = new Leap.Controller({enableGestures: true});
controller.loop(function(frame) {
	latestFrame = frame;
	if (paused) {
		document.getElementById('pause').innerHTML = "<strong>PAUSED</strong>";
		return;
	}

	var str = "";
	for (var i in frame.handsMap) {
		var hand = frame.handsMap[i];
		var position = hand.palmNormal[1] * 10;
		var yv_pos = hand.palmVelocity[1];
		var zv_pos = hand.palmVelocity[2];
		
		str += "<p>" +
			"<strong>Roll:</strong> " + hand.roll() +
			"<br/><strong>Pitch:</strong> " + hand.pitch() +
			"<br/><strong>Yaw:</strong> " + hand.yaw() +
			"<br/><strong>Position Y:</strong>" + position +
			"<br/><strong>y_velocity :</strong> " + yv_pos +
			"<br/><strong>z_velocity :</strong> " + zv_pos +
			"</p>";
			
		///
		/// Tempo Control
		///
			
		if( zv_pos > 300 ) {
			if ( leftSong != null) {
				if( leftSong.playbackRate > 1.9 ) {
					leftSong.playbackRate = 2;
				} 
				else {
					leftSong.playbackRate = leftSong.playbackRate + 0.1;
				}
			}
		}
		
		if ( zv_pos < -300 ) {
			if ( leftSong != null ) {
				if ( leftSong.playbackRate < 0.6 ) {
					leftSong.playbackRate = 0.5;
				}
				else {
					leftSong.playbackRate = leftSong.playbackRate - 0.1;
				}
			}
		}
		
		//
		// Volume Control
		//
		
		if( yv_pos > 300 ){
			if (leftSong != null) {
				if(leftSong.volume > 0.9){
					leftSong.volume = 1;
				}
				else{				
				leftSong.volume = leftSong.volume + 0.1;
				}
			}
		}
		if( yv_pos < -300 ){
			if (leftSong != null) {    
				if(leftSong.volume < 0.1){
					leftSong.volume = 0;
				}
				else{				
				leftSong.volume = leftSong.volume - 0.1;
				}
			}
		}
		
		//
		// DJ Scratch
		//
		if( hand.yaw() < -0.7 ) {
			if (leftSong != null) {    
				leftSong.currentTime-=timeFactor;
				$('#left .jog').addClass('reverse');
				
			}
		}
		else {
				$('#left .jog').removeClass('reverse');
				$('#left .jog').addClass('running');
		}	
		
	}
	console.log(str);
	document.getElementById('out').innerHTML = str;

});



	
