const Product = require('../models/Product');

// GET /api/products
exports.getAllProducts = async (req, res, next) => {
  try {
    const { category, sort, limit } = req.query;
    
    let query = {};
    if (category) {
      query.category = category;
    }
    
    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'name') sortOption = { name: 1 };
    
    let productsQuery = Product.find(query).sort(sortOption);
    
    if (limit) {
      productsQuery = productsQuery.limit(parseInt(limit));
    }
    
    const products = await productsQuery;
    
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        error: {
          message: 'Product not found',
          status: 404
        }
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/products (Admin only)
exports.createProduct = async (req, res, next) => {
  try {
    const { name, price, description, category, imageUrl, stock, featured } = req.body;
    
    const product = new Product({
      name,
      price,
      description,
      category,
      imageUrl,
      stock,
      featured
    });
    
    const savedProduct = await product.save();
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: savedProduct
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: {
          message: 'Validation failed',
          details: Object.values(error.errors).map(err => ({
            field: err.path,
            message: err.message
          }))
        }
      });
    }
    next(error);
  }
};

// PUT /api/products/:id (Admin only)
exports.updateProduct = async (req, res, next) => {
  try {
    const { name, price, description, category, imageUrl, stock, featured } = req.body;
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price,
        description,
        category,
        imageUrl,
        stock,
        featured
      },
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!product) {
      return res.status(404).json({
        error: {
          message: 'Product not found',
          status: 404
        }
      });
    }
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: {
          message: 'Validation failed',
          details: Object.values(error.errors).map(err => ({
            field: err.path,
            message: err.message
          }))
        }
      });
    }
    next(error);
  }
};

// DELETE /api/products/:id (Admin only)
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        error: {
          message: 'Product not found',
          status: 404
        }
      });
    }
    
    res.json({
      success: true,
      message: 'Product deleted successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};
