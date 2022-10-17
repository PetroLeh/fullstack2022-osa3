const mongoose = require('mongoose')

if (process.argv.length !== 3 && process.argv.length !== 5) {
  console.log('usage:')
  console.log('node mongo.js <password> [name] [number]')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.krngqef.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

const showAll = () => {
  Person.find({}).then( result => {
    console.log('phonebook:')
    result.forEach( person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}

const addPerson = ( newName, newNumber ) => {
  const person = new Person({
    name: newName,
    number: newNumber
  })

  person.save().then( result => {
    console.log(`added ${newName} number ${newNumber} to phonebook`)
    mongoose.connection.close()
  })
}

if (process.argv.length === 3) showAll()
if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]
  addPerson(name, number)
}