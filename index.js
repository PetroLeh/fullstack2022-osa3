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
        console.log( result);
        response.json(result)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then( person => {
        response.json(person)
    })
})

app.delete('/api/persons/:id', (request, response) => {

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return error(response, 'name is missing')
    }
    if (!body.number) {
        return error(response, 'number is missing')
    }
     
    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save()
    .then( savedPerson => {
        response.json(savedPerson)
    })
})

app.get('/info', (request, response) => {
    const num = 1
    const date = new Date()

    info = `<p>Phonebook has info for ${num} people</p>
            <p>${date}</p>`
    response.send(info)

})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
