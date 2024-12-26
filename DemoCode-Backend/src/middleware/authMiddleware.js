const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authMiddleWare = (req, res, next) => {
    const authHeader = req.headers.token;
    if (!authHeader) {
      return res.status(401).json({
        message: 'No token provided',
        status: 'ERROR',
      });
    }
  
    const token = authHeader.split(' ')[1];  // Tách token sau Bearer
    if (!token) {
      return res.status(401).json({
        message: 'No token provided',
        status: 'ERROR',
      });
    }
  
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
      if (err) {
        return res.status(403).json({
          message: 'Invalid or expired token',
          status: 'ERROR',
        });
      }
      req.user = user;  // Gán thông tin người dùng vào req
      next();
    });
  };
  
  const authUserMiddleWare = (req, res, next) => {
    const authHeader = req.headers.token;
    if (!authHeader) {
      return res.status(401).json({
        message: 'No token provided',
        status: 'ERROR',
      });
    }
  
    const token = authHeader.split(' ')[1];  // Tách token sau Bearer
    const userId = req.params.id;
    
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
      if (err) {
        return res.status(403).json({
          message: 'Authentication failed or expired token',
          status: 'ERROR',
        });
      }
  
      // Kiểm tra quyền truy cập của người dùng
      if (user?.isAdmin || user?.id === userId) {
        next();
      } else {
        return res.status(403).json({
          message: 'You do not have permission',
          status: 'ERROR',
        });
      }
    });
  };
  
  module.exports = {
    authMiddleWare,
    authUserMiddleWare,
  };
  
