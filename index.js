const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

let phoneBookEntries = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

morgan.token('postData' , (req) => {

  if (req.method === 'POST') {
    const data = JSON.stringify(req.body)
    return data
  }
  return '';
})

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))

app.get('/api/persons', (req, res) => {
    res.json(phoneBookEntries)
})

app.get('/info', (req, res) => {

  const htmlData = `
      <html>
        <head>
            <title>Info</title>
        </head>
        <body>
            <p>Phonebook has info for ${phoneBookEntries.length} people</p>
            <br/>
            <p>${new Date().toString()}</p>
        </body>
      </html>
  `
  
  res.send(htmlData)
})

app.get('/api/persons/:id', (req, res) => {
  const id = (req.params.id)

  const entry = phoneBookEntries.find((entry) => entry.id === id)

  if (entry) {
    res.json(entry)
  }
  else {
    res.status(404).end()
  }
})

app.post ('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({
      error : 'Contact Information Missing'
    })
  }
  else if (phoneBookEntries.find((entry) => entry.name === body.name)) {
    return res.status(400).json({
      error : 'Name already exists'
    })
  }

  const entry = {
    "id" : `${Math.floor(Math.random(1)*2000)}`,
    "name" : body.name,
    "number" : body.number
  }

  phoneBookEntries = phoneBookEntries.concat(entry)
  res.json(entry)
})

app.delete('/api/persons/:id', (req, res) => {

  const id = req.params.id
  phoneBookEntries = phoneBookEntries.filter((entry) => entry.id !== id)

  res.status(204).end()
  
})



const PORT = process.env.PORT || 3001
app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`)
})
