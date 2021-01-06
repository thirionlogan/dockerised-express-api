exports.seed = (knex) => {
  return knex('book')
    .del()
    .then(() => {
      return knex('book').insert([
        {
          title: 'Lord of the Rings',
          author: 'J. R. R. Tolkien',
          ISBN: '0618645616',
        },
        {
          title: 'The Hobbit',
          author: 'J. R. R. Tolkien',
          ISBN: '9780618968633',
        },
        {
          title: 'Start With Why',
          author: 'Simon Sinek',
          ISBN: '9781591842804',
        },
      ]);
    });
};
