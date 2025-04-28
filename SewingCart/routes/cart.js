const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @route   GET api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
        if (!cart) {
            cart = new Cart({ user: req.user.id, items: [] });
            await cart.save();
        }
        res.json(cart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/cart
// @desc    Add item to cart
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        // Check if product is in stock
        if (product.stock < quantity) {
            return res.status(400).json({ msg: 'Not enough stock available' });
        }

        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            cart = new Cart({ user: req.user.id, items: [] });
        }

        // Check if product already in cart
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({
                product: productId,
                quantity,
                price: product.price
            });
        }

        await cart.save();
        res.json(cart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/cart/:itemId
// @desc    Update cart item quantity
// @access  Private
router.put('/:itemId', auth, async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart = await Cart.findOne({ user: req.user.id });
        
        if (!cart) {
            return res.status(404).json({ msg: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item._id.toString() === req.params.itemId);
        if (itemIndex === -1) {
            return res.status(404).json({ msg: 'Item not found in cart' });
        }

        // Check if product is in stock
        const product = await Product.findById(cart.items[itemIndex].product);
        if (product.stock < quantity) {
            return res.status(400).json({ msg: 'Not enough stock available' });
        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        res.json(cart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   DELETE api/cart/:itemId
// @desc    Remove item from cart
// @access  Private
router.delete('/:itemId', auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ msg: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
        await cart.save();
        res.json(cart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   DELETE api/cart
// @desc    Clear cart
// @access  Private
router.delete('/', auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ msg: 'Cart not found' });
        }

        cart.items = [];
        await cart.save();
        res.json(cart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router; 