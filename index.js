require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
app.use(express.json())
app.use(express.static('build'))
app.use(cors())

const PORT = process.env.PORT

morgan.token('body', function (request, response) {
  if (request.method === 'POST') {
    return JSON.stringify(request.body)
  }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const error = (response, errorMessage) => {
  return response.status(400).json({
    error: errorMessage
  })
}

app.get('/api/persons', (request, response) => {
  Person.find({})
    .then( result => {
      console.log( result)
      response.json(result)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then( person => {
      response.json(person)
    })
    .catch( error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then( result => {
      response.sendStatus(204).end()
    })
    .catch( error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then( savedPerson => {
      response.json(savedPerson)
    }).catch( error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then( updatedData => {
      response.json(updatedData)
    })
    .catch( error => next(error))
})

app.get('/info', (request, response, next) => {
  Person.count( (error, count) => {
    if (error) {
      next(error)
    }
    const date = new Date()
    const info = `<p>Phonebook has info for ${count} people</p>
                <p>${date}</p>`
    response.send(info)
  })

})

const errorHandler = (error, request, response, next) => {
  console.error(error)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
