const Request = require("../models/requestModel");
const User = require("../models/userModel");

module.exports = async (req, res, next) => {
    try {
      const request = await Request.findById(req.user.requestId);
      if (request && request.status === 'active') {
        await User.findByIdAndUpdate(req.user.id, { status: 'active' }, { new: true });
      }
      next();
    } catch (error) {
      console.error('Error updating user status:', error);
      res.status(500).json({ message: 'Error updating user status', success: false });
    }
  };