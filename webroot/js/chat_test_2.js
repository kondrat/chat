
//alert(location.host);
// Create Dklab_Realplexor client.
var realplexor = new Dklab_Realplexor(
    "http://rpl.chat/",  // Realplexor's engine URL
    "chat_" // namespace (optional)
);


// Subsctibe to channels.
realplexor.subscribe("Alpha", function(data, id) {
    $('#messages').innerHTML += data + "<br>";
});

realplexor.execute();


