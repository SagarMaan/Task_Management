//======================================= Name Regex Validation ========================================//


const validateUserName = (name) => {
    return (/^(?=.{1,50}$)[a-z]+(?:['_.\s][a-z]+)*$/i.test(name))
  }
  
  
  
  //====================================== Email Regex Validation =======================================//
  
  
  const validateEmailId = (emailId) => {
    return (/^[a-z]{1}[a-z0-9._]{1,100}[@]{1}[a-z]{2,15}[.]{1}[a-z]{2,10}$/.test(emailId))
  }
  
  
  //===================================== Password Regex Validation ====================================//
  
  
  const validatePassword = (password) => {
    return (/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(password));
  }

  
  // ===================================== Role validation ====================================== //
  
  
  const ValidateRoleStatus = (role) => { 
    return (["Task Creator", "Admin", "Visitor"].indexOf(role)) !== -1 
  }
  
  
  module.exports = { validateUserName , validateEmailId , validatePassword , ValidateRoleStatus }
  