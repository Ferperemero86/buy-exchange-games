function middleware(Model, TargetModel, action) { //{TargetModel, action}
  const CanCan = require("cancan");
  const cancan = new CanCan();
  const { allow, can } = cancan;
  const User = require("../db/models/user");
  const AdminUser = require("../db/models/admin-user");
  const GamesLists = require("../db/models/games-lists");

  return function (req, res, next) {
    const modelInstance = new Model(req.user);
    const targetModelInstance = new TargetModel(req.user);
   
    allow (AdminUser, "manage", User, (user) => {
      if (user.get("isAdmin")) {
        return true;
      }
      return false;
    });

    allow (User, ["edit", "delete", "create", "save", "read"], User, (user, target) => {
      if (user.id === target.id) {
        return true;
      } else {
        return false;
      }
    });

    allow (User, ["create", "save", "delete", "edit"], GamesLists, (user, target) => {
      if (user.id === target.id) {
        return true;
      } else {
        return false;
      }
    });

    allow (User, "read", GamesLists);

    console.log("CAN USER?", can(modelInstance, action, targetModelInstance));

    if (!can(modelInstance, action, targetModelInstance)) {
      return res.status(403).json({ authError: true });
    }
    console.log("NEXT!");
    return next();
 };
}

module.exports = middleware;
