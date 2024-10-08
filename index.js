const express = require('express')
const app = express()

const phoneBookEntries = [
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

app.use(express.json())

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

const PORT = 3001
app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`)
})
