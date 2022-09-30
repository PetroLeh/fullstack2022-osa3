const express = require('express')
const morgan = require('morgan')

const app = express()
app.use(express.json())
morgan.token('body', function (request, response) {
    if (request.method === 'POST') {
        return JSON.stringify(request.body)
    }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const PORT = 3001

let persons = [{
        id: 1,
        name: "Aku Ancka",
        number: "313"
    },
    {
        id: 2,
        name: "Iines Ancka",
        number: "911"
    },
    {
        id: 3,
        name: "Roope Ancka",
        number: "12345"
    },
    {
        id: 4,
        name: "kapteeni Haddock",
        number: "###*&%!"
    }
]

const generateId = () => Math.floor(Math.random() * 10000)

const error = (response, errorMessage) => {
    return response.status(400).json({
        error: errorMessage
    })
}

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {

    const id = Number(request.params.id)
    console.log(`DELETE request for id ${id}`)
    persons = persons.filter(p => p.id !== id)

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
    if (persons.find(p => p.name.toLowerCase() === body.name.toLowerCase())) {
        return error(response, 'name has to be unique')
    }
    
    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    response.json(person)
})

app.get('/info', (request, response) => {
    const num = persons.length
    const date = new Date()

    info = `<p>Phonebook has info for ${num} people</p>
            <p>${date}</p>`
    response.send(info)

})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
