require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Contact = require('./models/contact')


const app = express()

// Middleware
morgan.token('postData' , (req) => {

  if (req.method === 'POST') {
    const data = JSON.stringify(req.body)
    return data
  }
  return '';
})

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))


/* GET Requests */
app.get('/api/persons', (req, res) => {

    Contact.find({}).then (result => {
      res.json(result)
    })
})

app.get('/api/persons/:id', (req, res) => {
  const id = (req.params.id)

  Contact
  .findById (id)
  .then ( (contact) => {
    if (contact) {
      res.json(contact)
    }
    else {
      res.status(404).end()
    }
  })

})

app.get('/info', (req, res) => {

  Contact.find({}).then(result => {

    const phonebookLength = result.length;
    const htmlResponse = `
      <html>
        <head>
          <title>Info</title>
        </head>
        <body>
          <p>Phonebook has info for ${phonebookLength} people</p>
          <br/>
          <p>${new Date().toString()}</p>
        </body>
      </html>
    `

    res.send(htmlResponse)
  })
})


/* POST Resquests */
app.post ('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({
      error : 'Contact Information Missing'
    })
  }
  /* **Error Handling

    else if (phoneBookEntries.find((entry) => entry.name === body.name)) {
      return res.status(400).json({
        error : 'Name already exists'
      })
    }
  */

  const newContact = new Contact ({
    "name" : body.name,
    "number" : body.number
  })

  newContact.save().then(result => {
    res.json(result)
  })
})

/* DELETE Request */
app.delete('/api/persons/:id', (req, res) => {

  const id = req.params.id
  Contact.findByIdAndDelete (id)
    .then (result => {
        res.status(204).end()
    })
    .catch (error => {
      res.status(500).send({error: 'An error occured'})
    })
  
})


/*___________________________________________*/
const PORT = process.env.PORT
app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`)
})
