const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const fs = require('fs')

// ---------------------------------------------------------------------------

const app = express()
const port = 3000

// middleware
app.use(express.urlencoded({ extended: true }))

// contact data JSON
const dataPath = './data/contacts.json'

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
const updateData = (oldName, name, email, phone) => {
  const contact = { name, email, phone }

  deleteData(oldName)

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
    data: contacts,
  })
})

// add new contact
app.post('/contact/save', (req, res) => {
  saveData(req.body.name, req.body.email, req.body.phone)
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
    data: data,
  })
})

// update contact
app.post('/contact/update', (req, res) => {
  updateData(req.body.oldName, req.body.name, req.body.email, req.body.phone)
  res.redirect('/contact')
})

// delete contact
app.post('/contact/:name/delete', (req, res) => {
  deleteData(req.params.name)
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
