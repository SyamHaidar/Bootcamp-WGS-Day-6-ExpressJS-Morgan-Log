const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const fs = require('fs')
const validator = require('validator')

// ---------------------------------------------------------------------------

const app = express()
const port = 3000

// middleware
app.use(express.urlencoded({ extended: true }))

// contact data JSON
const dataPath = './data/contacts.json'

// Error message if valdator not valid
let errorName = ''
let errorEmail = ''
let errorPhone = ''
let deleteMessage = ''
let saveMessage = ''
let updateMessage = ''

// get data
const getData = () => {
  const jsonData = fs.readFileSync(dataPath)
  return JSON.parse(jsonData)
}

// save data
const saveData = (name, email, phone) => {
  const contact = { name, email, phone }
  const contacts = getData()

  contacts.push(contact)
  fs.writeFileSync(dataPath, JSON.stringify(contacts))
}

// update data
const updateData = (name, email, phone) => {
  const contact = { name, email, phone }

  const newContact = getData()

  newContact.push(contact)
  fs.writeFileSync(dataPath, JSON.stringify(newContact))
}

// delete data
const deleteData = (name) => {
  const contacts = getData()
  const filterContact = contacts.filter(
    (contact) => contact.name.toLowerCase() !== name.toLowerCase()
  )

  fs.writeFileSync(dataPath, JSON.stringify(filterContact))
}

// ---------------------------------------------------------------------------

// EJS
app.set('view engine', 'ejs')
app.use(expressLayouts)

// --- home ---
app.get('/', (req, res) => {
  res.render('index', {
    // send variable title and name to HTML
    title: 'ExpressJS web server',
    page: 'home',
    name: 'Syam',
  })
})

// --- contact ---
app.get('/contact', (req, res) => {
  const contacts = getData()

  res.render('contact', {
    title: 'Contact - ExpressJS web server',
    page: 'contact',
    message: {
      errorName: errorName,
      errorEmail: errorEmail,
      errorPhone: errorPhone,
      saveMessage: saveMessage,
      updateMessage: updateMessage,
      deleteMessage: deleteMessage,
    },
    data: contacts,
  })

  errorName = ''
  errorEmail = ''
  errorPhone = ''
  saveMessage = ''
  updateMessage = ''
  deleteMessage = ''
})

// add new contact
app.post('/contact', (req, res) => {
  const contacts = getData()
  const currentData = contacts.find(
    (contact) => contact.name.toLowerCase() === req.body.name.toLowerCase()
  )

  // check if new data not exist
  if (currentData) {
    errorName = 'Contact Name already recorded. Please use another name'
  }

  // check if email valid
  if (req.body.email) {
    if (!validator.isEmail(req.body.email)) {
      errorEmail = 'Please input correct email'
    }
  }

  // check if phone number valid
  if (!validator.isMobilePhone(req.body.phone, ['id-ID'])) {
    errorPhone = 'Please input correct phone number'
  }

  // check if all input data corect and valid
  if (
    !currentData &&
    validator.isEmail(req.body.email) &&
    validator.isMobilePhone(req.body.phone, ['id-ID'])
  ) {
    // if success send message and save data
    saveData(req.body.name, req.body.email, req.body.phone)
    saveMessage = 'Data saved!'
  }

  res.redirect('/contact')
})

// edit contact
app.get('/contact/:name/edit', (req, res) => {
  const contacts = getData()

  const data = contacts.find(
    (contact) => contact.name.toLowerCase() === req.params.name.toLowerCase()
  )

  res.render('contactEdit', {
    title: 'Contact - ExpressJS web server',
    page: 'contact',
    message: { errorName: errorName, errorEmail: errorEmail, errorPhone: errorPhone },
    data: data,
  })

  errorName = ''
  errorEmail = ''
  errorPhone = ''
})

// update contact
app.post('/contact/update', (req, res) => {
  const contacts = getData()
  const currentData = contacts.find(
    (contact) => contact.name.toLowerCase() === req.body.name.toLowerCase()
  )

  deleteData(req.body.oldName)

  // check if new name not exist
  if (req.body.oldName !== req.body.name) {
    if (currentData) {
      errorName = 'Contact Name already recorded. Please use another name'
      req.body.name = req.body.oldName
    }
  }

  // check if email valid
  if (req.body.email) {
    if (!validator.isEmail(req.body.email)) {
      errorEmail = 'Please input correct email'
      req.body.email = currentData.email
    }
  }

  // check if phone number valid
  if (!validator.isMobilePhone(req.body.phone, ['id-ID'])) {
    errorPhone = 'Please input correct phone number'
    req.body.phone = currentData.phone
  }

  // if currentData not exist and data valid then update with new data
  updateData(req.body.oldName, req.body.name, req.body.email, req.body.phone)

  // check if all input data corect and valid
  if (
    !currentData &&
    validator.isEmail(req.body.email) &&
    validator.isMobilePhone(req.body.phone, ['id-ID'])
  ) {
    // if success send message and redirect to contact
    updateMessage = 'Data updated!'
    res.redirect('/contact')
  } else {
    // if failed redirect to edit
    res.redirect(`/contact/${req.body.oldName}/edit`)
  }
})

// delete contact
app.post('/contact/:name/delete', (req, res) => {
  deleteData(req.params.name)
  deleteMessage = 'Data deleted!'
  res.redirect('/contact')
})

// --- about ---
app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About - ExpressJS web server',
    page: 'about',
  })
})

// route with parameter
app.get('/product/:id', (req, res) => {
  res.send(`<h3>Prodcut id: ${req.params.id} </br> Category: ${req.query.category}</h3>`)
})

// ---------------------------------------------------------------------------

app.use('/', (req, res) => {
  res.status(404)
  res.render('404')
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
