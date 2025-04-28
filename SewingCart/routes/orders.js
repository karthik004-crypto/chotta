const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @route   GET api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .populate('items.product');
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.product');
        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }

        // Check if order belongs to user
        if (order.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        res.json(order);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Order not found' });
        }
        res.status(500).send('Server error');
    }
});

// @route   POST api/orders
// @desc    Create new order
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;

        // Get user's cart
        const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ msg: 'Cart is empty' });
        }

        // Check stock and calculate total
        let totalAmount = 0;
        for (const item of cart.items) {
            const product = await Product.findById(item.product._id);
            if (!product) {
                return res.status(404).json({ msg: 'Product not found' });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ msg: `Not enough stock for ${product.name}` });
            }
            totalAmount += item.price * item.quantity;
        }

        // Create order
        const order = new Order({
            user: req.user.id,
            items: cart.items.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.price
            })),
            shippingAddress,
            paymentMethod,
            totalAmount,
            shippingCost: 10, // Example shipping cost
            tax: totalAmount * 0.1 // Example tax calculation
        });

        // Update product stock
        for (const item of cart.items) {
            await Product.findByIdAndUpdate(item.product._id, {
                $inc: { stock: -item.quantity }
            });
        }

        // Clear cart
        cart.items = [];
        await cart.save();

        // Save order
        await order.save();
        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put('/:id/status', auth, async (req, res) => {
    try {
        const { orderStatus, paymentStatus, trackingNumber } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }

        // Update fields
        if (orderStatus) order.orderStatus = orderStatus;
        if (paymentStatus) order.paymentStatus = paymentStatus;
        if (trackingNumber) order.trackingNumber = trackingNumber;

        await order.save();
        res.json(order);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Order not found' });
        }
        res.status(500).send('Server error');
    }
});

module.exports = router; 