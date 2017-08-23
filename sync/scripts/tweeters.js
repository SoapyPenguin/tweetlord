function getTweeter() {

  var tweeters = {
    'Katy Perry':'@katyperry',
    'Justin Bieber':'@justinbieber',
    'Barack Obama':'@barackobama',
    'Taylor Swift':'@taylorswift13',
    'Rihanna':'@rihanna',
    'Ellen DeGeneres':'@TheEllenShow',
    'YouTube':'@YouTube',
    'Lady Gaga':'@ladygaga',
    'Justin Timberlake':'@jtimberlake',
    'Twitter':'@Twitter',
    'Brittany Spears':'@britneyspears',
    'Kim Kardashian West':'@KimKardashian',
    'CNN Breaking News':'@cnnbrk',
    'Selena Gomez':'@selenagomez',
    'Ariana Grande':'@ArianaGrande',
    'jimmy fallon':'@jimmyfallon',
    'Demi Lovato':'@ddlovato',
    'Shakira':'@shakira',
    'Jennifer Lopez':'@JLo',
    'Instagram':'@instagram',
    'The New York Times':'@nytimes',
    'Oprah Winfrey':'@Oprah',
    'LeBron James':'@KingJames',
    'Bill Gates':'@BillGates',
    'CNN':'@CNN',
    'Drizzy':'@Drake'
  };

  var tkeys = Object.keys(tweeters);
  var randhandle = tweeters[tkeys[ tkeys.length * Math.random() << 0]];
  var randtweeter = tkeys.find(key => tweeters[key] === randhandle);

  return randtweeter + "///" + randhandle;

}
