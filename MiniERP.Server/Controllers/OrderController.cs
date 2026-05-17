using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiniERP.Server.Data;
using MiniERP.Server.Models;

namespace MiniERP.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase {
    private readonly AppDbContext _context;

    public OrdersController(AppDbContext context) {
        _context = context;
    }

    [HttpGet]
    public IActionResult Get() {
        var orders = _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.Items)
                .ThenInclude(i => i.Product)
            .ToList();
        return Ok(orders);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id) {
        var order = _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.Items)
                .ThenInclude(i => i.Product)
            .FirstOrDefault(o => o.Id == id);

        if (order == null) return NotFound();
        return Ok(order);
    }

    [HttpPost]
    public IActionResult Post(Order order) {
        order.CreatedAt = DateTimeOffset.UtcNow;
        _context.Orders.Add(order);

        // Odečtení stocku v DB
        foreach (var item in order.Items) {
            var product = _context.Products.Find(item.ProductId);
            if (product != null) {
                product.Stock -= item.Quantity;
            }
        }

        _context.SaveChanges();
        return Ok(order);
    }

    [HttpPut("{id}/status")]
    public IActionResult UpdateStatus(int id, [FromBody] string status) {
        var order = _context.Orders.Find(id);
        if (order == null) return NotFound();

        order.Status = status;
        _context.SaveChanges();
        return Ok(order);
    }
}