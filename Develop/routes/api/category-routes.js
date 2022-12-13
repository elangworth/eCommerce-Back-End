const router = require('express').Router();
const { Category, Product, Tag } = require('../../models');

// The `/api/categories` endpoint

// find all categories
router.get('/', async (req, res) => {
  try{
    const categoryData = Category.findAll();
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
  // be sure to include its associated Products
});
// find one category by its `id` value
router.get('/:id', async (req, res) => {
  try {
    const categoryData = Category.findByPk(req.params.id, {
      include: [{model: Product, through: Tag, as: 'item_tags'}]
    });
    if (!categoryData) {
      res.status(404).json({message: "There is no Category with that id"});
      return;
    }
    res.status(200).json(categoryData); 
  } catch (err) {
    res.status(500).json(err);
  }
  // be sure to include its associated Products
});

// create a new category
router.post('/', async (req, res) => {
  try{
    const categoryData = Category.create(req.body);
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// update a category by its `id` value
router.put('/:id', async (req, res) => {
  try{
    const categoryData = await Category.update({
      category_name: req.body.category_name
    })
    res.status(200).json(categoryData);
  }
  catch (err) {
    res.status(500).json(err);
  }
});

// delete a category by its `id` value
router.delete('/:id', async (req, res) => {
  try{
    const categoryData = await Category.destroy({
      where: {
        id: req.params.id
      }
    });
    if (!categoryData) {
      res.status(404).json({message: "No category found with this id"});
      return;
    }
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
