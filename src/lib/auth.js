export const getUserRole = (user) => {
    console.log("Checking user role for:", user?.email);
    console.log("📋 Full user object:", user);
  
    if (!user) {
      console.log("No user provided");
      return null;
    }
  
    const appMetadataRoles = user?.app_metadata?.roles;
    const userMetadataRoles = user?.user_metadata?.roles;
    const customClaimsRoles = user?.["https://clicks-hr.api/roles"];
  
    const roles =
      (Array.isArray(appMetadataRoles) && appMetadataRoles) ||
      (Array.isArray(customClaimsRoles) && customClaimsRoles) ||
      (Array.isArray(userMetadataRoles) && userMetadataRoles) ||
      [];
  
    console.log("✅ Final roles array:", roles);
  
    if (roles.includes("admin")) {
      console.log("User is ADMIN");
      return "admin";
    }
  
    if (roles.includes("user")) {
      console.log("User is USER");
      return "user";
    }
  
    // ❌ REMOVE this line 👇 (or just remove omaralnabulsi1@gmail.com from the array)
    const adminEmails = ["22110038@htu.edu.jo"];
    if (adminEmails.includes(user.email)) {
      console.log("User is ADMIN (by email fallback)");
      return "admin";
    }
  
    console.log("👤 Defaulting to USER");
    return "user";
  };
  