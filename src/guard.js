
export function isAuth(guard, roles, permissions) {

    if(!guard){
        return true
    }

    //菜单包含权
    let guardRoles = guard.roles || [];
    let guardPermissions = guard.permissions || [];

    if(!(guardRoles instanceof Array)){
        throw new Error("the guard's roles must be array")
    }
    if(!(guardPermissions instanceof Array)){
        throw new Error("the guard's permissions must be array")
    }

    let mode = guard.mode || "oneOf";

    if (guardRoles.length <= 0 && guardPermissions.length <= 0) {
      return true;
    }

    if (mode == "oneOf") {
      if (guardRoles.length > 0) {
        if (guardRoles.some(gr => roles.some(r => r == gr))) {
          return true;
        }
      }

      if (guardPermissions.length > 0) {
        if (guardPermissions.some(gp => permissions.some(p => p == gp))) {
          return true;
        }
      }

      return false;
    }

    if (guardRoles.length > 0) {
      if (guardRoles.every(gr => roles.some(r => r == gr))) {
        return true;
      }
    }

    if (guardPermissions.length > 0) {
      if (guardPermissions.every(gp => permissions.some(p => p == gp))) {
        return true;
      }
    }

    return false;
  }



