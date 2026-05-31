using Microsoft.AspNetCore.Identity;

namespace MiniERP.Server.Models;

public class User : IdentityUser {
    public string Role { get; set; } = "User";
}
