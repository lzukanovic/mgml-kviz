const populate = async (db) => {
  await db.section.create({
    title: 'Razstava Emona',
    description: 'Najboljša razstava o rimskem mestu Emona, oz. bivša Ljubljana.'
  });
  await db.section.create({
    title: 'Kmalu prihajajoča razstava',
    description: 'To je opis neke nove razstave, ki se bo kmalu odprla!'
  });
  await db.question.create({
    title: 'Iz katerega zgodovinskega obdobja je mesto Emona?',
    description: 'Zgodovinska obdobja so na primer: kamena doba, bronasta doba, železna doba (1200-550 pnš) itd.',
    sectionId: 1,
    type: 'singleChoice',
    content: 'text'
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
    text: 'Čas Rimskega imerija',
    questionId: 1,
    order: 2,
    count: 100
  });
};

module.exports = populate
