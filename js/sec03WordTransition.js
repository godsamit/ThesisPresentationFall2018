var QUOTES=[
  '"Language is <em>inadequate</em> to formulate the exact meaning and the rich variations of the realm of sensory experiences" <br>— Bauhaus, The New Vision<br><br>"Language is <em>at the core</em> of making, using and understanding buildings." <br>— Tom Markus',
  '"A picture can tell a thousand words, but a few words can <em>change its story.</em>" <br>— Sebastyne Young <br><br>"Appearance <em>blinds</em>, wheareas words <em>reveal.</em>" <br>— Oscar Wilde',
  '"The ability to <em>visualize something internally</em> is closely linked with the ability to <em>describe it verbally</em>. Verbal and written descriptions create highly specific mental images... The link between vision, visual memory, and verbalization can be quite startling." <br>— Robert Rivlin, Karen Gravelle'
]
var i = 0
setInterval(function(){
  $(".keyQuote").fadeOut("slow", function(){ 
  $(".keyQuote").html(QUOTES[i]).fadeIn( "slow" );})
  i = (i+1)%3;
}, 6000);