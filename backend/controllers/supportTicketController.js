const SupportTicket = require('../models/SupportTicket');

const getTickets = async (req, res, next) => {
  try {
    const { ispOwner, status, priority, page = 1, limit = 10 } = req.query;
    const query = {};
    if (ispOwner) query.ispOwner = ispOwner;
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [tickets, total] = await Promise.all([
      SupportTicket.find(query)
        .populate('customer', 'name phone')
        .populate('assignedTo', 'username')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      SupportTicket.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: tickets,
      totalDocs: total,
      totalPages: Math.ceil(total / parseInt(limit)),
      page: parseInt(page)
    });
  } catch (error) { next(error); }
};

const getTicket = async (req, res, next) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id)
      .populate('customer', 'name phone address')
      .populate('assignedTo', 'username')
      .populate('ispOwner', 'name');
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    res.status(200).json({ success: true, data: ticket });
  } catch (error) { next(error); }
};

const createTicket = async (req, res, next) => {
  try {
    const ticket = await SupportTicket.create(req.body);
    res.status(201).json({ success: true, data: ticket, message: 'Support ticket created' });
  } catch (error) { next(error); }
};

const updateTicket = async (req, res, next) => {
  try {
    const ticket = await SupportTicket.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    res.status(200).json({ success: true, data: ticket, message: 'Ticket updated' });
  } catch (error) { next(error); }
};

const deleteTicket = async (req, res, next) => {
  try {
    const ticket = await SupportTicket.findByIdAndDelete(req.params.id);
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    res.status(200).json({ success: true, message: 'Ticket deleted' });
  } catch (error) { next(error); }
};

module.exports = { getTickets, getTicket, createTicket, updateTicket, deleteTicket };
