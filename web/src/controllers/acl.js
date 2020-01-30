function middleware(Targetmodel, action) {
  const CanCan = require("cancan");
  const cancan = new CanCan();
  const { allow, can } = cancan;
  const User = require("../db/models/user");

  return function(req, res, next) {
    const userModelInstance = new User(req.user);
    const targetModelInstance = new Targetmodel(req.user);

    allow(User, ["edit", "delete"], User, (user, target) => {
      if (user.id === target.id && !user.getAdmin(req.user)) {
        return true;
      } else {
        return false;
      }
    });

    if (!can(userModelInstance, action, targetModelInstance)) {
      res.status(403).send({ authError: "User not auhorised" });
    }
    return next();
  };
}

module.exports = middleware;
