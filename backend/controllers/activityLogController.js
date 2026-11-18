const ActivityLog = require('../models/ActivityLog');

const getLogs = async (req, res, next) => {
  try {
    const { ispOwner, user, entityType, page = 1, limit = 20 } = req.query;
    const query = {};
    if (ispOwner) query.ispOwner = ispOwner;
    if (user) query.user = user;
    if (entityType) query.entityType = entityType;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [logs, total] = await Promise.all([
      ActivityLog.find(query)
        .populate('user', 'username role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      ActivityLog.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: logs,
      totalDocs: total,
      totalPages: Math.ceil(total / parseInt(limit)),
      page: parseInt(page)
    });
  } catch (error) { next(error); }
};

module.exports = { getLogs };
