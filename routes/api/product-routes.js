const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  try {
    // find all products
    const productData = await Product.findAll({include: Category});  
    res.status(200).json(productData);
  } catch (err) {
      res.status(500).json(err);
  }
  
  // be sure to include its associated Category and Tag data
});

// find a single product by its `id`
router.get('/:id', async (req, res) => {
  try {
    const productData = await Product.findByPk(req.params.id, { include: Category });
    if (!productData) {
      res.status(404).json("No product found with this id");
      return;
    }
    res.status(200).json(productData);
  } catch (err) {
      res.status(500).json(err);
  }
  }
);

// create new product
router.post('/', async (req, res) => {
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', async (req, res) => {
  try{
    const productData = await Product.update({
      id: req.body.id,
      product_name: req.body.product_name,
      price: req.body.price,
      stock: req.body.stock,
      category_id: req.body.category_id,
      product_id: req.body.product_id,
      category: {
        id: req.body.id,
        category_name: req.body.category_name
      }
    },
    {
      where: {
        id: req.body.id
      }
    })
    res.status(200).json(productData);
  }
  catch (err) {
    res.status(500).json(err);
  }
});

// delete one product by its `id` value
router.delete('/:id', async (req, res) => {
  try{
    const productData = await Product.destroy({
      where: {
        id: req.params.id
      }
    });
    if (!productData) {
      res.status(404).json({message: "No product found with this id"});
      return;
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
