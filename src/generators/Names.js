class Names {
  static get namingStrategies() {
    return [
      [1, Names.PlainMarkov],
      [.1, Names.NamedStar],
    ]
  }
  static names = ["Trevor","Yeltsin","Barnard","Genovese", "Martin", "Simon", "Rob", "Ed", "Walter", "Mohammed", "Emil", "Shannon", "Nicole", "Yury",
            "Coleman","Deanne","Rosenda","Geoffrey","Taryn","Noreen","Rita","Jeanetta","Stanton","Alesha","Mark","Georgiann","Modesta","Lee",
            "Cyndi","Raylene","Ellamae","Sharmaine","Candra","Karine","Trena","Tarah","Dorie","Kyoko","Wei","Cristopher","Yoshie","Meany","Zola",
            "Corene","Suzie","Sherwood","Monnie","Savannah","Amalia","Lon","Luetta","Concetta","Dani","Sharen","Mora","Wilton","Hunter","Nobuko",
            "Maryellen","Johnetta","Eleanora","Arline","Rae","Caprice"]

  static PlainMarkov(random) {
    // TODO
    return Names.NamedStar(random)
  }
  static NamedStar(random) {
    return random.choice(Names.names) //+ "'s Star";
  }

  static Generate(random, count = 1) {
    return random.weighted(Names.namingStrategies)(random)

    // var choices = [];
    // while (choices.length < count) {
    //   var newChoice = Names.Generate(random)
    //   // if (choices.Add(newChoice))
    //   choices.push(newChoice)
    //   yield newChoice;
    // }
  }
}

export default Names
