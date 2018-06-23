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
// Ship.hasMany(Member, {as: 'occupants'});

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

//SEARCH FOR FRY'S SHIP

conn.sync({ force: true })
.then(() => seed())
.then(() => Member.findOne({
  where: {
    name: 'Fry'
  },
    include: [{
      model: Ship
    }]
  }))
  // .then(member => console.log(JSON.stringify(member)))
  .then(member => console.log(`${member.name} is a crew member of ${member.ship.name}`))
  .catch(error => console.log(error));

//SEARCH FOR ALL CREW MEMBERS OF ENTERPRISE

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
// // .then(ship => console.log(JSON.stringify(ship)))
// .then(ship => ship.members.forEach(member => console.log(member.name)))
// .catch(error => console.log(error));

//SEARCH FOR ALL HUMAN CREW MEMBERS OF ENTERPRISE

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

//EAGER LOADING WITH ALIAS TO FIND ALL CREW MEMBERS OF PLANET EXPRESS

// conn.sync({ force: true })
// .then(() => seed())
// .then(() => Ship.findOne({
//   where: {
//     name: 'Planet Express'
//   },
//     include: [{
//       model: Member,
//       as: 'occupants'
//     }]
//   }))
// .then(ship => ship.occupants.forEach(occupant => console.log(occupant.name)))
// .catch(error => console.log(error));

// EAGER LOADING WITH ALIAS TO FIND HYBRID CREW MEMBERS OF ENTERPRISE

// conn.sync({ force: true })
// .then(() => seed())
// .then(() => Ship.findOne({
//   where: {
//     name: 'Enterprise'
//   },
//     include: [{
//       model: Member,
//       as: 'occupants',
//       where: {
//         species: 'hybrid'
//       }
//     }]
//   }))
// .then(ship => ship.occupants.forEach(occupant => console.log(occupant.name)))
// .catch(error => console.log(error));
