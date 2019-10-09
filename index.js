var SERVER_NAME = 'product-api'
var PORT = 3009;
var HOST = '127.0.0.1';
var getrq = 0;
var postrq = 0;



var restify = require('restify')

  // Get a persistence engine for the products
  , productsSave = require('save')('products')

  // Create the restify server
  , server =restify.createServer({ name: SERVER_NAME})

  server.listen(PORT, HOST, function () {
  console.log('Server %s listening at %s', server.name, server.url)
  console.log('Resources:')
  console.log("Endpoints::" +server.url+ "method:: GET, POST, DELETE")
  console.log(' /products')
  console.log(' /products/:id'
  
  )  
})

server
  // Allow the use of POST
  .use(restify.fullResponse())

  // Maps req.body to req.params so there is no switching between them
  .use(restify.bodyParser())

// Get all products in the system
server.get('/products', function (req, res, next) {
  getrq +=1;

  console.log('product GET: Received request')
  // Find every entity within the given collection
  productsSave.find({}, function (error, products) {

    // Return all of the products in the system
    res.send(products)
    console.log('Product Get: received response')
    console.log(products);
    counter();
  })
})

// // Get a single product by their product id
server.get('/products/:id', function (req, res, next) {

  // Find a single product by their id within save
  productsSave.findOne({ _id: req.params.id }, function (error, product) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    if (product) {
      // Send the product if no issues
      res.send(product)
      console.log(product)
    } else {
      // Send 404 header if the product doesn't exist
      res.send(404);
 
    }
  })
})

// Create a new product
server.post('/products', function (req, res, next) {
  postrq +=1
  // Make sure name is defined
  if (req.params.product === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('Correct product name required'))
  }
  if (req.params.price === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('Must provide integer no.'))
  }

  if (req.params.category === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('Correct category pattern required'))
  }
  var newproduct = {
    product: req.params.product, 
    price: req.params.price,
    category: req.params.category

  }
  
  // Create the product using the persistence engine
  productsSave.create( newproduct, function (error, product) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send the product if no issues
    res.send(201, product)
counter();
console.log(product);
  })
})



// Delete product with the given id
server.del('/products', function (req, res, next) {
 
  // Delete the product with the persistence engine
  productsSave.deleteMany(req.params, function (error, product) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send a 200 OK response
    res.send();
    
    
    
  })
})

function counter(){
  console.log("Process Counter --> Get:"+getrq+", Post:"+ postrq);
}

