require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Connect Database
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(cors());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Socket.io integration
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('join', (room) => {
    socket.join(room);
  });
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});
app.set('io', io);

// Mount API Routes
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/customer', require('./routes/customer'));
app.use('/api/v1/static-customer', require('./routes/staticCustomer'));
app.use('/api/v1/hotspot-customer', require('./routes/hotspotCustomer'));
app.use('/api/v1/package', require('./routes/package'));
app.use('/api/v1/invoice', require('./routes/invoice'));
app.use('/api/v1/area', require('./routes/area'));
app.use('/api/v1/sub-area', require('./routes/subArea'));
app.use('/api/v1/pole-box', require('./routes/poleBox'));
app.use('/api/v1/reseller', require('./routes/reseller'));
app.use('/api/v1/collector', require('./routes/collector'));
app.use('/api/v1/manager', require('./routes/manager'));
app.use('/api/v1/staff', require('./routes/staff'));
app.use('/api/v1/expenditure', require('./routes/expenditure'));
app.use('/api/v1/report', require('./routes/report'));
app.use('/api/v1/mikrotik', require('./routes/mikrotik'));
app.use('/api/v1/support-ticket', require('./routes/supportTicket'));
app.use('/api/v1/dashboard', require('./routes/dashboard'));
app.use('/api/v1/activity-log', require('./routes/activityLog'));

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'OK', message: 'ISP Billing API is running smoothly' });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 9009;
server.listen(PORT, () => {
  console.log(`ISP Billing API Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
