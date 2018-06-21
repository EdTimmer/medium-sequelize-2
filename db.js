const Sequelize = require('sequelize');
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost:5432/ships_db');

const Ship = conn.define('ship', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  purpose: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

const Member = conn.define('member', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  species: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

Member.belongsTo(Ship);
Ship.hasMany(Member);

const seed = () => {
  return Promise.all([
    Ship.create({ name: 'Enterprise', purpose: 'exploration' }),
    Ship.create({ name: 'Planet Express', purpose: 'delivery' }),
    Member.create({ name: 'Kirk', species: 'human' }),
    Member.create({ name: 'Spock', species: 'hybrid' }),
    Member.create({ name: 'McCoy', species: 'human' }),
    Member.create({ name: 'Leela', species: 'mutant' }),
    Member.create({ name: 'Fry', species: 'human' }),
    Member.create({ name: 'Bender', species: 'robot' })
  ])
  .then(([enterprise, planetexpress, kirk, spock, mccoy, leela, fry, bender]) => {
    return Promise.all([
      kirk.setShip(enterprise),
      spock.setShip(enterprise),
      mccoy.setShip(enterprise),
      leela.setShip(planetexpress),
      fry.setShip(planetexpress),
      bender.setShip(planetexpress)
    ]);
  })
  .catch(error => console.log(error));
};

//SEARCH FOR SPOCK'S SHIP WITH EAGER LOADING OF ALL ROWS OF SHIPS TABLE

conn.sync({ force: true })
.then(() => seed())
.then(() => Member.findOne({
  where: {
    name: 'Spock'
  },
    include: [{
      model: Ship
    }]
  }))
.then(member => console.log(member.ship.name))
.catch(error => console.log(error));

//SEARCH FOR ALL CREW MEMBERS OF ENTERPRISE WITH EAGER LOADING OF ALL ROWS OF MEMBERS TABLE

// conn.sync({ force: true })
// .then(() => seed())
// .then(() => Ship.findOne({
//   where: {
//     name: 'Enterprise'
//   },
//     include: [{
//       model: Member
//     }]
//   }))
// .then(ship => ship.members.forEach(member => console.log(member.name)))
// .catch(error => console.log(error));

//SEARCH FOR ALL HUMAN CREW MEMBERS OF ENTERPRISE WITH EAGER LOADING OF ONLY HUMANS FROM THE MEMBERS TABLE

// conn.sync({ force: true })
// .then(() => seed())
// .then(() => Ship.findOne({
//   where: {
//     name: 'Enterprise'
//   },
//     include: [{
//       model: Member,
//       where: {
//         species: 'human'
//       }
//     }]
//   }))
// .then(ship => ship.members.forEach(member => console.log(member.name)))
// .catch(error => console.log(error));





