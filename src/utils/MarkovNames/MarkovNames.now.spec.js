// import * as alphabet from './alphabet'
import assert from 'assert'
import Random from '../RandomObject'
import ModelBuilder from './MarkovModelBuilder'

describe('MarkovNames utils', () => {
  // it('should export greekLetterNameToLetter Function', () => {
  //   assert.equal(typeof alphabet.greekLetterNameToLetter, 'function')
  // })

  it('should teach one', () => {
    const m = new ModelBuilder(2);
    m.Teach("a");
    assert.ok(true)
  });

  it('should generate \'abcdefghijk\'', () => {
    const mod = new ModelBuilder(2)
      .Teach("abcdefghijk")
      .toModel();
    assert.equal('abcdefghijk', mod.Generate(new Random(1234567890)))
  });


  const starNames = [
    "Acamar", "Achernar", "Achird", "Acrab",
    "Akrab", "Elakrab", "Graffias", "Acrux",
    "Acubens", "Adhafera", "Adhara", "Ain",
    "Aladfar", "Alamak", "Alathfar", "Alaraph",
    "Albaldah", "Albali", "Albireo", "Alchiba",
    "Alcor", "Alcyone", "Aldebaran", "Alderamin",
    "Aldhafera", "AlDhanab", "Aldhibah", "Aldib",
    "AlFawaris", "Alfecca", "Meridiana", "Alfirk",
    "Algedi", "AlGiedi", "Algenib", "Algieba",
    "Algol", "Algorab", "Alhajoth", "Alhena",
    "Alioth", "Alkaid", "AlKurud", "AlKalb", "AlRai",
    "Alkalurops", "AlKaphrah", "Alkes", "Alkurah", "Almach",
    "AlMinliar", "AlAsad", "AlNair", "Alnasl", "Alnilam",
    "Alnitak", "Alniyat", "Alphard", "Alphecca", "Alpheratz", "Alrai",
    "Alrakis", "Alrami", "Alrischa", "Alruccbah", "Alsafi",
    "Alsciaukat", "Alshain", "Alshat", "Altair", "Altais",
    "Altarf", "Alterf", "AlThalimain", "Aludra", "Alula",
    "Alwaid", "Alya", "Alzir", "Ancha", "Angetenar", "Ankaa",
    "Antares", "Arcturus","Arich","Arided", "Arkab", "Armus", "Arneb",
    "Arrakis","Ascella","Asellus","Ashlesha","Askella","Aspidiske",
    "Asterion","Asterope","Atik","Atlas","Atria","Auva", "Avior","Azaleh",
    "Azelfafage","Azha","Azimech","Azmidiske",

    "Baham", "Biham", "Baten", "Kaitos", "Becrux", "Beid", "Bellatrix",
    "Benetnasch", "Betelgeuse", "Botein", "Brachium",

    "Canopus", "Capella", "Caph", "Chaph", "Caphir", "Caput", "Medusae", "Castor",
    "Castula", "Cebalrai", "Celbalrai", "Ceginus", "Celaeno", "Chara", "Cheleb",
    "Chertan", "Chort", "Cor", "Caroli", "Hydrae", "Leonis", "Scorpii", "Serpentis",
    "Coxa", "Cujam", "Caiam", "Cursa", "Cynosura",

    "Dabih", "Decrux", "Deneb", "Denebola", "Dheneb", "Diadem", "Diphda",
    "Dnoces", "Dschubba", "Dubhe", "Duhr",

    "Edasich", "Electra", "Elmuthalleth", "Elnath", "Eltanin", "Enif",
    "Errai", "Etamin",

    "Fomalhaut", "FumalSamakah", "Furud",

    "Gacrux", "Garnet", "Gatria", "Gemma", "Gianfar", "Giedi", "GienahGurab", "Girtab",
    "Gomeisa", "Gorgonea", "Graffias", "Grafias", "Grassias", "Grumium",

    "Hadar", "Hadir", "Haedus", "Haldus", "Hamal", "Hassaleh", "Hydrus", "Heka", "Heze",
    "Hoedus", "Homam", "Hyadum", "Hydrobius",

    "Izar",

    "Jabbah", "Jih",

    "Kabdhilinan", "Kaffaljidhma", "Kajam", "Kastra", "Kaus", "Media", "Keid", "Kitalpha",
    "Kleeia", "Kochab", "Kornephoros", "Kraz", "Ksora", "Kullat", "Kuma",

    "Lanx", "Librae", "Superba", "Lesath", "Lucida",

    "Maasym", "Mahasim", "Maia", "Marfark", "Marfik", "Markab", "Matar", "Mebsuta", "Megrez",
    "Meissa", "Mekbuda", "Menchib", "Menkab", "Menkalinan", "Menkar", "Menkent", "Menkib",
    "Merak", "Merga", "Merope", "Mesarthim", "Miaplacidus", "Mimosa", "Minchir", "Minelava",
    "Minkar", "Mintaka", "Mira", "Mirach", "Miram", "Mirfak", "Mirzam", "Misam", "Mizar",
    "Mothallah", "Muliphein", "Muphrid", "Murzim", "Muscida",

    "Nair", "Naos", "Nash", "Nashira", "Navi", "Nekkar", "Nembus", "Neshmet", "Nihal", "Nunki",
    "Nusakan",

    "Okul",

    "Peacock", "Phact", "Phad", "Pherkad", "Pleione", "Polaris", "Pollux", "Porrima", "Praecipua",
    "Procyon", "Propus", "Proxi", "Pulcherrim",

    "Rana", "Ras", "Rasalas", "Rastaban", "Thaoum", "Regor", "Regulus", "Rigel", "Rigil", "Rijl",
    "Rotanev", "Ruchba", "Ruchbah", "Rukbat",

    "Sabik", "Sadachbia", "Sadalbari", "Sadalmelik", "Sadalsuud", "Sadatoni", "Sadira", "Sadr",
    "Sadlamulk", "Saiph", "Saiph", "Salm", "Sargas", "Sarin", "Sceptrum", "Scheat", "Scheddi",
    "Schedar", "Segin", "Seginus", "Sham", "Shaula", "Sheliak", "Sheratan", "Shurnarkabti", "Shashutu",
    "Sinistra", "Sirius", "Situla", "Skat", "Spica", "Sterope", "Sterope", "Sualocin", "Subra", "Suhail",
    "Suhel", "Sulafat", "Sol", "Syrma",

    "Tabit", "Talitha", "Tania", "Tarazet", "Tarazed", "Taygeta", "Tegmen", "Tegmine", "Terebellum", "Tejat",
    "Thabit", "Theemin", "Thuban", "Tien", "Toliman", "Torcularis", "Tseen", "Turais", "Tyl",

    "Unukalhai", "Unuk",

    "Vega", "Vindemiatrix",

    "Wasat", "Wei", "Wezen", "Wezn",

    "Yed", "Yildun",

    "Zaniah", "Zaurak", "Zavijava", "Zawiat", "Zedaron", "Zelphah", "Zibal", "Zosma", "Zuben", "Zubenelgenubi",
    "Zubeneschamali"
  ]

  it('should teach', (done) => {
    const m = new ModelBuilder(3);
    m.TeachArray(starNames);
    var mod = m.toModel();
    const r = new Random('abc')

    let count = 10;
    const generated = []
    while (count > 0) {
      var n = mod.Generate(r)//.Trim();
      // console.log('name', n);
      if (!starNames.find(s => s.toLowerCase() == n) && !generated.find(s => s == n)) {
        generated.push(n)
        console.log('Uniq name:', generated.length, n)
        count--
      }
    }

    assert.equal(0, count)
    done()
  }).timeout(10000)
})
