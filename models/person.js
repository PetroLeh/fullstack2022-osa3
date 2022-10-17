const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log(`connecting to ${url}...`)
mongoose.connect(url)
  .then( result => {
    console.log('connected to MongoDB')
  })
  .catch( error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    minlength: 8,
    validate: {
      validator: value => {
        return /\b\d{3}-\d+/.test(value) || /\b\d{2}-\d+/.test(value)
      },
      message: props => `${props.value} is not a valid phone number`
    },
    required: true
  }
}).set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

console.log('importing model: person')
module.exports = mongoose.model('Person', personSchema)