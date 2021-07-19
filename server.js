const express = require("express");
const path = require('path'); //a node native module
const {Item, Menu} = require('./models/index');
const {Restaurant} = require('./models/Restaurant');
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

const app = express();
const port = 3000;

// setup our templating engine
const handlebars = expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

app.engine('handlebars', handlebars)
app.set('view engine', 'handlebars')
//Q: What does express.static help us do?
//Q: What do you think path.join helps us do?
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

//will add routes
// 1)client makes a request -> request URL -> URL -> http request -> http response

//will add routes
app.get('/items', async (req, res) => {
    //goes into the database and looks for all Items
    const allItems = await Item.findAll()
    //server will respond with all the items found in the database
    res.json(allItems)
})

app.get('/randomItem', async (req, res) => {
    const randomNum = Math.floor(Math.random() * 3)
    const randomItem = await Item.findByPk(randomNum)

    res.json(randomItem)
})

app.get('/flipcoin', (req, res) => {
    const coinFlip = !Math.floor(Math.random() * 2) ? 'heads': 'tails';
    res.send(coinFlip);
});

app.get('/restaurants', async(req, res) => {
    //goes into the database and looks for all Items
    const allRestaurants = await Restaurant.findAll()
    //server will respond with all the items found in the database
    res.json(allRestaurants)
});

app.get('/restaurant/:id', async(req, res) => {
    //goes into the database and looks for all Items
    const restaurant = await Restaurant.findByPk(req.params.id);
    //server will respond with all the items found in the database
    res.json(restaurant)
});

app.get('/restaurant/menu/:id', async(req, res) => {
    //goes into the database and looks for all Items
    const restaurantMenu = await Menu.findByPk(req.params.id, {include: Restaurant})
    //server will respond with all the items found in the database
    res.json(restaurantMenu)
});

app.post('/restaurants', async (req, res) => {
    await Restaurant.create(req.body);
    res.send(req.body);
})

app.put('/restaurants/:id', (req, res) => {
    Restaurant.update({name: req.body.name}, {where: req.params.id})
    res.send(req.body)
})

app.delete('/restaurants/:id', (req, res) => {
    Restaurant.destroy({where: req.params.id})
})

app.get('web/restaurants/', async (req, res) => {
    const restaurants = await Restaurant.findAll();
    res.render('restaurants', {restaurants});
})

//Q: What will our server be doing?
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
