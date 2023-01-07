const populate = async (db) => {
  // account
  await db.account.create({
    username: 'admin',
    hash: '6578b2b3a58ea42c6c53cbc7a42e110ee9662e731a01e74f3797c8bc26417a83c64881dabf20ca7c8fbf25cedda112389710fd739a7e8ee9e3bb755521eb6dcb',
    salt: '7c8f538a7e4b0badf6a07e33151633d5'
  });
  // razstava Emona
  await db.section.create({
    title: 'Razstava Emona',
    description: 'Najboljša razstava o rimskem mestu Emona, oz. bivša Ljubljana.'
  });
  // Q1
  await db.question.create({
    title: 'Iz katerega zgodovinskega obdobja je mesto Emona?',
    description: 'Zgodovinska obdobja so na primer: kamena doba, bronasta doba, železna doba (1200-550 pnš) itd.',
    sectionId: 1,
    type: 'singleChoice'
  });
  await db.answer.create({
    text: 'Srednji vek',
    questionId: 1,
    order: 0,
    count: 400
  });
  await db.answer.create({
    text: 'Kamena doba',
    questionId: 1,
    order: 1,
    count: 4
  });
  await db.answer.create({
    text: 'Čas Rimskega imperija',
    questionId: 1,
    order: 2,
    count: 100
  });
  // razstava Ljubljana
  await db.section.create({
    title: 'Ljubljana v prihodnosti',
    description: 'Obisk prvotnih planov za obnovo mesta Ljubljane, kakšno je dananšnjo stanje in izgled mesta v optimistični prihodnosti.'
  });
  // Q1
  await db.question.create({
    title: 'Ali bi si želel plavati v Ljubljanici, če bi bila čista?',
    description: 'Vsi vemo da reka Ljubljanica ni znana po tem da je čista za plavat, ampak ali ste vedeli da nekoč je bilo popularno kopališče za ljubljančane starih generacij? MOL se že dobro desetletje in več trudi da s čistočo te reke, a je napredek počasen.',
    sectionId: 2,
    type: 'singleChoice'
  });
  await db.answer.create({
    text: 'Ja',
    questionId: 2,
    order: 0,
    count: 678
  });
  await db.answer.create({
    text: 'Ne',
    questionId: 2,
    order: 1,
    count: 376
  });
  // Q2
  await db.question.create({
    title: 'Katerega izmed naštetih Plečnikovih neizvedenih projektov bi najraje videl dokončanega?',
    description: 'Razstava nam razkriva, kakšno bi bilo mesto, če bi Plečnik lahko uresničil svoje vizije za štiri velike ljubljanske projekte: novi magistrat, Mesarski most, parlament na grajskem hribu in Katedralo svobode v parku Tivoli.',
    sectionId: 2,
    type: 'multipleChoice'
  });
  await db.answer.create({
    text: 'Katedrala svetlobe',
    questionId: 3,
    order: 0,
    count: 785
  });
  await db.answer.create({
    text: 'Mesarski most',
    questionId: 3,
    order: 1,
    count: 576
  });
  await db.answer.create({
    text: 'Magistralni vstop na grad',
    questionId: 3,
    order: 2,
    count: 119
  });
  await db.answer.create({
    text: 'Magistrat na Vodnikovem trgu',
    questionId: 3,
    order: 3,
    count: 345
  });
  // Q3
  await db.question.create({
    title: 'V kakšni Ljubljani bi želel živeti v prihodnosti?',
    description: 'Zdaj je odgovor prepuščen vam. Na kratko nam opišite želje, mišljenja, ideje, predloge o Ljubljani, ki še bo.',
    sectionId: 2,
    type: 'singleChoice'
  });
  await db.answer.create({
    text: 'Prosti odgovor (N/A)',
    questionId: 4,
    order: 0,
    count: 0
  });
};

module.exports = populate
