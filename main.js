var nontypes = ['psn', 'brn', 'powder', 'trapped', 'sandstorm',
'tox', 'hail', 'frz', 'par'];

function bold(text){
  return "<b>" + text + "</b>";
}

function typeformat(type, text){
  if (typeof(text) === null) text = type;
  return '<div class=\"type\" style=\"background:' + typecolor[type] + '\">' + text + '</div>';
}

function effectiveness(type, effect_chart){
  $.each(typechart[type].damageTaken, function(index, val) {
    if ($.inArray(index, nontypes) == -1){
      if (val == 1) effect_chart[index] *= 2;
      if (val == 2) effect_chart[index] /= 2;
      if (val == 3) effect_chart[index] = 0;
    }
  });
  return effect_chart;
}


function pokesearch(){
  var pokemon = pokedex[$('#poketext').val().toLowerCase()];
  if (pokemon === null){
    alert("Invalid Pokemon Name!");
    return;
  } 
  $('#pokename').html(pokemon.species);
  $('#types').html(pokemon.types.map(function(elem) {
      return typeformat(elem, elem);
  }).join(""));

  $('#pokepic').attr({
    alt: pokemon.species,
    src: 'http://img.pokemondb.net/artwork/'+
      $('#poketext').val().toLowerCase()+'.jpg'
  });

  $('#abilities').html(Object.keys(pokemon.abilities).map(function (key){
      return pokemon.abilities[key];
    }).join(', ')
  );
  var default_dmg = {
    "Bug": 1,
    "Dark": 1,
    "Dragon": 1,
    "Electric": 1,
    "Fairy": 1,
    "Fighting": 1,
    "Fire": 1,
    "Flying": 1,
    "Ghost": 1,
    "Grass": 1,
    "Ground": 1,
    "Ice": 1,
    "Normal": 1,
    "Poison": 1,
    "Psychic": 1,
    "Rock": 1,
    "Steel": 1,
    "Water": 1
  };
  for (var i = 0; i < pokemon.types.length; i++){
    default_dmg = effectiveness(pokemon.types[i], default_dmg);
  }
  var resist = [], weak = [], immune = [];
  for (var key in default_dmg){
    if ($.inArray(key, nontypes) == -1){
      switch(default_dmg[key]){
        case 0.25:  resist.unshift(typeformat(key, bold(key))); break;
        case 0.5:   resist.push(typeformat(key));       break;
        case 2:     weak.push(typeformat(key));         break;
        case 4:     weak.unshift(typeformat(key, bold(key)));   break;
        case 0:     immune.push(typeformat(key));       break;
      }
    }
  }
  $('#resist').html(resist.join(""));
  $('#weak').html(weak.join(""));
  $('#immune').html(immune.join(""));

  var base_stats = pokemon.baseStats;

  var ctx = $('#stats').get(0).getContext('2d');
  var data = {
    labels: ["HP", "Attack", "Defense", "Sp.Atk", "Sp.Def", "Speed"],
    datasets: [{
      label: "Stats",
      fillColor: "rgba(0,0,220,0.75)",
      strokeColor: "rgba(220,220,220,0.8)",
      highlightFill: "rgba(0,0,220,0.95)",
      highlightStroke: "rgba(220,220,220,1)",
      data: [
        base_stats.hp, base_stats.atk, base_stats.def, base_stats.spa, 
        base_stats.spd, base_stats.spe
      ]
    }]
  };
  var stats_chart = new Chart(ctx).Bar(data, {});
  return;
}

