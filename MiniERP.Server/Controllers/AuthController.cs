using Microsoft.AspNetCore.Mvc;
using MiniERP.Server.Models;
using MiniERP.Server.DTOs;
using Microsoft.AspNetCore.Identity;

namespace MiniERP.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase {
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;

    public AuthController(UserManager<User> userManager, SignInManager<User> signInManager) {
        _userManager = userManager;
        _signInManager = signInManager;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequestDTO request) {
        var user = await _userManager.FindByNameAsync(request.Username);

        if (user == null) {
            return Unauthorized(new { message = "Neplatné jméno nebo heslo" });
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);

        if (!result.Succeeded) {
            return Unauthorized(new { message = "Neplatné jméno nebo heslo" });
        }

        var response = new LoginResponseDTO {
            Username = user.UserName ?? string.Empty,
            Role = user.Role,
            Token = "fake-jwt-token" // Pro demo účely
        };

        return Ok(response);
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout() {
        await _signInManager.SignOutAsync();
        return Ok(new { message = "Odhlášení úspěšné" });
    }
}
