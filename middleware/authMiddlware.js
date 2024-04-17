import jwt from 'jsonwebtoken'

export const verifyToken = async (req,res,next) => {
    const { token } = req.cookies;
    if (!token)
      return res.status(401).json({ success: false, message: "Access Denied" });
  
    const verified = jwt.verify(token, "secret");
    if (!verified)
      return res.status(401).json({ success: false, message: "Access Denied" });
  
      req.user=verified.id
      next()
  };
  